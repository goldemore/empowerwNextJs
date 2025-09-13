"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Cart from "./Cart";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "@/store/slices/authSlice";
import { RootState } from "@/store";
import { AuthActions } from "@/auth/utils";
import { useTranslation } from "react-i18next"; // ⬅️ добавили

const NavIcons = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isLogged = useSelector((state: RootState) => state.auth.isLoggedIn);
  const wishlist = useSelector((state: RootState) => state.wishlist.ids);
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation(); // ⬅️ добавили

  const { logout, removeTokens } = AuthActions;

  const handleProfile = () => {
    if (!isLogged) {
      router.push("/login");
    } else {
      setIsOpen((prev) => !prev);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.warn("⚠️ Logout error:", err);
    }
    removeTokens();
    dispatch(setAuth(false));
    setIsOpen(false);
    router.push("/login");
  };

  return (
    <div className="flex gap-5 h-full items-center relative">
      <span
        className="text-[#171717] text-xs cursor-pointer hidden md:flex h-full items-center"
        onClick={handleProfile}
        aria-label={t("account")} // ⬅️ a11y
        title={t("account")}
      >
        {t("account")}
      </span>

      {isLogged && isOpen && (
        <div className="h-26 w-26 bg-orange-50 rounded-sm py-2 px-3 t-0 flex flex-col z-30 justify-center absolute top-16">
          <Link href="/wishlist">
            <span className="cursor-pointer">{t("my_favorite")}</span>
          </Link>
          <Link href="/orders">
            <span className="cursor-pointer">{t("my_orders")}</span>
          </Link>
          <span className="cursor-pointer" onClick={handleLogout}>
            {t("logout")}
          </span>
        </div>
      )}

      <Image
        src="/profile.png"
        alt={t("account")} // ⬅️ локализованный alt
        width={20}
        height={20}
        className="flex md:hidden"
        onClick={handleProfile}
      />

      <Link href="/wishlist" aria-label={t("my_favorite")} title={t("my_favorite")}>
        <div className="relative cursor-pointer">
          <Image src="/love.png" alt={t("my_favorite")} width={20} height={20} className="h-5 w-5" />
          <div className="absolute -top-[10px] -right-[12px] h-5 w-5 bg-black rounded-full text-white text-xs flex items-center justify-center">
            {wishlist.length}
          </div>
        </div>
      </Link>

      <Cart />
    </div>
  );
};

export default NavIcons;
