"use client";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import type { Collection } from "@/app/layout";
import SubscribeBox from "./SubscribeBox";
type Props = {
  collections: Collection[];
};

const Footer = ({ collections }: Props) => {
  // #171717
  const { t } = useTranslation();
  return (
    <footer>
      <div className="py-14 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-36 bg-zinc-900 text-sm mt-24 text-white">
        {/* TOP */}
        <div className="flex flex-col md:flex-row justify-between gap-16 md:gap-24 border-b-2 border-white pb-14">
          {/* LEFT */}

          {/* CENTER */}
          <div className="flex flex-wrap w-full lg:flex justify-between md:w-1/2">
            <div className="flex flex-col gap-10">
              <h1 className="font-medium text-lg">{t("company")}</h1>
              <div className="flex flex-col gap-3">
                <Link href="/about">{t("about")}</Link>
                <Link href="/careers">{t("careers")}</Link>
                <Link href="/sertificats">{t("certificates")}</Link>
                <Link href="/blog">{t("blog")}</Link>
                <Link href="/contact">{t("contact")}</Link>
              </div>
            </div>

            <div className="flex flex-col gap-10">
              <h1 className="font-medium text-lg">SHOP</h1>
              <div className="flex flex-col gap-3">
                {collections.map((c) => (
                  <Link key={c.id} href={`/collections/${c.slug}`}>
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-10">
              <h1 className="font-medium text-lg">{t("help")}</h1>
              <div className="flex flex-col gap-3">
                <Link href="/helpcenter">{t("helpCentre")}</Link>
                <Link href="/shipping">{t("shipping")}</Link>
              </div>
              {/* <Link href="">My Account</Link>
                <Link href="">Find a Store</Link>
                <Link href="">Legal & Privacy</Link>
                <Link href="">Shipping</Link> */}
            </div>
          </div>

          {/* RIGHT */}
          <SubscribeBox/>
          {/* <div className="w-full md:w-1/2 lg:w-1/4 flex flex-col gap-8">
            <h1 className="font-medium text-lg">{t("subscribe")}</h1>
            <p>{t("subscribeText")}</p>
            <div className="flex">
              <input
                type="text"
                placeholder={t("emailPlaceholder")}
                className="p-4 w-3/4"
              />
              <button className="w-1/4 bg-slate-400 text-white">
                {t("join")}
              </button>
            </div>
            <span className="font-semibold">{t("followUs")}</span>
            <div className="flex gap-6">
              <Link
                href="https://www.facebook.com/afag.rzayeva"
                target="_blank"
              >
                <svg
                  aria-hidden="true"
                  className="icon icon-facebook w-4 h-4 text-white"
                  viewBox="2 2 16 16"
                  focusable="false"
                  role="presentation"
                >
                  <path
                    fill="currentColor"
                    d="M18 10.049C18 5.603 14.419 2 10 2c-4.419 0-8 3.603-8 8.049C2 14.067 4.925 17.396 8.75 18v-5.624H6.719v-2.328h2.03V8.275c0-2.017 1.195-3.132 3.023-3.132.874 0 1.79.158 1.79.158v1.98h-1.009c-.994 0-1.303.621-1.303 1.258v1.51h2.219l-.355 2.326H11.25V18c3.825-.604 6.75-3.933 6.75-7.951Z"
                  ></path>
                </svg>
              </Link>

              <Link
                href="https://www.instagram.com/empowerwoman.az/"
                target="_blank"
              >
                <svg
                  className="icon w-4 h-4 text-white"
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                  focusable="false"
                  role="presentation"
                >
                  <path
                    d="M24 0c-6.518 0-7.335.028-9.895.144-2.555.117-4.3.523-5.826 1.116-1.578.613-2.917 1.434-4.25 2.768C2.693 5.362 1.872 6.701 1.26 8.28.667 9.806.26 11.55.144 14.105.028 16.665 0 17.482 0 24s.028 7.335.144 9.895c.117 2.555.523 4.3 1.116 5.826.613 1.578 1.434 2.917 2.768 4.25 1.334 1.335 2.673 2.156 4.251 2.77 1.527.592 3.271.998 5.826 1.115 2.56.116 3.377.144 9.895.144s7.335-.028 9.895-.144c2.555-.117 4.3-.523 5.826-1.116 1.578-.613 2.917-1.434 4.25-2.768 1.335-1.334 2.156-2.673 2.77-4.251.592-1.527.998-3.271 1.115-5.826.116-2.56.144-3.377.144-9.895s-.028-7.335-.144-9.895c-.117-2.555-.523-4.3-1.116-5.826-.613-1.578-1.434-2.917-2.768-4.25-1.334-1.335-2.673-2.156-4.251-2.769-1.527-.593-3.271-1-5.826-1.116C31.335.028 30.518 0 24 0Zm0 4.324c6.408 0 7.167.025 9.698.14 2.34.107 3.61.498 4.457.827 1.12.435 1.92.955 2.759 1.795.84.84 1.36 1.64 1.795 2.76.33.845.72 2.116.827 4.456.115 2.53.14 3.29.14 9.698s-.025 7.167-.14 9.698c-.107 2.34-.498 3.61-.827 4.457-.435 1.12-.955 1.92-1.795 2.759-.84.84-1.64 1.36-2.76 1.795-.845.33-2.116.72-4.456.827-2.53.115-3.29.14-9.698.14-6.409 0-7.168-.025-9.698-.14-2.34-.107-3.61-.498-4.457-.827-1.12-.435-1.92-.955-2.759-1.795-.84-.84-1.36-1.64-1.795-2.76-.33-.845-.72-2.116-.827-4.456-.115-2.53-.14-3.29-.14-9.698s.025-7.167.14-9.698c.107-2.34.498-3.61.827-4.457.435-1.12.955-1.92 1.795-2.759.84-.84 1.64-1.36 2.76-1.795.845-.33 2.116-.72 4.456-.827 2.53-.115 3.29-.14 9.698-.14Zm0 7.352c-6.807 0-12.324 5.517-12.324 12.324 0 6.807 5.517 12.324 12.324 12.324 6.807 0 12.324-5.517 12.324-12.324 0-6.807-5.517-12.324-12.324-12.324ZM24 32a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm15.691-20.811a2.88 2.88 0 1 1-5.76 0 2.88 2.88 0 0 1 5.76 0Z"
                    fill="currentColor"
                    fillRule="evenodd"
                  ></path>
                </svg>
              </Link>
              <svg
                className="icon text-white w-4 h-4"
                width="48"
                height="48"
                viewBox="0 0 48 48"
                aria-hidden="true"
                focusable="false"
                role="presentation"
              >
                <path
                  d="M24.001 0C10.748 0 0 10.745 0 24.001c0 9.825 5.91 18.27 14.369 21.981-.068-1.674-.012-3.689.415-5.512.462-1.948 3.087-13.076 3.087-13.076s-.765-1.533-.765-3.799c0-3.556 2.064-6.212 4.629-6.212 2.182 0 3.237 1.64 3.237 3.604 0 2.193-1.4 5.476-2.12 8.515-.6 2.549 1.276 4.623 3.788 4.623 4.547 0 7.61-5.84 7.61-12.76 0-5.258-3.543-9.195-9.986-9.195-7.279 0-11.815 5.427-11.815 11.49 0 2.094.616 3.567 1.581 4.708.446.527.505.736.344 1.34-.113.438-.378 1.505-.488 1.925-.16.607-.652.827-1.2.601-3.355-1.369-4.916-5.04-4.916-9.17 0-6.816 5.75-14.995 17.152-14.995 9.164 0 15.195 6.636 15.195 13.75 0 9.416-5.233 16.45-12.952 16.45-2.588 0-5.026-1.4-5.862-2.99 0 0-1.394 5.53-1.688 6.596-.508 1.85-1.504 3.7-2.415 5.14 2.159.638 4.44.985 6.801.985C37.255 48 48 37.255 48 24.001 48 10.745 37.255 0 24.001 0"
                  fill="currentColor"
                  fillRule="evenodd"
                ></path>
              </svg>
            </div>
          </div> */}

          {/* BOTTOM */}
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mt-12">
          <div className="">© 2024 Copyright</div>
          <div className="flex gap-6">
            <Image src="/visa.png" alt="" width={40} height={20} />
            <Image src="/mastercard.png" alt="" width={40} height={20} />
            <Image src="/paypal.png" alt="" width={40} height={20} />
          </div>
        </div>
      <div className="mt-6 text-center text-sm text-gray-400 border-t border-gray-700 pt-4">
        ----- Site build by{" "}
        <span className="text-gray-200 font-semibold tracking-wide">
          Adacta
        </span>
      </div>
      </div>

    </footer>
  );
};

export default Footer;
