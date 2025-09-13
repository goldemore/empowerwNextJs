"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAuth } from "@/store/slices/authSlice";
import { setWishlist } from "@/store/slices/wishlistSlice";
import { AuthActions } from "./utils";
import axiosAuth from "./axiosAuth";
import { baseURL } from "@/baseURL";
import { useTranslation } from "react-i18next";

const AuthInitializer = () => {
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const lang = i18n.language;

  useEffect(() => {
    const init = async () => {
      const token = AuthActions.getToken();

      // 🔹 Если токена нет → гость
      if (!token) {
        dispatch(setAuth(false));
        const local = JSON.parse(localStorage.getItem("wishlist") || "[]");
        dispatch(setWishlist(local));
        return;
      }

      try {
        // 🔹 Обновляем токен
        const res = await AuthActions.handleJWTRefresh();
        const access = res.data.access;
        AuthActions.storeToken(access);
        dispatch(setAuth(true));

        // 🔹 Загружаем wishlist для авторизованного
        const wishlistRes = await axiosAuth.get(
          `${baseURL}tailor/wishlist-products/${lang}/`,
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        );
        const ids = wishlistRes.data.map((item: any) => item.id);
        dispatch(setWishlist(ids));
      } catch (err) {
        // ❌ refresh не удался → fallback на guest
        dispatch(setAuth(false));
        const local = JSON.parse(localStorage.getItem("wishlist") || "[]");
        dispatch(setWishlist(local));
      }
    };

    init();
  }, [dispatch, lang]);

  return null;
};

export default AuthInitializer;
