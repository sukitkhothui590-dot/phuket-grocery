import type { Metadata } from "next";
import Link from "next/link";
import { getBlogPosts } from "@/lib/api/content";

export const metadata: Metadata = {
  title: "บทความ",
  description: "บทความ ข่าวสาร และเคล็ดลับจากภูเก็ต โกรเซอรี่",
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-center text-3xl font-bold text-gray-900 sm:text-4xl">
        บทความ & ข่าวสาร
      </h1>
      <p className="mt-2 text-center text-gray-500">
        อัปเดตข่าวสาร โปรโมชั่น และเคล็ดลับดีๆ
      </p>

      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:shadow-lg"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
              <img
                src={post.coverImage}
                alt={post.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <time className="text-xs text-gray-400">
                {new Date(post.publishedAt).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <h2 className="mt-1.5 text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </h2>
              <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                {post.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {posts.length === 0 && (
        <p className="mt-16 text-center text-gray-400">
          ยังไม่มีบทความในขณะนี้
        </p>
      )}
    </div>
  );
}
