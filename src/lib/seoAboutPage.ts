// lib/seo.ts
import type { Metadata } from "next";
import { headers } from "next/headers";

export function originFromHeaders() {
  const h = headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  return `${proto}://${host}`;
}

export function stripHtml(s = "", max = 160) {
  const text = s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > max ? text.slice(0, max - 1) + "…" : text;
}

type SeoInput = {
  title: string;
  description: string;
  path: string;                  // например: "/about"
  image?: string;                // "/og/about.png" ИЛИ абсолютный URL из API
  locale?: "az_AZ" | "en_US";
  siteName?: string;
};

export function buildSeo({
  title,
  description,
  path,
  image = "/logo-emp.png",
  locale = "az_AZ",
  siteName = "Empower Woman",
}: SeoInput): Metadata {
  const origin = originFromHeaders();

  // Канонический URL
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${origin}${normalizedPath}`;

  // ✅ Картинка: поддерживаем и относительные пути (/og/...), и абсолютные URL из API
  const img = (image || "").trim();
  const isAbsolute = /^https?:\/\//i.test(img) || img.startsWith("//");
  const normalizedImgPath = img.startsWith("/") ? img : `/${img}`;
  const imageUrl = isAbsolute ? img : `${origin}${normalizedImgPath}`;

  return {
    title,
    description,
    metadataBase: new URL(origin),
    alternates: {
      canonical: url,
      // пока один и тот же URL для языков
      languages: { "az-AZ": normalizedPath, "en-US": normalizedPath, "x-default": normalizedPath },
    },
    openGraph: {
      type: "website",
      url,
      siteName,
      title,
      description,
      locale,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: siteName }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    robots: { index: true, follow: true },
  };
}
