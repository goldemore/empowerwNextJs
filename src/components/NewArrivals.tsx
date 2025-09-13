"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import ProductCard from "./ProductCard";
import { baseURL } from "@/baseURL";

type Product = {
  id: number;
  title: string;
  slug: string;
  product_images: string[];
  price: number;
  sizes: { id: number; size: string }[];
};

type Props = {
  initial: { results: Product[]; count: number };
  lang: string;     // пришёл с SSR из cookie
  perPage: number;  // 8
};

export default function NewArrivalsClient({ initial, lang, perPage }: Props) {
  const [products, setProducts] = useState<Product[]>(initial.results);
  const [count, setCount] = useState<number>(initial.count);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const totalPages = Math.ceil((count ?? 0) / perPage);

  // ❶ Когда меняется lang или initial (после refresh SSR) — сбрасываемся на 1-ю страницу и подставляем initial
  useEffect(() => {
    setPage(1);
    setProducts(initial.results);
    setCount(initial.count);
    setLoading(false);
  }, [lang, initial.results, initial.count]);

  // ❷ Подгружаем страницы > 1; для 1-й страницы — возвращаем initial
  useEffect(() => {
    if (page === 1) {
      // явный возврат к initial при клике на «1»
      setProducts(initial.results);
      setCount(initial.count);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    axios
      .get(`${baseURL}tailor/home-product-list/${lang}/`, {
        params: { page },
        signal: controller.signal as any,
      })
      .then((res) => {
        setProducts(res.data.results);
        setCount(res.data.count);
      })
      .catch((err) => {
        if (!axios.isCancel(err)) console.warn("Failed to fetch new arrivals:", err);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [page, lang, initial.results, initial.count]);

  return (
    <div>
      <AnimatePresence mode="wait"> 
        <motion.div
          key={`${lang}-${page}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {loading
            ? Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="bg-gray-200 w-full h-[537.6px] animate-pulse rounded-md" />
              ))
            : products.map((product) => <ProductCard key={product.id} product={product} />)}
        </motion.div>
      </AnimatePresence>

      {/* Pagination */}
      <div className="flex justify-center mt-8 gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`px-3 py-1 border rounded ${
              p === page ? "bg-black text-white" : "bg-white text-black"
            } transition-all duration-300`}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}


// Проверить после увеличения количество товаров при пагинации 
// "use client";

// import { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import axios from "axios";
// import ProductCard from "./ProductCard";
// import { baseURL } from "@/baseURL";

// type Product = {
//   id: number;
//   title: string;
//   slug: string;
//   product_images: string[];
//   price: number;
//   sizes: { id: number; size: string }[];
// };

// type Props = {
//   initial: { results: Product[]; count: number };
//   lang: string;     // пришёл с SSR
//   perPage: number;  // напр. 8
// };

// export default function NewArrivalsClient({ initial, lang, perPage }: Props) {
//   const [page, setPage] = useState<number>(1);
//   const [count, setCount] = useState<number>(initial.count);
//   const [cache, setCache] = useState<Record<number, Product[]>>({
//     1: initial.results, // сразу кладём первую страницу в кэш
//   });
//   const [loading, setLoading] = useState(false);

//   const totalPages = Math.ceil((count ?? 0) / perPage);
//   const products = cache[page] ?? [];

//   // ❶ Сброс при смене языка (новый initial)
//   useEffect(() => {
//     setPage(1);
//     setCount(initial.count);
//     setCache({ 1: initial.results });
//     setLoading(false);
//   }, [lang, initial]);

//   // ❷ Загрузка страниц, которых ещё нет в кэше
//   useEffect(() => {
//     if (cache[page]) return; // уже есть — ничего не делаем

//     const controller = new AbortController();
//     setLoading(true);

//     axios
//       .get(`${baseURL}tailor/home-product-list/${lang}/`, {
//         params: { page },
//         signal: controller.signal as any,
//       })
//       .then((res) => {
//         setCache((prev) => ({ ...prev, [page]: res.data.results }));
//         setCount(res.data.count);
//       })
//       .catch((err) => {
//         if (!axios.isCancel(err)) console.warn("Failed to fetch:", err);
//       })
//       .finally(() => setLoading(false));

//     return () => controller.abort();
//   }, [page, lang, cache]);

//   return (
//     <div>
//       <AnimatePresence mode="wait">
//         <motion.div
//           key={`${lang}-${page}`}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -20 }}
//           transition={{ duration: 0.4 }}
//           className="grid grid-cols-2 md:grid-cols-4 gap-4"
//         >
//           {loading && !cache[page]
//             ? Array.from({ length: perPage }).map((_, idx) => (
//                 <div
//                   key={idx}
//                   className="bg-gray-200 w-full h-[537.6px] animate-pulse rounded-md"
//                 />
//               ))
//             : products.map((product) => (
//                 <ProductCard key={product.id} product={product} />
//               ))}
//         </motion.div>
//       </AnimatePresence>

//       {/* Pagination */}
//       <div className="flex justify-center mt-8 gap-2">
//         {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
//           <button
//             key={p}
//             onClick={() => setPage(p)}
//             className={`px-3 py-1 border rounded ${
//               p === page ? "bg-black text-white" : "bg-white text-black"
//             } transition-all duration-300`}
//           >
//             {p}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }
