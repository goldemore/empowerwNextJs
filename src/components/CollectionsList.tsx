"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import AccordionFilter from "@/components/AccordionFilter";
import ProductCard from "@/components/ProductCard";
import { baseURL } from "@/baseURL";

type ProductForCard = {
  id: number;
  title: string;
  slug: string;
  price: number;
  sizes: { id: number; size: string }[];
  product_images: string[]; // у бэка массив строк
};

type FilterItem = {
  key: string;
  title: string;
  type: "range" | "color" | "checkbox" | "buttons";
  min?: number;
  max?: number;
  values?: { label: string; value: string | number }[];
};

export default function CollectionsClient({ slug }: { slug: string }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.split("-")[0];

  const [active, setActive] = useState(false);
  const [activeSort, setActiveSort] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});
  const [products, setProducts] = useState<ProductForCard[]>([]);
  const [collectionName, setCollectionName] = useState("");
  const [filters, setFilters] = useState<FilterItem[] | null>(null);
  const [fallbackTried, setFallbackTried] = useState(false);
  const [loading, setLoading] = useState(true);

  const sortOptions = useMemo(
    () => ({
      sort_default: t("sort_by_price"),
      price_asc: t("low_to_high"),
      price_desc: t("high_to_low"),
    }),
    [t, i18n.language]
  );
  type SortKey = keyof typeof sortOptions;
  const [sortKey, setSortKey] = useState<SortKey>("sort_default");

  // ===== Загрузка товаров =====
  const fetchProducts = useCallback(async () => {
    if (!slug) return;
    const controller = new AbortController();
    setLoading(true);

    try {
      // базовый url
      let url = `${baseURL}tailor/collections/${slug}/${lang}/`;

      // применяем фильтры
      const qp = new URLSearchParams();
      if (appliedFilters.price) {
        qp.append("filter.v.price.gte", String(appliedFilters.price[0]));
        qp.append("filter.v.price.lte", String(appliedFilters.price[1]));
      }
      (["color", "size", "category"] as const).forEach((key) => {
        const list = appliedFilters[key] as string[] | undefined;
        if (Array.isArray(list)) {
          list.forEach((val) =>
            qp.append(
              key === "size"
                ? "filter.v.option.size"
                : key === "category"
                ? "filter.v.category"
                : "filter.v.color",
              val
            )
          );
        }
      });
      if (qp.toString()) {
        url = `${baseURL}tailor/collections/${slug}/${lang}/filtered/?${qp.toString()}`;
      }

      const res = await axios.get(url, { signal: controller.signal as any });
      let data: ProductForCard[] = res.data?.products ?? [];

      if (sortKey === "price_asc")
        data = [...data].sort((a, b) => a.price - b.price);
      if (sortKey === "price_desc")
        data = [...data].sort((a, b) => b.price - a.price);

      setProducts(data);
      setCollectionName(res.data?.collection_name || "");
    } catch (err: any) {
      if (!axios.isCancel(err)) {
        console.error("Ошибка загрузки товаров:", err);
        setProducts([]);
      }
    } finally {
      setLoading(false);
    }

    return () => controller.abort();
  }, [slug, lang, appliedFilters, sortKey, fallbackTried, i18n]);

  // ===== Загрузка фильтров =====
  const fetchFilters = useCallback(async () => {
    if (!slug) return;
    try {
      const url = `${baseURL}tailor/collections-others/${slug}/${lang}/`;
      const res = await axios.get(url);

      const rawFilters: FilterItem[] =
        (res.data?.filters as FilterItem[]) ?? [];

      // фильтруем: оставляем только валидные range (min < max)
      const safeFilters = rawFilters.filter((f) => {
        if (f.type !== "range") return true;
        const min = Number(f.min) || 0;
        const max = Number(f.max) || 0;
        return max > min; // range показываем только если max > min
      });

      setFilters(safeFilters);
    } catch (err) {
      console.error("Ошибка загрузки фильтров:", err);
      setFilters([]);
    }
  }, [slug, lang]);

  useEffect(() => {
    fetchProducts();
    fetchFilters();
  }, [fetchProducts, fetchFilters]);

  return (
    <div>
      {/* Баннер (статичный) */}
      <div>
        <Image
          src="/collections_banner.webp"
          alt="Banner"
          width={1600}
          height={400}
          className="w-full h-auto max-h-[305px] object-cover"
          priority
          sizes="100vw"
        />
      </div>
      {/* Название коллекции */}
      <div className="p-4 text-center">
        <h1 className="font-didot uppercase text-[#171717] text-sm tracking-normal mb-2">
          {collectionName}
        </h1>
      </div>
      {/* Верхняя панель: кнопка фильтра / счётчик / сортировка */}

      {!loading && products.length > 0 && filters && filters.length > 0 && (
        <div className="flex justify-between px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-36">
          {/* Кнопка Filter с анимацией */}
          {/* Кнопка Filter с анимацией */}
          <button
            type="button"
            onClick={() => setActive((v) => !v)}
            className="flex gap-2 items-center cursor-pointer select-none text-[#5c5c5c]"
          >
            <svg
              width="23"
              height="19"
              viewBox="0 0 20 20"
              strokeWidth="1.25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-current"
            >
              <line
                x1={active ? "19" : "1"}
                y1="6"
                x2={active ? "1" : "19"}
                y2="6"
                stroke="currentColor"
                className="transition-all duration-300"
              />
              <line
                x1={active ? "19" : "1"}
                y1="14"
                x2={active ? "1" : "19"}
                y2="14"
                stroke="currentColor"
                className="transition-all duration-300"
              />
              <circle
                cx={active ? "13" : "7"}
                cy="6"
                r="3"
                stroke="currentColor"
                className="transition-all duration-300"
              />
              <circle
                cx={active ? "7" : "13"}
                cy="14"
                r="3"
                stroke="currentColor"
                className="transition-all duration-300"
              />
            </svg>
            <span className="text-sm">Filter</span>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-current transition-transform duration-300"
              style={{ transform: active ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </button>

          {/* Счётчик */}
          <span className="text-sm text-[#5c5c5c]">
            {products.length} {t("col_pro_for_count")}
          </span>

          {/* Сортировка */}
          <div className="relative text-sm text-[#5c5c5c]">
            <button
              type="button"
              className="cursor-pointer select-none"
              onClick={() => setActiveSort((v) => !v)}
            >
              {sortOptions[sortKey]}
            </button>
            {activeSort && (
              <ul className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-md z-50">
                {(Object.keys(sortOptions) as SortKey[]).map((key) => (
                  <li
                    key={key}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSortKey(key);
                      setActiveSort(false);
                    }}
                  >
                    {sortOptions[key]}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
      {/* Контент: сайдбар + сетка */}
      <div className="flex gap-4 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-36 mt-4">
        {/* DESKTOP sidebar */}
        <div
          className={`hidden md:block transition-all duration-300 ${
            active ? "w-64" : "w-0"
          }`}
        >
          {active &&
            (Array.isArray(filters) && filters.length > 0 ? (
              <AccordionFilter
                filters={(filters ?? []).filter(
                  (f) => f.type !== "range" || (f.max ?? 0) > (f.min ?? 0)
                )}
                appliedFilters={appliedFilters}
                setAppliedFilters={setAppliedFilters}
              />
            ) : (
              <div className="p-4 text-sm text-gray-500">
                Нет доступных фильтров
              </div>
            ))}
        </div>

        {/* MOBILE drawer */}
        <div
          className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
            active ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setActive(false)}
          />
          <div
            className={`absolute left-0 top-0 h-full w-3/4 max-w-[320px] bg-white p-4 shadow transition-transform duration-300 ${
              active ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {Array.isArray(filters) && filters.length > 0 ? (
              <AccordionFilter
                filters={filters}
                appliedFilters={appliedFilters}
                setAppliedFilters={setAppliedFilters}
              />
            ) : (
              <div className="p-4 text-sm text-gray-500">
                Нет доступных фильтров
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <button
                className="flex-1 border px-3 py-2 text-sm"
                onClick={() => setActive(false)}
              >
                Apply
              </button>
              <button
                className="px-3 py-2 text-sm"
                onClick={() => setAppliedFilters({})}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* GRID */}
        <div className="flex-1 grid gap-4 grid-cols-2 md:grid-cols-4 transition-all duration-300">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 w-full h-[540px] animate-pulse rounded-md"
              />
            ))
          ) : products.length > 0 ? (
            products.map((p) => <ProductCard key={p.id} product={p} />)
          ) : (
            <div className="col-span-full text-center text-[#5c5c5c] text-sm mt-6">
              Bu kolleksiya hələ məhsul ilə doldurulmayıb.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
