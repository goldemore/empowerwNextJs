// // app/blog/[slug]/page.tsx
// import type { Metadata } from "next";
// import { cookies } from "next/headers";
// import Image from "next/image";
// import { notFound } from "next/navigation";
// import { baseURL } from "@/baseURL";
// import { buildSeo, stripHtml } from "@/lib/seoAboutPage";

// type Lang = "az" | "en";

// interface BlogPostDTO {
//   title: string;
//   author: string;      // может прийти как "By Emily Carter"
//   date: string;        // YYYY-MM-DD
//   image: string;       // абсолютный URL с бэка
//   content: string;     // HTML из редактора
//   tags: string[];
// }

// async function getPost(slug: string, lang: Lang): Promise<BlogPostDTO | null> {
//   try {
//     const res = await fetch(`${baseURL}tailor/blog/${slug}/${lang}/`, {
//       next: { revalidate: 900 }, // ISR: 15 минут
//     });
//     if (!res.ok) return null;
//     const data = (await res.json()) as BlogPostDTO;

//     // лёгкая очистка
//     data.tags = (data.tags || []).map(t => t.trim()).filter(Boolean);
//     if (data.author?.toLowerCase().startsWith("by ")) {
//       data.author = data.author.slice(3).trim();
//     }
//     return data;
//   } catch {
//     return null;
//   }
// }

// // SEO из API (просто используем текущий buildSeo без «article»-типов)
// export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
//   const lang = (cookies().get("selectedLanguage")?.value ?? "az") as Lang;
//   const post = await getPost(params.slug, lang);

//   // фолбэк, если пост не найден
//   if (!post) {
//     const title = lang === "en" ? "Post not found — Empower Woman" : "Yazı tapılmadı — Empower Woman";
//     const description = lang === "en"
//       ? "The requested blog post could not be found."
//       : "Axtardığınız bloq yazısı tapılmadı.";
//     return buildSeo({
//       title,
//       description,
//       path: `/blog/${params.slug}`,
//       image: "/og/blog.png",
//       locale: lang === "en" ? "en_US" : "az_AZ",
//     });
//   }

//   return buildSeo({
//     title: post.title,
//     description: stripHtml(post.content),     // описание из контента
//     path: `/blog/${params.slug}`,
//     image: post.image || "/og/blog.png",      // картинка из API (работает после 1-строчного патча)
//     locale: lang === "en" ? "en_US" : "az_AZ",
//   });
// }

// function BlogJsonLd({ slug, post }: { slug: string; post: BlogPostDTO }) {
//   const json = {
//     "@context": "https://schema.org",
//     "@type": "BlogPosting",
//     headline: post.title,
//     image: post.image,
//     author: post.author ? { "@type": "Person", name: post.author } : undefined,
//     datePublished: post.date,
//     articleSection: post.tags?.join(", "),
//     mainEntityOfPage: { "@type": "WebPage", "@id": `/blog/${slug}` },
//     articleBody: stripHtml(post.content, 5000),
//   };
//   return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
// }

// export default async function BlogPage({ params }: { params: { slug: string } }) {
//   const lang = (cookies().get("selectedLanguage")?.value ?? "az") as Lang;
//   const post = await getPost(params.slug, lang);
//   if (!post) return notFound();

//   return (
//     <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-36 mt-12 mb-24 text-[#171717]">
//       <Image
//         src={post.image}
//         alt={post.title}
//         width={800}
//         height={400}
//         className="rounded-xl mb-6 w-full object-cover shadow"
//         priority
//       />

//       <h1 className="text-4xl font-bold mb-2">{post.title}</h1>

//       <div className="text-sm text-gray-500 mb-4">
//         <span>
//           {post.author ? `By ${post.author}` : ""}
//           {post.author ? " · " : ""}
//           {post.date}
//         </span>
//       </div>

//       <div className="flex flex-wrap gap-2 mb-8">
//         {post.tags.map((tag) => (
//           <span key={tag} className="bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full">#{tag}</span>
//         ))}
//       </div>

//       <article className="prose prose-lg max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: post.content }} />

//       <BlogJsonLd slug={params.slug} post={post} />
//     </div>
//   );
// }
