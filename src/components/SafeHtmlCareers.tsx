// components/SafeHtml.tsx
"use client";
import DOMPurify from "dompurify";

export default function SafeHtmlCareers({ html, className }: { html: string; className?: string }) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />;
}
