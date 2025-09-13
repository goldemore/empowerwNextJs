"use client";
import Image from "next/image";
import { useState, useMemo } from "react";
import { useWishlist } from "@/hooks/useWishlist";

type ProductImageObj = { id: number; image: string; product: number };
type Props = {
  productImags: ProductImageObj[];
  productID: number;
  title?: string;
};

const BLUR = 
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZWUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIC8+PC9zdmc+";

export default function ProductImages({ productImags, productID, title = "" }: Props) {
  const urls = useMemo(() => (productImags || []).map(i => i.image), [productImags]);
  const [imgID, setImgID] = useState(0);
  const { isInWishlist, toggleWishlist } = useWishlist();

  if (!urls.length) {
    return (
      <div className="w-full h-[300px] bg-gray-200 flex items-center justify-center rounded-md">
        Нет фото
      </div>
    );
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(productID);
  };

  return (
    <>
      {/* DESKTOP */}
      <div className="hidden md:block space-y-4">
        {/* Большое изображение */}
        <div className="relative aspect-[3/4] rounded-md overflow-hidden">
          <Image
            src={urls[imgID]}
            alt={title}
            fill
            className="object-cover"
            priority                      // главная картинка грузится сразу
            loading="eager"
            placeholder="blur"
            blurDataURL={BLUR}
            sizes="(max-width: 1280px) 50vw, 50vw"
          />

          {/* Избранное */}
          <button onClick={handleFavoriteClick} className="absolute top-4 right-4">
            {isInWishlist(productID) ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="black" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/>
              </svg>
            )}
          </button>
        </div>

        {/* Маленькие превью (ленивая загрузка) */}
        <div className="grid grid-cols-2 gap-4">
          {urls.map((u, i) =>
            i === imgID ? null : (
              <button
                key={i}
                type="button"
                onClick={() => setImgID(i)}
                className="relative aspect-[3/4] rounded-md overflow-hidden"
                aria-label={`Фото ${i + 1}`}
              >
                <Image
                  src={u}
                  alt=""
                  fill
                  className="object-cover"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={BLUR}
                  sizes="25vw"
                />
              </button>
            )
          )}
        </div>
      </div>

      {/* MOBILE */}
      <div className="block md:hidden w-full">
        <div className="relative w-full aspect-[3/4] overflow-hidden rounded-md">
          <Image
            src={urls[imgID]}
            alt={title}
            fill
            className="object-cover object-top"
            priority                         // быстрая загрузка первого фото на мобиле
            loading="eager"
            placeholder="blur"
            blurDataURL={BLUR}
            sizes="100vw"
          />

        {/* Избранное */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-4 right-4 z-10 bg-white/80 p-1 rounded-full"
            aria-label="Добавить в избранное"
          >
            {isInWishlist(productID) ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="black" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/>
              </svg>
            )}
          </button>
        </div>

        {/* Превьюхи снизу (ленивая загрузка) */}
        <div className="flex gap-2 mt-2">
          {urls.map((u, i) => (
            <button
              key={i}
              type="button"
              className="w-1/4 relative aspect-[3/4]"
              onClick={() => setImgID(i)}
              aria-label={`Открыть фото ${i + 1}`}
            >
              <Image
                src={u}
                alt=""
                fill
                className={`object-cover border-b-4 ${imgID === i ? "border-[#7D9395]" : "border-transparent"}`}
                loading="lazy"
                placeholder="blur"
                blurDataURL={BLUR}
                sizes="25vw"
              />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
