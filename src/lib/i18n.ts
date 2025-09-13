// src/lib/i18n.ts
"use client";

import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import Cookies from "js-cookie";

const LANG_KEY = "selectedLanguage";
let initialized = false;
const SUPPORTED = ["az", "en"];

function normalizeLng(v?: string | null) {
  const base = (v || "").split("-")[0];
  return SUPPORTED.includes(base) ? base : "az";
}

export function getI18n() {
  if (typeof window === "undefined") {
    // ❗ Никогда не инициализируем i18next на сервере!
    return null;
  }

  if (!initialized) {
    const saved =
      Cookies.get(LANG_KEY) || localStorage.getItem(LANG_KEY) || "az";

    i18next
      .use(HttpBackend)
      .use(initReactI18next)
      .init({
        lng: normalizeLng(saved),
        fallbackLng: "az",
        supportedLngs: ["az", "en"],
        debug: false,
        initImmediate: false,
        interpolation: { escapeValue: false },
        backend: { loadPath: "/locales/{{lng}}/translation.json" },
      });

    i18next.on("languageChanged", (lng) => {
      try {
        localStorage.setItem(LANG_KEY, lng);
        Cookies.set(LANG_KEY, lng, {
          path: "/",
          expires: 365,
          sameSite: "lax",
        });
      } catch {}
    });

    initialized = true;
  }

  return i18next;
}
