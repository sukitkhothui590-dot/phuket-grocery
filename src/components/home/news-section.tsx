import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { BlogPost } from "@/types";
import { getPlaceholderUrl } from "@/lib/placeholder";

interface NewsSectionProps {
  posts: BlogPost[];
}

export function NewsSection({ posts }: NewsSectionProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">ข่าวสาร & กิจกรรม</h2>
        <Link
          href="/blog"
          className="flex items-center gap-1 text-sm text-primary hover:underline"
        >
          ดูทั้งหมด
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.slice(0, 3).map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`}>
            <Card className="overflow-hidden transition-shadow hover:shadow-md">
              <div className="aspect-video overflow-hidden bg-muted">
                <img
                  src={getPlaceholderUrl(400, 225)}
                  alt={post.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">
                  {new Date(post.publishedAt).toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-foreground">
                  {post.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                  {post.excerpt}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
