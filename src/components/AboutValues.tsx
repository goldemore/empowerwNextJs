"use client";

import { useTranslation } from "react-i18next";

export default function AboutValues() {
  const { t } = useTranslation();

  const items = [
    {
      icon: "💡",
      title: t("aboutPage.values.items.individuality.title"),
      desc: t("aboutPage.values.items.individuality.desc"),
    },
    {
      icon: "🌿",
      title: t("aboutPage.values.items.sustainability.title"),
      desc: t("aboutPage.values.items.sustainability.desc"),
    },
    {
      icon: "🤝",
      title: t("aboutPage.values.items.support.title"),
      desc: t("aboutPage.values.items.support.desc"),
    },
  ];

  return (
    <div className="text-center mb-20">
      <h2 className="text-3xl font-semibold mb-10">
        {t("aboutPage.values.title")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {items.map(({ icon, title, desc }, i) => (
          <div key={i} className="bg-gray-100 p-6 rounded-xl shadow hover:shadow-md transition">
            <div className="text-4xl mb-4">{icon}</div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-700">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
