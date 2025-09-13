"use client";

import { useTranslation } from "react-i18next";

export function CareersHeader() {
  const { t } = useTranslation("careers");
  return (
    <div className="text-center mb-16">
      <h1 className="text-4xl font-bold mb-4">{t("header.title")}</h1>
      <p className="text-lg text-gray-700">{t("header.intro")}</p>
    </div>
  );
}

export function VacancyLabel({ k }: { k:
  "position" | "responsibilities" | "requirements" | "applyPrefix" | "applyAction" | "deadline"
}) {
  const { t } = useTranslation("careers");
  return <>{t(`vacancy.${k}`)}</>;
}

export function CareersEmpty() {
  const { t } = useTranslation("careers");
  return <p className="text-center text-gray-500">{t("empty")}</p>;
}
