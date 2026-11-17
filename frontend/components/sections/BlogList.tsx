"use client";

import { BLOG_URL } from "@/lib/config";
import { useI18n } from "@/lib/i18n";
import type { BlogSummary } from "@/lib/microcms";

/** posts: undefined = 読み込み中（スケルトン）、null か空 = 取得できなかった */
export default function BlogList({ posts }: { posts: BlogSummary[] | null | undefined }) {
  const { t } = useI18n();
  const loading = posts === undefined;
  const failed = !loading && (!posts || posts.length === 0);

  return (
    <>
      <ul className="blog" aria-label={t("blog.label")} aria-busy={loading}>
        {posts?.map((post) => (
          <li key={post.id}>
            <time dateTime={post.date}>{post.date.replaceAll("-", ".")}</time>
            <div>
              <h3>{post.title}</h3>
              {post.category && <span className="b-cat">{post.category}</span>}
            </div>
            <a className="b-read" href={post.url} target="_blank" rel="noopener" aria-label={`${t("blog.read")}: ${post.title}`}>
              {t("blog.read")} →
            </a>
          </li>
        ))}
        {loading &&
          [0, 1, 2].map((i) => (
            <li key={i} aria-hidden="true">
              <span className="sk d" />
              <span>
                <span className="sk t" />
                <span className="sk s" />
              </span>
              <span className="sk d" style={{ width: 60 }} />
            </li>
          ))}
        {failed && (
          <li>
            <p className="b-msg">{t("blog.error")}</p>
          </li>
        )}
      </ul>
      {loading && (
        <p className="sr" role="status">
          {t("blog.loading")}
        </p>
      )}
      <div className="blog-foot">
        <p className="blog-note">{t("blog.lead")}</p>
        <a className="btn-line" href={BLOG_URL} target="_blank" rel="noopener">
          {t("blog.more")}
        </a>
      </div>
    </>
  );
}
