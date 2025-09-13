"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

const LANG_KEY = "selectedLanguage";
const base = (v: string) => v.split("-")[0];

export default function LangSwitch() {
  const { i18n } = useTranslation();
  const [selected, setSelected] = useState(
    base(Cookies.get(LANG_KEY) || localStorage.getItem(LANG_KEY) || "az")
  );

  useEffect(() => {
    const handler = (lng: string) => setSelected(base(lng));
    i18n.on("languageChanged", handler);
    return () => i18n.off("languageChanged", handler);
  }, [i18n]);

  const changeLang = (lng: string) => {
    const norm = base(lng);

    // Сохраняем выбранный язык
    Cookies.set(LANG_KEY, norm, { path: "/", expires: 365 });
    localStorage.setItem(LANG_KEY, norm);

    // ✅ Перезагрузка страницы БЕЗ локального переключения
    window.location.href = "/";
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => changeLang("az")}
        className={`text-white text-xs ${selected === "az" ? "font-bold underline" : ""}`}
      >
        AZ
      </button>
      <button
        onClick={() => changeLang("en")}
        className={`text-white text-xs ${selected === "en" ? "font-bold underline" : ""}`}
      >
        EN
      </button>
    </div>
  );
}


// Код без обновы 
// 'use client';
// import { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
// import Cookies from "js-cookie";
// import { useRouter } from "next/navigation";
// import { getI18n } from "@/lib/i18n";

// const LANG_KEY = "selectedLanguage";
// const base = (v: string) => v.split("-")[0];

// export default function LangSwitch() {
//   const { i18n } = useTranslation();
//   const router = useRouter();

//   const raw = Cookies.get(LANG_KEY) || localStorage.getItem(LANG_KEY) || "az";
//   const [selected, setSelected] = useState(base(raw));

//   useEffect(() => {
//     const handler = (lng: string) => setSelected(base(lng));
//     i18n.on("languageChanged", handler);
//     return () => {
//       i18n.off("languageChanged", handler);
//     };
//   }, [i18n]);

//   const changeLang = async (lng: string) => {
//     const norm = base(lng);

//     Cookies.set(LANG_KEY, norm, { path: "/", expires: 365 /*, secure: true */ });
//     localStorage.setItem(LANG_KEY, norm);
//     setSelected(norm);

//     await (i18n?.changeLanguage ?? getI18n().changeLanguage)(norm);
//     router.refresh();
//   };

//   return (
//     <div className="flex gap-2">
//       <button
//         onClick={() => changeLang("az")}
//         className={`text-white text-xs ${selected === "az" ? "font-bold underline" : ""}`}
//       >
//         AZ
//       </button>
//       <button
//         onClick={() => changeLang("en")}
//         className={`text-white text-xs ${selected === "en" ? "font-bold underline" : ""}`}
//       >
//         EN
//       </button>
//     </div>
//   );
// }
