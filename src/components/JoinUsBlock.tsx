"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useTranslation } from "react-i18next";

const JoinUsBlock = () => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const { t } = useTranslation("joinUs");

  return (
    <div className="bg-zinc-900 text-white py-12 px-6 rounded-2xl text-center">
      {isLoggedIn ? (
        <>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            {t("loggedIn.title")}
          </h2>
          <p className="text-gray-300">{t("loggedIn.text")}</p>
        </>
      ) : (
        <>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            {t("guest.title")}
          </h2>
          <p className="mb-6 text-gray-300">{t("guest.text")}</p>
          <Link
            href="/register"
            className="bg-white text-black px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition"
          >
            {t("guest.cta")}
          </Link>
        </>
      )}
    </div>
  );
};

export default JoinUsBlock;
