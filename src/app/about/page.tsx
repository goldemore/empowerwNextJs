// app/about/page.tsx
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { baseURL } from "@/baseURL";
import Image from "next/image";
import Link from "next/link";
import SafeHtmlAboutUs from "@/components/SafeHtmlAboutUs";
import JoinUsBlock from "@/components/JoinUsBlock";
import AboutValues from "@/components/AboutValues";
import { AboutTeamTitle, ContactUsButton, AboutFallback } from "@/components/AboutTexts";
import { buildSeo, stripHtml } from "@/lib/seoAboutPage";

interface TeamMember { name: string; role: string; image: string; }
interface AboutData { title: string; description: string; team: TeamMember[]; }

async function getAboutInfo(lang: string): Promise<AboutData | null> {
  try {
    const res = await fetch(`${baseURL}tailor/about/${lang}/`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = (await res.json()) as AboutData; 
    if (!data?.title || !data?.description || !Array.isArray(data.team)) return null;
    return data;
  } catch {
    return null;
  }
}

// ✅ всего ~10 строк, но по правилам App Router
export async function generateMetadata(): Promise<Metadata> {
  const lang = (cookies().get("selectedLanguage")?.value ?? "az") as "az" | "en";
  const data = await getAboutInfo(lang);

  const title = data?.title
    ? (lang === "en" ? `About — ${data.title}` : `Haqqımızda — ${data.title}`)
    : (lang === "en" ? "About Us — Empower Woman" : "Haqqımızda — Empower Woman");

  const description = data?.description
    ? stripHtml(data.description)
    : (lang === "en"
        ? "Learn about Empower Woman: a modern women’s clothing brand focused on quality, comfort and style."
        : "Empower Woman haqqında: keyfiyyət, rahatlıq və üsluba fokuslanan müasir qadın geyim brendi.");

  return buildSeo({
    title,
    description,
    path: "/about",
    image: "/logo-emp.png",
    locale: lang === "en" ? "en_US" : "az_AZ",
    siteName: "Empower Woman",
  });
}

export default async function AboutUs() {
  const lang = (cookies().get("selectedLanguage")?.value ?? "az") as "az" | "en";
  const aboutInfo = await getAboutInfo(lang);

  if (!aboutInfo) {
    return (
      <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-36 mt-12 mb-24">
        <AboutFallback />
      </div>
    );
  }

  const { title, description, team } = aboutInfo;

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-36 mt-12 mb-24 text-[#171717]">
      {/* HERO */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-10 mb-20">
        <div className="lg:w-1/2 space-y-6">
          <h1 className="text-4xl font-bold">{title}</h1>
          <SafeHtmlAboutUs html={description} className="text-lg text-gray-700" />
          <ContactUsButton />
        </div>
        <div className="lg:w-1/2">
          <Image
            src="/logo-emp.png"
            alt="About Us"
            width={600}
            height={400}
            className="rounded-2xl shadow-lg w-full h-auto object-cover p-4"
            priority
          />
        </div>
      </div>

      <AboutValues />

      <div className="mb-20">
        <AboutTeamTitle />
        <div className="flex flex-wrap justify-center gap-8">
          {team.map(({ name, role, image }, i) => (
            <div key={i} className="w-60 text-center">
              <Image
                src={image}
                alt={name}
                width={240}
                height={240}
                className="rounded-full object-cover mx-auto mb-4"
              />
              <h3 className="font-semibold">{name}</h3>
              <p className="text-sm text-gray-600">{role}</p>
            </div>
          ))}
        </div>
      </div>

      <JoinUsBlock />
    </div>
  );
}
