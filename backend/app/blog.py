"""技術ブログ「TECH BLOG」（Astro + microCMS、https://astro-microcms-blogs.vercel.app/）の最新記事を取得する。

ブログ本体（shim369/Astro-MicroCMS-Blog）と同じ microCMS の API（エンドポイント blogs）から、
公開日の新しい順に記事を取る。API キーはサーバーの環境変数（MICROCMS_SERVICE_DOMAIN / MICROCMS_API_KEY）に置き、
ブラウザには出さない。AI チャットの get_blog_posts ツールが使う（ページの記録欄は Next.js 側で同じ microCMS を読む）。
未設定・取得失敗のときは例外を送出し、ツールはその旨を結果として AI に返す。
"""

import re
import time
from dataclasses import asdict, dataclass
from datetime import datetime, timedelta, timezone
from typing import Any
from urllib.parse import quote

import httpx

from app.config import get_settings

BLOG_URL = "https://astro-microcms-blogs.vercel.app/"
# ブログ側の記事ページ（src/pages/articles/[slug].astro。slug は microCMS のコンテンツ ID）
ARTICLE_URL = BLOG_URL + "articles/{id}/"
ENDPOINT = "blogs"
FIELDS = "id,title,excerpt,eyecatch,category,publishedAt"
FETCH_TIMEOUT_SECONDS = 5
# 同じインスタンス内での再取得を避けるメモリ内キャッシュ（エージェントのツールからも呼ばれるため）
CACHE_TTL_SECONDS = 3600
MAX_POSTS = 3
# 一覧に出す概要の長さ（excerpt が長いとき）
EXCERPT_CHARS = 120
JST = timezone(timedelta(hours=9))
_cache: tuple[float, list[BlogPost]] | None = None


class BlogConfigError(Exception):
    """microCMS の環境変数が未設定。"""


@dataclass
class BlogPost:
    title: str
    url: str
    date: str
    category: str
    image: str
    excerpt: str = ""

    def to_dict(self) -> dict[str, str]:
        return asdict(self)


def _jst_date(value: str) -> str:
    """microCMS の日時（ISO 8601、UTC）を日本時間の YYYY-MM-DD にする。読めなければ空文字。"""
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00")).astimezone(JST).date().isoformat()
    except (AttributeError, ValueError):
        return ""


def _text(value: Any) -> str:
    return " ".join(value.split()) if isinstance(value, str) else ""


def _obj(value: Any) -> dict[str, Any]:
    return value if isinstance(value, dict) else {}


def parse_posts(data: dict[str, Any], limit: int = MAX_POSTS) -> list[BlogPost]:
    """microCMS のリスト API の応答（{"contents": [...]}）を BlogPost に変換する。"""
    posts: list[BlogPost] = []
    for item in data.get("contents") or []:
        if not isinstance(item, dict):
            continue
        content_id, title = _text(item.get("id")), _text(item.get("title"))
        # ID は URL のパスに入るため、想定外の文字を含むものは載せない
        if not title or not re.fullmatch(r"[A-Za-z0-9_-]+", content_id):
            continue
        eyecatch = _obj(item.get("eyecatch"))
        image = _text(eyecatch.get("url"))
        category = _obj(item.get("category"))
        excerpt = _text(item.get("excerpt"))
        if len(excerpt) > EXCERPT_CHARS:
            excerpt = excerpt[:EXCERPT_CHARS] + "…"
        posts.append(
            BlogPost(
                title=title,
                url=ARTICLE_URL.format(id=quote(content_id)),
                date=_jst_date(item.get("publishedAt", "")),
                category=_text(category.get("name")),
                # 外部の値なので、画像は https のみに限定する
                image=image if image.startswith("https://") else "",
                excerpt=excerpt,
            )
        )
    # API 側でも新しい順に並べているが、念のためこちらでも公開日で並べ直す
    posts.sort(key=lambda p: p.date, reverse=True)
    return posts[:limit]


async def fetch_latest_posts(limit: int = MAX_POSTS) -> list[BlogPost]:
    global _cache
    if _cache and time.monotonic() - _cache[0] < CACHE_TTL_SECONDS:
        return _cache[1][:limit]
    settings = get_settings()
    if not (settings.microcms_service_domain and settings.microcms_api_key):
        raise BlogConfigError("MICROCMS_SERVICE_DOMAIN / MICROCMS_API_KEY is not set")
    # サービスドメインは URL のホスト名に入るため、英数字とハイフンだけを受け付ける
    if not re.fullmatch(r"[a-z0-9-]+", settings.microcms_service_domain):
        raise BlogConfigError("MICROCMS_SERVICE_DOMAIN is invalid")
    url = f"https://{settings.microcms_service_domain}.microcms.io/api/v1/{ENDPOINT}"
    async with httpx.AsyncClient(timeout=FETCH_TIMEOUT_SECONDS) as client:
        response = await client.get(
            url,
            params={"limit": MAX_POSTS, "orders": "-publishedAt", "fields": FIELDS},
            headers={"X-MICROCMS-API-KEY": settings.microcms_api_key},
        )
        response.raise_for_status()
    posts = parse_posts(response.json())
    if posts:
        _cache = (time.monotonic(), posts)
    return posts[:limit]
