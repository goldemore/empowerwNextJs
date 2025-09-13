"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useTranslation } from "react-i18next";

const Cart = () => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const { cartItems, changeQuantity, removeItem } = useCart();

  const subtotal = (cartItems || []).reduce((acc, item) => {
    const product = item.product_data;
    if (!product) return acc; // если product нет — пропускаем
    const price = product.sale_price ?? product.price;
    return acc + price * item.quantity;
  }, 0);

  return (
    <div className="flex gap-1">
      <span className="text-[#171717] text-xs cursor-pointer hidden md:flex">
        {t("cart1")}
      </span>

      <div className="relative cursor-pointer">
        <Image
          src="/cart.png"
          alt=""
          width={20}
          height={20}
          className="h-5 w-5"
          onClick={() => setOpen((prev) => !prev)}
        />
        <div className="absolute -top-[10px] -right-[10px] w-5 h-5 bg-black rounded-full text-white text-xs flex items-center justify-center">
          {cartItems.length}
        </div>
      </div>

      <div
        className={`w-4/5 md:w-3/5 lg:w-2/5 p-8 fixed top-0 right-0 bg-white transition-transform z-40 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center">
          <h3 className="uppercase text-sm text-[#171717] font-normal">
            {t("cart.title")} ({(cartItems || []).length})
          </h3>
          <Image
            src="/cross.png"
            alt=""
            width={20}
            height={20}
            onClick={() => setOpen(false)}
            className="cursor-pointer"
          />
        </div>

        <div className="my-4 text-sm text-[#5c5c5c]">
          {/* <p>Your order is eligible for free shipping!</p> */}
        </div>

        <div
          className="flex flex-col gap-4 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 300px)" }}
        >
          {(cartItems || []).length === 0 && (
            <p className="text-center text-gray-500">{t("cart.empty")}</p>
          )}
          {(cartItems || []).map((item) => {
            const product = item.product_data;
            if (!product) return null; // если product отсутствует — пропускаем элемент

            // язык: только 'az' или 'en'
            const lang: "az" | "en" = i18n.language?.startsWith("en")
              ? "en"
              : "az";

            // безопасный доступ к переводам
            const tt = (product.title_translations ?? {}) as Partial<
              Record<"az" | "en", string>
            >;

            const title = tt[lang] ?? tt.az ?? t("cart.no_title");
            const hasDiscount = !!product.sale_price;
            const price =
              (hasDiscount ? product.sale_price : product.price) ?? 0;
            const originalPrice = product.price;

            return (
              <div key={`${item.product}-${item.size}`} className="flex gap-5">
                <div className="w-[100px] h-[133px] relative">
                  <Image
                    src={product?.image || "/placeholder.png"}
                    alt={product?.title || "Product"}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-col w-full">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-sm text-[#5c5c5c] font-semibold">
                        {title}
                      </h3>
                      <p className="text-xs text-[#5c5c5c] font-normal mt-2">
                        {t("filters.size")}: {item.size}
                      </p>
                    </div>
                    <div className="text-sm font-semibold text-right">
                      {hasDiscount ? (
                        <>
                          <p className="line-through text-xs text-gray-400">
                            {(originalPrice * item.quantity).toFixed(2)} ₼
                          </p>
                          <p className="text-red-600 font-bold">
                            {(price * item.quantity).toFixed(2)} ₼
                          </p>
                        </>
                      ) : (
                        <p>{(price * item.quantity).toFixed(2)} ₼</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-2">
                    <div className="border rounded-sm flex justify-between px-3 gap-2 items-center w-20 h-9">
                      <button
                        onClick={() =>
                          changeQuantity(item.product, item.size, "d")
                        }
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          changeQuantity(item.product, item.size, "i")
                        }
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.product, item.size)}
                      className="text-red-600 text-xs hover:underline"
                    >
                      {t("cart.remove")}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-8 border-t border-gray-200 sticky bottom-0 w-full bg-white">
          <div className="flex justify-between mb-4">
            <span className="text-sm font-medium">{t("cart.summary.subtotal")}</span>
            <span className="text-sm font-bold">{subtotal.toFixed(2)} ₼</span>
          </div>
          <button
            className="w-full bg-black text-white py-3 rounded-md text-sm font-semibold"
            onClick={() => setOpen(false)}
          >
            <Link href="/checkoutpage">{t("cart.checkout")}</Link>
          </button>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
};

export default Cart;
