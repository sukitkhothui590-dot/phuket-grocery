import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/api/content";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "ไม่พบบทความ" };

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
      >
        <ArrowLeft className="size-4" />
        กลับไปหน้าบทความ
      </Link>

      {/* Blog Hero — แนะนำขนาด 1200x400 (3:1) */}
      <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-xl bg-gray-100">
        <img
          src={post.coverImage}
          alt={post.title}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="mt-8">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          {post.title}
        </h1>
        <div className="mt-3 flex items-center gap-3 text-sm text-gray-500">
          <span>{post.author}</span>
          <span aria-hidden="true">&middot;</span>
          <time>
            {new Date(post.publishedAt).toLocaleDateString("th-TH", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
      </div>

      <div className="mt-8 leading-relaxed text-gray-700 whitespace-pre-line">
        {post.content}
      </div>

      <div className="mt-12 border-t border-gray-200 pt-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="size-4" />
          ดูบทความทั้งหมด
        </Link>
      </div>
    </article>
  );
}
