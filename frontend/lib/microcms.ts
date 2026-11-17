import "server-only";
import { createClient, type MicroCMSImage, type MicroCMSListContent } from "microcms-js-sdk";

/*
 * 記録（ブログ）欄のデータ。技術ブログ「TECH BLOG」（shim369/Astro-MicroCMS-Blog）と同じ microCMS から、
 * shim369/Nextjs-TypeScript-MicroCMS-Site と同じ方法（microcms-js-sdk の getList・公開日の新しい順）で取得する。
 * サーバー側だけで動かし、API キーはブラウザに出さない。ページは ISR で、記事を公開すると最長60秒で反映される
 */
export const BLOG_REVALIDATE_SECONDS = 60;
const ARTICLE_URL = "https://astro-microcms-blogs.vercel.app/articles/";

type Blog = MicroCMSListContent & {
  title: string;
  excerpt?: string;
  eyecatch?: MicroCMSImage;
  category?: { name: string } | null;
};

/** 一覧表示用（本文を含まない軽量版） */
export type BlogSummary = {
  id: string;
  title: string;
  url: string;
  /** 日本時間の YYYY-MM-DD */
  date: string;
  category: string | null;
  excerpt: string | null;
};

const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = process.env.MICROCMS_API_KEY;
// 環境変数がないとき（CI のビルドなど）は取得せず、ブログ欄はブログへのリンクだけを出す
const client = serviceDomain && apiKey ? createClient({ serviceDomain, apiKey }) : null;

const jstDate = (iso: string) => new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo" }).format(new Date(iso));

const toSummary = (blog: Blog): BlogSummary => ({
  id: blog.id,
  title: blog.title,
  url: `${ARTICLE_URL}${encodeURIComponent(blog.id)}/`,
  date: jstDate(blog.publishedAt ?? blog.createdAt),
  category: blog.category?.name ?? null,
  excerpt: blog.excerpt ?? null,
});

/** 公開日の新しい順に記事一覧を取得する。取得できなければ null */
export async function getBlogs(limit = 3): Promise<BlogSummary[] | null> {
  if (!client) {
    console.warn("[microCMS] MICROCMS_SERVICE_DOMAIN / MICROCMS_API_KEY が未設定のため、ブログ記事を取得しません");
    return null;
  }
  try {
    const { contents } = await client.getList<Blog>({
      endpoint: "blogs",
      queries: {
        limit,
        orders: "-publishedAt",
        fields: "id,title,excerpt,publishedAt,createdAt,eyecatch,category.name",
      },
      customRequestInit: { next: { revalidate: BLOG_REVALIDATE_SECONDS } },
    });
    return contents.map(toSummary);
  } catch (e) {
    console.error("[microCMS] ブログ記事の取得に失敗しました", e);
    return null;
  }
}
