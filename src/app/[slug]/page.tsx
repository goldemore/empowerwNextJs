import { baseURL } from "@/baseURL";
import Accordion from "@/components/Accordion";
import Add from "@/components/Add";
import ProductImages from "@/components/ProductImages";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

// next: { revalidate: 3600 }
// Это ISR (Incremental Static Regeneration).
// Next.js кеширует страницу на 3600 секунд (1 час).
// Если на сервере данные изменились, фронт покажет старые данные до следующей генерации
// (через 1 час или при первом запросе после этого времени).

//  { cache: "no-store" }
// Полностью отключает кеш.
// Всегда делает новый запрос к серверу.

async function getSingleProduct(slug: string, languageCode: string) {
  const res = await fetch(`${baseURL}tailor/product-retrieve/${slug}/${languageCode}/`, {
    next: { revalidate: 60 },
  });

  console.log(`${baseURL}tailor/product-retrieve/${slug}/${languageCode}/`);
  

  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

const SinglePage = async ({ params }: { params: { slug: string } }) => {
  const cookieStore = cookies();
  const lang = cookieStore.get("selectedLanguage")?.value || "az";

  const product = await getSingleProduct(params.slug, lang);


  const breadcrumbs = ["Home", product?.main_collection?.name, product?.title];

  return (
    <div className="text-sm">
      {/* breadcrumbs */}

      <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-36 mt-2">
        <nav className="flex text-xs text-[#5c5c5c] items-center">
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="flex items-center">
              <span
                className={
                  index === breadcrumbs.length - 1 ? "font-semibold" : ""
                }
              >
                {crumb}
              </span>
              {index !== breadcrumbs.length - 1 && (
                <svg
                  className="w-3 h-3 mx-1 text-[#5c5c5c]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              )}
            </span>
          ))}
        </nav>
      </div>

      {/* Product  */}
      <div className="flex flex-col md:flex-row px-4 md:px-16 lg:px-20 xl:px-32 2xl:px-36 py-4 ">
        {/* IMG */}
        <div className="md:w-1/2 w-full top-20 h-max">
          <ProductImages productImags = {product.product_images} productID={product.id}/>
        </div>

        {/* TEXT */}
        <div className="md:w-1/2 w-full p-0 md:pl-11 mt-2 md:mt-0">
          {/* title and price */}
          <div className="border-b border-solid pb-4">
            <h1 className="font-didot uppercase text-[#171717] text-sm tracking-normal mb-2 ">
              {product.title}
            </h1>
            {/* Price and sale_price */}
            {product.sale_price ? (
              <div className="flex items-center gap-2">
                <span className="text-[#a0a0a0] text-sm line-through">
                  {product.price} AZN
                </span>
                <span className="text-red-600 text-base font-semibold">
                  {product.sale_price} AZN
                </span>
              </div>
            ) : (
              <span className="text-sm text-[#5c5c5c]">
                {product.price} AZN
              </span>
            )}
          </div>

          {/* size an add to cart btn */}
          <Add
            productId={product.id}
            title={product.title}
            price={product.price}
            image={product?.product_images[0].image } // или путь к изображению
            isLogged={false}
            sizes = {product.sizes}
           
          />

          {/* shipping information */}
          <div
            className="bg-[#7D9395] flex py-4 px-3 rounded-sm gap-3 text-[#F4F4F4]
          "
          >
            <svg
              className="icon icon--small icon--type-truck w-5"
              strokeWidth="1"
              aria-hidden="true"
              focusable="false"
              role="presentation"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
            >
              <path
                fill="currentColor"
                d="M15.64 6.92L9.5 5.12V4a.5.5 0 00-.5-.5H1a.5.5 0 00-.5.5v8.5c0 .28.22.5.5.5h1.27a2.1 2.1 0 004.06 0h3.94a2.1 2.1 0 004.06 0h1.17a.5.5 0 00.5-.5V7.4a.5.5 0 00-.36-.48zM4.3 13.6a1.1 1.1 0 110-2.2 1.1 1.1 0 010 2.2zM6.33 12a2.1 2.1 0 00-4.06 0H1.5V4.5h7V12H6.33zm5.97 1.6a1.1 1.1 0 110-2.2 1.1 1.1 0 010 2.2zM15 12h-.67a2.1 2.1 0 00-4.06 0H9.5V6.17l5.5 1.6V12z"
              ></path>
            </svg>
            <p className="tracking-wide">
              Same Day Shipping! Order Before 12pm AEST for Same Day Dispatch.
            </p>
          </div>

          {/* accordion */}

          <Accordion
            characteristics={product.characteristics}
            characteristics2={product.characteristics2}
            note={product.note}
          />
        </div>
      </div>

      {/* Also random arr of products  */}
      <div className="px-4 md:px-8 lg:px-16 xl:px-30 2xl:px-36 mt-16">
        <h3 className="uppercase text-center mb-6 tracking-widest">
          Handpicked for you
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* <Link
            href={"/" + "amayla-knit-blush"}
            className="flex-shrink-0 w-full"
          >
            <div className="relative bg-slate-100 w-full aspect-[3/4]">
              <Image
                src="/4.webp"
                alt=""
                fill
                sizes="20vw"
                className="absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity easy duration-500"
              />

              <Image
                src="/product.png"
                alt=""
                fill
                sizes="25vw"
                className="absolute object-cover rounded-md"
              />
             
              <button
               
                className="absolute top-4 right-4 z-30"
              >
                {isFavorite ? (
                  
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="black"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
              2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 
              2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 
              22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 
              11.54L12 21.35z"
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
                    <path
                      d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 
              5.6l-1-1a5.5 5.5 0 0 0-7.8 
              7.8l1 1L12 21l7.8-7.8 1-1a5.5 
              5.5 0 0 0 0-7.8z"
                    />
                  </svg>
                )}
              </button>
            </div>
            <h3 className="mt-4 text-[#5c5c5c] text-sm font-normal tracking-wide">
              Amayla Knit - Blush
            </h3>

            <p className="mt-1 text-[#5c5c5c] text-sm font-normal tracking-wide">
              300 AZN
            </p>
            <div className="mt-3 text-[#5c5c5c] text-xs flex gap-3">
              <span>S</span>
              <span>M</span>
              <span>L</span>
              <span>XL</span>
            </div>
          </Link> */}
        </div>
      </div>
    </div>
  );
};

export default SinglePage;
