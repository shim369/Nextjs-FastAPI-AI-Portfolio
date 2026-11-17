import asyncio

import pytest

from app import blog
from app.blog import BLOG_URL, BlogConfigError, fetch_latest_posts, parse_posts


def item(content_id: str, title: str, published: str, **extra) -> dict:
    return {"id": content_id, "title": title, "publishedAt": published, **extra}


def test_parse_posts_returns_latest_three_in_jst():
    data = {
        "contents": [
            # UTC 2026-11-07 15:30 は日本時間で 11-08
            item("a1", "First", "2026-11-07T15:30:00.000Z", category={"name": "Astro"},
                 eyecatch={"url": "https://images.microcms-assets.io/a.png"}, excerpt="概要"),
            item("a2", "Second", "2026-11-05T00:00:00.000Z"),
            item("a3", "Third", "2026-11-06T00:00:00.000Z"),
            item("a4", "Fourth", "2026-11-01T00:00:00.000Z"),
        ]
    }
    posts = parse_posts(data)
    assert [p.title for p in posts] == ["First", "Third", "Second"]
    first = posts[0]
    assert first.url == f"{BLOG_URL}articles/a1/"
    assert first.date == "2026-11-08"
    assert first.category == "Astro"
    assert first.image == "https://images.microcms-assets.io/a.png"
    assert first.excerpt == "概要"


def test_parse_posts_drops_unsafe_ids_and_non_https_images():
    data = {
        "contents": [
            item("../evil", "Bad id", "2026-01-01T00:00:00Z"),
            item("ok", "Good", "2026-01-02T00:00:00Z", eyecatch={"url": "http://insecure.example.com/a.jpg"}),
            item("no-title", "", "2026-01-03T00:00:00Z"),
            "not a dict",
        ]
    }
    posts = parse_posts(data)
    assert [p.title for p in posts] == ["Good"]
    assert posts[0].image == ""


def test_parse_posts_truncates_long_excerpt_and_tolerates_missing_fields():
    posts = parse_posts({"contents": [item("x", "T", "broken-date", excerpt="あ" * 300)]})
    assert posts[0].date == ""
    assert posts[0].excerpt == "あ" * blog.EXCERPT_CHARS + "…"
    assert parse_posts({}) == []


def test_fetch_requires_microcms_settings():
    with pytest.raises(BlogConfigError):
        asyncio.run(fetch_latest_posts())


def test_fetch_rejects_invalid_service_domain(monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setenv("MICROCMS_SERVICE_DOMAIN", "evil.example.com/x")
    monkeypatch.setenv("MICROCMS_API_KEY", "test-key")
    with pytest.raises(BlogConfigError):
        asyncio.run(fetch_latest_posts())


def test_fetch_calls_microcms_list_api_and_caches(monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setenv("MICROCMS_SERVICE_DOMAIN", "example")
    monkeypatch.setenv("MICROCMS_API_KEY", "test-key")
    calls = []

    async def fake_get(self, url, params=None, headers=None):
        calls.append((url, params, headers))
        return blog.httpx.Response(
            200,
            json={"contents": [item("p1", "Post", "2026-11-01T00:00:00Z")]},
            request=blog.httpx.Request("GET", url),
        )

    monkeypatch.setattr(blog.httpx.AsyncClient, "get", fake_get)
    posts = asyncio.run(fetch_latest_posts())
    again = asyncio.run(fetch_latest_posts(limit=1))

    assert [p.title for p in posts] == ["Post"] and [p.title for p in again] == ["Post"]
    assert len(calls) == 1  # 2回目はキャッシュから返す
    url, params, headers = calls[0]
    assert url == "https://example.microcms.io/api/v1/blogs"
    assert params["orders"] == "-publishedAt" and params["limit"] == 3
    assert headers == {"X-MICROCMS-API-KEY": "test-key"}
