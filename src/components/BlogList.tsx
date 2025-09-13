// components/BlogList.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;   // ISO
  image: string;
}

export default function BlogList({ posts }: { posts: BlogPost[] }) {
  const { t, i18n } = useTranslation();

  const fmtDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString(i18n.language || "az", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-36 mt-12 mb-24">
      <h1 className="text-4xl font-bold text-center mb-16 text-[#171717]">
        {t("blogs.title")}
      </h1>

      {!posts?.length ? (
        <p className="text-center text-gray-500">{t("blogs.empty")}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {posts.map((post) => (
            <div key={post.slug} className="bg-white rounded-2xl shadow-md overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                width={600}
                height={400}
                className="w-full h-64 object-cover"
              />
              <div className="p-6 space-y-3">
                <p className="text-sm text-gray-500">{fmtDate(post.date)}</p>
                <h2 className="text-2xl font-semibold">{post.title}</h2>
                <p className="text-gray-700">{post.excerpt}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-block mt-3 text-blue-600 hover:underline font-medium"
                >
                  {t("blogs.readMore")}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
