// app/blog/page.tsx
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { baseURL } from "@/baseURL";
import BlogList from "@/components/BlogList";
import { buildSeo } from "@/lib/seoAboutPage";

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;     // ISO
  image: string;    // absolute URL
}

// ISR-загрузчик (без влияния на SEO)
async function getPosts(lang: "az" | "en"): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${baseURL}tailor/blogs/${lang}/`, {
      next: { revalidate: 600 }, // 10 мин
    });
    if (!res.ok) return [];
    return (await res.json()) as BlogPost[];
  } catch {
    return [];
  }
}

// ✅ статическое SEO (не тянем посты в метаданных)
export async function generateMetadata(): Promise<Metadata> {
  const lang = (cookies().get("selectedLanguage")?.value ?? "az") as "az" | "en";

  const title  = lang === "en" ? "Blog — Empower Woman" : "Bloq — Empower Woman";
  const desc   = lang === "en"
    ? "Company news, updates and stories from Empower Woman."
    : "Empower Woman-dan xəbər və hekayələr.";
  return buildSeo({
    title,
    description: desc,
    path: "/blog",
    image: "/og/blog.png",             // сделай баннер 1200×630
    locale: lang === "en" ? "en_US" : "az_AZ"
    // hreflang НЕ добавляем, пока один и тот же URL для обоих языков
  });
}

export default async function BlogsPage() {
  const lang = (cookies().get("selectedLanguage")?.value ?? "az") as "az" | "en";
  const posts = await getPosts(lang);

  return <BlogList posts={posts} />;
}
