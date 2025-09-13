"use client";

import { useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";
import { useTranslation } from "react-i18next";

type AccordionGroupProps = {
  characteristics: string;
  characteristics2: string;
  note: string;
};

const AccordionGroup = ({
  characteristics,
  characteristics2,
  note,
}: AccordionGroupProps) => {
  const { t, i18n } = useTranslation();

  const items = [
    {
      id: 1,
      title: t("add_to_cart.prod_det"),
      content: characteristics,
    },
    {
      id: 2,
      title: t("add_to_cart.ship_info"),
      content: characteristics2,
    },
    {
      id: 3,
      title: t("add_to_cart.returns"),
      content: note,
    },
  ];

  const [openId, setOpenId] = useState<number | null>(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  const toggle = (i: number) => {
    setOpenId(i === openId ? null : i);
  };

  return (
    <div
      className="accordion mt-6 border-t border-gray-200"
      key={i18n.language}
    >
      {items.map((item, i) => (
        <div key={i} className="border-b border-solid py-2">
          <button
            onClick={() => toggle(i)}
            className="flex justify-between w-full text-sm text-[#5c5c5c] font-semibold"
          >
            <span>{item.title}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="#5c5c5c"
              className={`transition-transform duration-300 ${
                openId === i ? "rotate-180" : ""
              }`}
            >
              <path d="m12 6.586-8.707 8.707 1.414 1.414L12 9.414l7.293 7.293 1.414-1.414L12 6.586z" />
            </svg>
          </button>

          <div
            ref={(el) => {
              refs.current[i] = el;
            }}
            style={{
              maxHeight:
                openId === i ? refs.current[i]?.scrollHeight + "px" : "0px",
            }}
            className="overflow-hidden transition-all duration-300"
          >
            <div
              className={`py-2 text-sm text-[#5c5c5c] transition-opacity duration-1000 ${
                openId === i ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(item.content),
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AccordionGroup;
