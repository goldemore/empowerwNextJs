import type { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import { baseURL } from "@/baseURL";
import SafeHtmlCareers from "@/components/SafeHtmlCareers";
import { buildSeo, stripHtml } from "@/lib/seoAboutPage";
import { CareersHeader, VacancyLabel, CareersEmpty } from "@/components/CareersTexts";

// ---- Types ----
interface Vacancy {
  position: string;
  description: string;       // HTML
  responsibilities: string;  // HTML
  requirements: string;      // HTML
  deadline: string;          // ISO date (YYYY-MM-DD)
  image: string;             // absolute URL
}
interface CareersData {
  vacancies: Vacancy[];
}

// ---- Data loader with ISR ----
async function getCareers(lang: string): Promise<Vacancy[]> {
  try {
    const res = await fetch(`${baseURL}tailor/careers/${lang}/`, {
      next: { revalidate: 1800 }, // 30 мин ISR
    });
    if (!res.ok) return [];
    const data = (await res.json()) as CareersData;
    return Array.isArray(data?.vacancies) ? data.vacancies : [];
  } catch {
    return [];
  }
}

// ---- JSON-LD (JobPosting) ----
function JobPostingJsonLd({ lang, vacancies }: { lang: "az" | "en"; vacancies: Vacancy[] }) {
  if (!vacancies?.length) return null;

  const items = vacancies.map((v) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: v.position,
    description: stripHtml(v.description, 5000),
    validThrough: v.deadline, // ISO date
    hiringOrganization: {
      "@type": "Organization",
      name: "Empower Woman"
    }
    // при желании добавь jobLocation, employmentType и т.д.
  }));

  return (
    <script
      type="application/ld+json"
      // stringify массива JobPosting (можно и один за другим)
      dangerouslySetInnerHTML={{ __html: JSON.stringify(items) }}
    />
  );
}

// ---- SEO ----
export async function generateMetadata(): Promise<Metadata> {
  const lang = (cookies().get("selectedLanguage")?.value ?? "az") as "az" | "en";
  const vacancies = await getCareers(lang);

  // Для description используем локальный intro (ниже — просто фразы на 2 яз.)
  const fallbackDesc =
    lang === "en"
      ? "Explore open roles at Empower Woman. Join a diverse and passionate team building bold fashion."
      : "Empower Woman-da açıq vakansiyalara baxın. Cəsarətli dəbi yaradan müxtəlif və kreativli komandaya qoşulun.";

  // Если есть вакансии — берём первый description как основу
  const firstDesc = vacancies[0]?.description ? stripHtml(vacancies[0].description) : undefined;

  const title = lang === "en" ? "Careers — Empower Woman" : "Karyera — Empower Woman";
  const description = firstDesc || fallbackDesc;

  return buildSeo({
    title,
    description,
    path: "/careers",
    image: "/og/careers.png",          // сделай баннер 1200×630 в /public/og/
    locale: lang === "en" ? "en_US" : "az_AZ"
    // hreflang добавляй только если будут разные URL вида /en/careers и /az/careers
  });
}

// ---- Page (Server Component) ----
export default async function CareersPage() {
  const lang = (cookies().get("selectedLanguage")?.value ?? "az") as "az" | "en";
  const vacancies = await getCareers(lang);

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-36 mt-12 mb-24 text-[#171717]">
      {/* HEADER — локализован через i18n */}
      <CareersHeader />

      {/* VACANCIES */}
      {vacancies.length ? (
        vacancies.map((vacancy, index) => (
          <div
            key={index}
            className="flex flex-col-reverse lg:flex-row items-center gap-12 bg-gray-100 p-8 mb-14 rounded-2xl shadow-md"
          >
            {/* TEXT */}
            <div className="lg:w-1/2 space-y-4">
              <h2 className="text-2xl font-semibold">
                <VacancyLabel k="position" />: {vacancy.position}
              </h2>

              <SafeHtmlCareers html={vacancy.description} />

              <div>
                <h3 className="font-semibold mb-1">
                  <VacancyLabel k="responsibilities" />:
                </h3>
                <SafeHtmlCareers html={vacancy.responsibilities} />
              </div>

              <div>
                <h3 className="font-semibold mb-1">
                  <VacancyLabel k="requirements" />:
                </h3>
                <SafeHtmlCareers html={vacancy.requirements} />
              </div>

              <div className="pt-2 text-gray-800">
                📬 <strong><VacancyLabel k="applyPrefix" /></strong>{" "}
                <VacancyLabel k="applyAction" />{" "}
                <br />
                <a href="mailto:careers@empowerwoman.com" className="text-blue-700 underline">
                  careers@empowerwoman.com
                </a>
              </div>

              <p className="text-sm text-gray-600 pt-2">
                🗓 <strong><VacancyLabel k="deadline" />:</strong> {vacancy.deadline}
              </p>
            </div>

            {/* IMAGE */}
            <div className="lg:w-1/2">
              <Image
                src={vacancy.image}
                alt={vacancy.position}
                width={600}
                height={400}
                className="rounded-xl object-cover w-full h-auto shadow"
              />
            </div>
          </div>
        ))
      ) : (
        <CareersEmpty />
      )}

      {/* JSON-LD для вакансий */}
      <JobPostingJsonLd lang={lang} vacancies={vacancies} />
    </div>
  );
}
