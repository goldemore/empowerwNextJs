import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  setWishlist,
  addToWishlist as add,
  removeFromWishlist as remove,
} from "@/store/slices/wishlistSlice";
import axios from "axios";
import { baseURL } from "@/baseURL";
import { AuthActions } from "@/auth/utils";
import axiosAuth from "@/auth/axiosAuth";

export const useWishlist = () => {
  const isAuth = useSelector((state: RootState) => state.auth.isLoggedIn);
  const wishlist = useSelector((state: RootState) => state.wishlist.ids);
  const dispatch = useDispatch();

  // 🧠 Функция синхронизации избранного после логина
  const syncWishlist = async () => {
    const local = JSON.parse(localStorage.getItem("wishlist") || "[]");

    try {
      const res = await axiosAuth.get(
        `${baseURL}tailor/wishlist-products/en/`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${AuthActions.getToken()}`,
          },
        }
      );

      console.log("📡 Запрос избранного");

      const serverIds = res.data.map((item: any) => item.id);

      // 🔁 Добавим на сервер только те товары, которых там нет
      const toCreate = local.filter((id: number) => !serverIds.includes(id));
      for (const id of toCreate) {
        await axiosAuth.post(
          `${baseURL}tailor/favourite-create/`,
          { product: id },
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${AuthActions.getToken()}`,
            },
          }
        );
      }

      // ✅ Получим финальный список и сохраним в redux (с удалением дубликатов)
      const updatedRes = await axiosAuth.get(
        `${baseURL}tailor/wishlist-products/en/`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${AuthActions.getToken()}`,
          },
        }
      );
      const uniqueProductsMap = new Map<number, any>();
      updatedRes.data.forEach((item: any) => {
        if (!uniqueProductsMap.has(item.id)) {
          uniqueProductsMap.set(item.id, item);
        }
      });
      const uniqueProducts = Array.from(uniqueProductsMap.values());

      dispatch(setWishlist(uniqueProducts.map((item) => item.id)));

      // ❌ Удалим локальное избранное
      localStorage.removeItem("wishlist");
    } catch (e) {
      console.error("Ошибка при синхронизации избранного", e);
    }
  };

  // 🔄 useEffect для первоначальной загрузки
  // useEffect(() => {
  //   const fetchWishlist = async () => {
  //     console.log("🧪 Access Token:", AuthActions.getToken());
  //     if (isAuth && AuthActions.getToken()) {
  //       await syncWishlist();
  //     } else {
  //       const local = JSON.parse(localStorage.getItem("wishlist") || "[]");
  //       dispatch(setWishlist(local));
  //     }
  //   };

  //   fetchWishlist();
  // }, [isAuth, dispatch]);

  useEffect(() => {
    if (!isAuth) {
      const stored = JSON.parse(localStorage.getItem("wishlist") || "[]");

      // ⚡️ Если Redux пустой, а в localStorage уже есть товары → не перезаписываем
      if (wishlist.length === 0 && stored.length > 0) {
        return;
      }

      // ✅ В остальных случаях обновляем localStorage из Redux
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, isAuth]);

  // ✅ Добавление/удаление товара
  const toggleWishlist = async (productId: number) => {
    const inList = wishlist.includes(productId);

    if (isAuth) {
      try {
        // 🧠 Получаем текущие избранные
        const res = await axiosAuth.get(
          `${baseURL}tailor/wishlist-products/en/`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${AuthActions.getToken()}`,
            },
          }
        );

        console.log("📡 Запрос избранного");

        // 🔎 Находим объект по productId
        const item = res.data.find((item: any) => item.id === productId);

        if (inList) {
          if (!item || !item.favourite_id) {
            console.warn("❗ favourite_id не найден для удаления");
            return;
          }

          // ✅ Удаляем по favourite_id
          await axiosAuth.delete(
            `${baseURL}tailor/favourite-retrieve-update-delete/${item.favourite_id}/`,
            {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${AuthActions.getToken()}`,
              },
            }
          );
          dispatch(remove(productId));
        } else {
          // ✅ Добавляем
          await axiosAuth.post(
            `${baseURL}tailor/favourite-create/`,
            { product: productId },
            {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${AuthActions.getToken()}`,
              },
            }
          );
          dispatch(add(productId));
        }
      } catch (e) {
        console.error("Ошибка при toggleWishlist", e);
      }
    } else {
      // Гость — localStorage
      const local = JSON.parse(localStorage.getItem("wishlist") || "[]");
      const updated = inList
        ? local.filter((id: number) => id !== productId)
        : [...local, productId];
      localStorage.setItem("wishlist", JSON.stringify(updated));
      dispatch(setWishlist(updated));
    }
  };

  // 🧹 Удаление одного товара
  // 🧹 Удаление одного товара
  const removeFromWishlist = async (
    favouriteId: number | undefined,
    productId: number
  ) => {
    console.log("🧪 Access Token:", AuthActions.getToken());
    const inList = wishlist.includes(productId);
    if (!inList) return;

    if (isAuth) {
      if (!favouriteId) {
        console.warn("❗ Нет favourite_id для удаления.");
        return;
      }

      try {
        await axiosAuth.delete(
          `${baseURL}tailor/favourite-retrieve-update-delete/${favouriteId}/`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${AuthActions.getToken()}`,
            },
          }
        );

        dispatch(remove(productId));
      } catch (e) {
        console.error("Ошибка при удалении из избранного", e);
      }
    } else {
      // Гость — удаляем из localStorage
      const local = JSON.parse(localStorage.getItem("wishlist") || "[]");
      const updated = local.filter((id: number) => id !== productId);
      localStorage.setItem("wishlist", JSON.stringify(updated));
      dispatch(setWishlist(updated));
    }
  };

  return {
    wishlist,
    toggleWishlist,
    removeFromWishlist,
    isInWishlist: (id: number) => wishlist.includes(id),
  };
};
