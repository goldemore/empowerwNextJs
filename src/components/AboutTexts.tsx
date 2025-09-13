"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

export function AboutTeamTitle() {
  const { t } = useTranslation("");
  return <h2 className="text-3xl font-semibold text-center mb-10">{t("aboutPage.team.title")}</h2>;
}

export function ContactUsButton() {
  const { t } = useTranslation();
  return (
    <Link
      href="/contact"
      className="inline-block bg-black text-white py-3 px-6 rounded-xl hover:bg-gray-800 transition"
    >
      {t("aboutPage.cta.contact")}
    </Link>
  );
}

export function AboutFallback() {
  const { t } = useTranslation();
  return (
    <div className="rounded-xl border p-6 text-center">
      <p className="text-lg">{t("aboutPage.error.loadFail")}</p>
      <Link
        href="/"
        className="inline-block mt-4 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition"
      >
        {t("aboutPage.error.backHome")}
      </Link>
    </div>
  );
}
