"use client";
import { useEffect, useState } from "react";
import SizeGuideModal from "./SizeGuideModal";
import { useCart } from "@/hooks/useCart"; // ✅ Импорт хука
import { useTranslation } from "react-i18next";

interface SizeType {
  id: number;
  size: string;
}

interface AddProps {
  productId: number;
  title: string;
  price: number;
  image: string;
  isLogged?: boolean;
  sizes: SizeType[];
}
 
const Add = ({
  productId,
  title,
  price,
  image,
  isLogged = false,
  sizes,
}: AddProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const { addItem } = useCart(); // ✅

  const handleQuantity = (type: "d" | "i") => {
    if (type === "d" && quantity > 1) setQuantity((prev) => prev - 1);
    if (type === "i") setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = () => {
    if (selectedSize === null) {
      alert("Пожалуйста, выберите размер!");
      return;
    }

    const selectedSizeLabel = sizes.find((s) => s.id === selectedSize)?.size;
    if (!selectedSizeLabel) return;

    addItem({
      product: productId,
      quantity,
      size: selectedSizeLabel,
      product_data: {
        id: productId,
        title,
        price,
        image,
      },
    });

    console.log("▶️ Добавляем:", {
      product: productId,
      quantity,
      size: selectedSizeLabel,
      product_data: {
        id: productId,
        title,
        price,
        image,
      },
    });
    alert("Добавлено в корзину!");
  };

  const { t, i18n } = useTranslation();

  return (
    <div>
      {/* Size выбор */}
      <div className="mt-8 border-b border-solid pb-4">
        <div className="flex justify-between mb-4">
          <span>{t("add_to_cart.size")}</span>
          <div className="relative">
            <button
              className="flex gap-1 text-sm group"
              onClick={() => setIsGuideOpen(true)}
            >
              <svg
                className="icon icon--small icon--type-ruler w-4 group-hover:text-[#7D9395]"
                strokeWidth="1"
                viewBox="0 0 16 16"
              >
                <path
                  fill="currentColor"
                  d="M14.93 4.11L12.1 1.28a1 1 0 00-1.41 0L6.8 5.17.78 11.18a1 1 0 000 1.42l2.82 2.82a1 1 0 001.42 0l9.9-9.9a1 1 0 000-1.4z"
                ></path>
              </svg>
              <span className="text-sm underline text-[#7D9395] hover:text-black">
                {t("add_to_cart.size_guide")}
              </span>
            </button>

            <SizeGuideModal
              isOpen={isGuideOpen}
              onClose={() => setIsGuideOpen(false)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          {sizes.length > 0 ? (
            sizes.map((data) => (
              <div
                key={data.id}
                onClick={() => setSelectedSize(data.id)}
                className={`w-16 h-12 border border-solid rounded-sm text-sm flex items-center justify-center cursor-pointer 
                ${
                  selectedSize === data.id
                    ? "bg-black text-white border-black"
                    : "hover:border-black"
                }`}
              >
                {data.size}
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500">Нет доступных размеров</div>
          )}
        </div>
      </div>

      {/* Количество */}
      <div className="border-b border-solid pb-4 mt-8">
        <span> {t("add_to_cart.quantity")}</span>
        <div className="flex gap-2 mt-4">
          <button
            className="border border-[rgb(214,214,214)] rounded-sm flex justify-center items-center w-12 h-12"
            onClick={() => handleQuantity("d")}
          >
            −
          </button>
          <span className="border border-[rgb(214,214,214)] rounded-sm w-12 h-12 flex items-center justify-center text-[#5c5c5c]">
            {quantity}
          </span>
          <button
            className="border border-[rgb(214,214,214)] rounded-sm flex justify-center items-center w-12 h-12"
            onClick={() => handleQuantity("i")}
          >
            +
          </button>
        </div>

        <div
          onClick={handleAddToCart}
          className="h-12 border border-black flex justify-center items-center rounded-sm mt-10 transition-colors duration-300 hover:bg-black hover:text-white cursor-pointer"
        >
          <button type="button" className="uppercase tracking-[2px]">
            {t("add_to_cart.add_to_cart")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Add;
