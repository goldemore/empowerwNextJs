"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/hooks/useWishlist";

interface Product {
  id: number;
  title: string;
  slug: string;
  product_images: string[];
  price: number;
  sizes: { id: number; size: string }[];
}

const ProductCard = ({ product }: { product: Product }) => {
  const [currentHoverIndex, setCurrentHoverIndex] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  const images = product.product_images;
  const mainImage = images[0];
  const hoverImage = images[currentHoverIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentHoverIndex((prev) => (prev <= 1 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentHoverIndex((prev) => (prev >= images.length - 1 ? 1 : prev + 1));
  };
  // флаг для грузим картинку только при первом наведении
  const [hoverLoaded, setHoverLoaded] = useState(false);
  const handleMouseEnter = () => {
    setIsHovered(true);
    setHoverLoaded(true); // грузим картинку только при первом наведении
  };
  const handleMouseLeave = () => setIsHovered(false);

  // // state and function for add and remove favorite
  // const [isFavorite, setIsFavorite] = useState(false);
  // const toggleFavorite = (e: React.MouseEvent) => {
  //   e.preventDefault(); // ⛔️ отменяет переход по ссылке
  //   e.stopPropagation(); // ⛔️ отменяет всплытие
  //   setIsFavorite((prev) => !prev);
  //   alert(isFavorite ? "Удалено из избранного" : "Добавлено в избранное");
  //   // Здесь в будущем можно будет отправить запрос на backend
  // };

  const { isInWishlist, toggleWishlist } = useWishlist();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const content = (
    <>
      <div
        className="relative w-full aspect-[3/4] rounded-md overflow-hidden group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Главное изображение */}
        {mainImage && (
          <Image
            src={mainImage}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className={`object-cover transition-opacity duration-300 rounded-md ${
              isHovered ? "opacity-0" : "opacity-100"
            }`}
          />
        )}

        {/* Hover-изображение */}
        {isHovered && hoverImage && hoverLoaded && (
          <Image
            key={hoverImage}
            src={hoverImage}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="absolute top-0 left-0 object-cover rounded-md z-20"
          />
        )}

        {/* Кнопка избранного */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-4 right-4 z-30"
        >
          {isInWishlist(product.id) ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="black"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 
                2 12.28 2 8.5 2 5.42 4.42 3 7.5 3 
                c1.74 0 3.41 0.81 4.5 2.09 
                C13.09 3.81 14.76 3 16.5 3 
                C19.58 3 22 5.42 22 8.5 
                c0 3.78-3.4 6.86-8.55 11.54 
                L12 21.35z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-heart"
            >
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12    5.6l-1-1a5.5 5.5 0 0 0-7.8    7.8l1 1L12 21l7.8-7.8 1-1a5.5    5.5 0 0 0 0-7.8z"></path>
            </svg>
          )}
        </button>

        {/* Стрелки */}
        {isHovered && images.length > 2 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-white/90 text-black rounded-full px-2 py-1"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 18L9 12L15 6"
                  stroke="#000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-white/90 text-black rounded-full px-2 py-1"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 6L15 12L9 18"
                  stroke="#000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Название и цена */}
      <h3 className="mt-4 text-[#5c5c5c] text-sm font-normal tracking-wide">
        {product.title}
      </h3>
      <p className="mt-1 text-[#5c5c5c] text-sm font-normal tracking-wide">
        {product.price} AZN
      </p>
      <div className="mt-3 text-[#5c5c5c] text-xs flex gap-3">
        {product.sizes.map((s) => (
          <span key={s.id}>{s.size}</span>
        ))}
      </div>
    </>
  );

  return product.slug ? (
    <Link href={`/${product.slug}`} className="w-full">
      {content}
    </Link>
  ) : (
    <div className="w-full">{content}</div>
  );
};

export default ProductCard;
