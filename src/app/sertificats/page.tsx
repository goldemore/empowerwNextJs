// app/sertificats/page.tsx  (или app/certificates/page.tsx — если у тебя так)
import type { Metadata } from "next";
import { cookies } from "next/headers";
import CertificateModal from "@/components/CertificateModal";
import { baseURL } from "@/baseURL";
import { buildSeo, stripHtml } from "@/lib/seoAboutPage";

interface Certificate {
  id: number;
  title: string;
  description: string;
  issue_date: string;
  image: string;
}

async function getCertificates(lang: string): Promise<Certificate[]> {
  try {
    const res = await fetch(`${baseURL}tailor/certificates/${lang}/`, {
      next: { revalidate: 1800 }, // ISR: 30 минут
    });
    if (!res.ok) return [];
    return (await res.json()) as Certificate[];
  } catch {
    return [];
  }
}

// ---- SEO ----
export async function generateMetadata(): Promise<Metadata> {
  const lang = (cookies().get("selectedLanguage")?.value ?? "az") as "az" | "en";
  const list = await getCertificates(lang);

  const fallbackTitle = lang === "en" ? "Certificates — Empower Woman" : "Sertifikatlar — Empower Woman";
  const fallbackDesc =
    lang === "en"
      ? "Explore our official certificates and quality proofs."
      : "Rəsmi sertifikatlarımız və keyfiyyət təsdiqləri ilə tanış olun.";

  const first = list[0];
  const title = first?.title ? `${first.title} — ${fallbackTitle}` : fallbackTitle;
  const description = first?.description ? stripHtml(first.description) : fallbackDesc;

  return buildSeo({
    title,
    description,
    path: "/sertificats",                 // <-- поменяй на "/certificates", если маршрут другой
    image: first?.image || "/og/certificates.png",
    locale: lang === "en" ? "en_US" : "az_AZ"
    // hreflang добавляй только если будут разные URL /az/sertificats и /en/sertificats
  });
}

export default async function SertificatsPage() {
  const lang = (cookies().get("selectedLanguage")?.value ?? "az") as "az" | "en";
  const certificates = await getCertificates(lang);

  return <CertificateModal certificates={certificates} />;
}
