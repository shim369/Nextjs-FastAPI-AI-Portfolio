import { Suspense } from "react";
import { getBlogs } from "@/lib/microcms";
import BlogList from "./BlogList";
import Section from "./Section";

/**
 * 記録：TECH BLOG の最新3件。microCMS からサーバー側で取得し（lib/microcms.ts）、ページは ISR で更新する。
 * 取得を待つ間（ISR の再生成やストリーミング中）はスケルトンを出す
 */
export default function Blog() {
  return (
    <Section id="blog">
      <Suspense fallback={<BlogList posts={undefined} />}>
        <LatestPosts />
      </Suspense>
    </Section>
  );
}

async function LatestPosts() {
  const posts = await getBlogs(3);
  return <BlogList posts={posts} />;
}
