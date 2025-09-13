"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { useTranslation } from "react-i18next";

const CartPage = () => {
  const { t, i18n } = useTranslation();
  const { cartItems, changeQuantity, removeItem } = useCart();

  const subtotal = (cartItems || []).reduce((acc, item) => {
    const product = item.product_data;
    if (!product) return acc; // если product нет — пропускаем
    const price = product.sale_price ?? product.price;
    return acc + price * item.quantity;
  }, 0);

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-36">
      <div className="flex flex-col gap-4">
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500">{t("cart.empty")}</p>
        ) : (
          <p className="text-center text-gray-500">{t("cart.title")}</p>
        )}

        <div>
          <div className="text-[#5c5c5c] flex justify-between items-center border-b border-gray-200 h-12">
            <span className="w-3/5">{t("cart.headers.product")}</span>
            <div className="flex gap-4">
              <span>{t("cart.headers.price")}</span>
              <span>{t("cart.headers.quantity")}</span>
            </div>
            <span>{t("cart.headers.subtotal")}</span>
          </div>

          {cartItems.map((item) => {
            const product = item.product_data;
            if (!product) return null;

            // язык: только 'az' или 'en'
            const lang: "az" | "en" = i18n.language?.startsWith("en")
              ? "en"
              : "az";

            // безопасный доступ к переводам
            const tt = (product.title_translations ?? {}) as Partial<
              Record<"az" | "en", string>
            >;

            const title = tt[lang] ?? tt.az ?? t("cart.no_title");
            const image = product.image ?? "/placeholder.png";
            const price = product.sale_price ?? product.price;

            return (
              <div
                key={`${item.product}-${item.size}`}
                className="flex justify-between py-9 border-b border-gray-200"
              >
                <div className="flex w-3/5 gap-6">
                  <div className="w-[100px] h-[133px] relative">
                    <Image
                      src={image || "/placeholder.png"}
                      alt={title}
                      fill
                      className="cursor-pointer object-cover"
                      sizes="100%"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-sm text-[#5c5c5c] font-semibold">
                      {title}
                    </h3>
                    <p className="text-xs text-[#5c5c5c] font-normal mt-2">
                      {t("cart.product_size")} {item.size}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-sm text-[#5c5c5c] font-semibold">
                    {(price * item.quantity).toFixed(2)}₼
                  </div>
                  <div className="flex">
                    <div className="border border-[rgb(214, 214, 214)] rounded-sm flex gap-2 justify-between px-4 items-center w-20 h-9">
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
                  </div>
                </div>

                <div>{(price * item.quantity).toFixed(2)}₼</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200 flex flex-col uppercase items-end">
        <div className="flex mb-4">
          <span className="text-sm text-gray-700 font-medium">
            {t("cart.summary.subtotal")}{" "}
          </span>
          <span className="text-sm text-gray-900 font-bold">
            {" "}
            ₼ {subtotal.toFixed(2)}
          </span>
        </div>
        <button className="bg-black text-white py-3 rounded-md text-sm font-semibold w-28 uppercase">
          <Link href="/checkoutpage">{t("cart.go_to_pay")}</Link>
        </button>
      </div>
    </div>
  );
};

export default CartPage;
