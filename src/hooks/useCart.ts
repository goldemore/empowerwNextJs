"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  addToCart,
  removeFromCart, 
  updateQuantity,
  setCart,
} from "@/store/slices/cartSlice";
import { useEffect } from "react";
import { baseURL } from "@/baseURL";
import axiosAuth from "@/auth/axiosAuth";
import { AuthActions } from "@/auth/utils";

export const useCart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const isAuth = useSelector((state: RootState) => state.auth.isLoggedIn);

  useEffect(() => {
    const loadCart = async () => {
      const localCart = JSON.parse(localStorage.getItem("cart") || "[]");

      if (isAuth && AuthActions.getToken()) {
        if (localCart.length > 0) {
          for (const item of localCart) {
            const payload = {
              product: item.product || item.id,
              quantity: item.quantity,
              size: item.size,
              color: item.color || "",
            };
            try {
              await axiosAuth.post(`${baseURL}tailor/cart/add/`, payload, {
                headers: {
                  Authorization: `Bearer ${AuthActions.getToken()}`,
                },
              });
            } catch (err) {
              console.error("❌ Ошибка при добавлении:", err);
            }
          }
          localStorage.removeItem("cart");
        }

        try {
          const res = await axiosAuth.get(`${baseURL}tailor/cart/`, {
            headers: {
              Authorization: `Bearer ${AuthActions.getToken()}`,
            },
          });
          const transformed = res.data.items.map((item:any) => ({
            product: item.product.id,
            size: item.size,
            quantity: item.quantity,
            color: item.color,
            product_data: item.product,
          }));

          dispatch(setCart(transformed));
          // console.log("📦 С сервера:", transformed);
        } catch (err) {
          console.error("❌ Ошибка получения корзины:", err);
        }
      } else {
        // Гостевой режим
        if (localCart.length > 0) {
          const ids = Array.from(
            new Set(localCart.map((item:any) => item.product))
          );

          try {
            const res = await fetch(
              `${baseURL}tailor/wishlist-products/az/?ids=${ids.join(",")}`
            );
            const productList = await res.json();

            const mergedCart = localCart.map((item:any) => {
              const product = productList.find((p:any) => p.id === item.product);
              return {
                ...item,
                product_data: product, // ✅ сохраняем как product_data
              };
            });

            dispatch(setCart(mergedCart));
            console.log("🛒 Гостевая корзина:", mergedCart);
          } catch (err) {
            console.error("❌ Ошибка получения товаров по ID:", err);
            dispatch(setCart(localCart));
          }
        }
      }
    };

    loadCart();
  }, [isAuth, dispatch]);

  useEffect(() => {
  if (!isAuth && cartItems.length > 0) {
    const minimalCart = cartItems.map((item) => ({
      product: item.product,
      size: item.size,
      quantity: item.quantity,
      color: item.color,
    }));

    localStorage.setItem("cart", JSON.stringify(minimalCart)); // ✅ сохраняем только нужное
  }
}, [cartItems, isAuth]);


  const addItem = (item: any) => {
  dispatch(addToCart(item));

  if (isAuth && AuthActions.getToken()) {
    axiosAuth.post(`${baseURL}tailor/cart/add/`, {
      product: item.product,
      size: item.size,
      quantity: item.quantity,
      color: "",
    }, {
      headers: {
        Authorization: `Bearer ${AuthActions.getToken()}`,
      },
    })
    .then(() => {
      console.log("✅ Добавлено на сервер");
    })
    .catch((err) => {
      console.error("❌ Ошибка при добавлении:", err);
    });
  }
};


  const removeItem = async (id: number, size: string) => {
    dispatch(removeFromCart({ id, size }));
     if (!isAuth) {
    const updated = cartItems.filter(
      (item) => !(item.product === id && item.size === size)
    );
    localStorage.setItem("cart", JSON.stringify(updated));
  }


    if (isAuth && AuthActions.getToken()) {
      try {
        await axiosAuth.request({
          method: "delete",
          url: `${baseURL}tailor/cart/remove/`,
          headers: {
            Authorization: `Bearer ${AuthActions.getToken()}`,
          },
          data: {
            product: id,
            size,
            color: "",
          },
        });
        console.log("✅ Успешное удаление с сервера");
      } catch (err) {
        console.error("❌ Ошибка при удалении с сервера:", err);
      }
    }
  };

  const changeQuantity = (id: number, size: string, type: "i" | "d") => {
  const item = cartItems.find((i) => i.product === id && i.size === size);
  if (!item) return;

  const newQuantity = type === "i" ? item.quantity + 1 : item.quantity - 1;

  if (newQuantity <= 0) {
    removeItem(id, size); // 💥 Удаляем полностью
    return;
  }

  dispatch(updateQuantity({ id, size, type }));

  if (isAuth && AuthActions.getToken()) {
    axiosAuth
      .post(`${baseURL}tailor/cart/add/`, {
        product: id,
        size,
        color: "",
        quantity: newQuantity,
      }, {
        headers: {
          Authorization: `Bearer ${AuthActions.getToken()}`,
        },
      })
      .then(() => {
        console.log("✅ Количество обновлено на сервере");
      })
      .catch((err) => {
        console.error("❌ Ошибка обновления:", err);
      });
  }
};


  const isInCart = (id: number, size: string) => {
    return cartItems.some(
    (item) => item.product === id && item.size === size
  );
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const product = item.product_data;
    if (!product) return acc;
    const price = product.sale_price ?? product.price;
    return acc + (price ?? 0) * item.quantity;
  }, 0);

  return {
    cartItems,
    subtotal,
    addItem,
    removeItem,
    changeQuantity,
    isInCart,
  };
};
