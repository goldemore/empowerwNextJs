"use client";

import { useRef, useState, useEffect } from "react";
import RangeSlider from "./filters/RangeSlider";
import ColorCircles from "./filters/ColorCircles";
import CheckboxList from "./filters/CheckboxList";
import ButtonOptions from "./filters/ButtonOptions";
import { useTranslation } from "react-i18next";

type FilterValue = { label: string; value: string | number };
type FilterType = {
  key: string;
  title: string;
  type: "range" | "color" | "checkbox" | "buttons";
  min?: number;
  max?: number;
  values?: FilterValue[];
};

const AccordionFilter = ({
  filters,
  appliedFilters,
  setAppliedFilters,
}: {
  filters: FilterType[];
  appliedFilters: { [key: string]: any };
  setAppliedFilters: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
}) => {

  const {t} = useTranslation()
  const [openId, setOpenId] = useState<number | null>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggleAccordion = (index: number) => {
    setOpenId(openId === index ? null : index);
  };

  const removeFilter = (key: string, value?: string | number) => {
    setAppliedFilters((prev) => {
      if (key === "price" || value === undefined) {
        const { [key]: _, ...rest } = prev;
        return rest;
      }

      const current = prev[key];
      const updated = current.filter((v: any) => v !== value);

      if (updated.length === 0) {
        const { [key]: _, ...rest } = prev;
        return rest;
      }

      return { ...prev, [key]: updated };
    });
  };

  const renderFilterContent = (filter: FilterType) => {
    const props = { filterKey: filter.key, appliedFilters, setAppliedFilters };
    
    

    switch (filter.type) {
      case "range":
        return <RangeSlider min={filter.min!} max={filter.max!} {...props} />;
      case "color":
        return <ColorCircles options={filter.values!} {...props} />;
      case "checkbox":
        return <CheckboxList options={filter.values!} {...props} />;
      case "buttons":
        return <ButtonOptions options={filter.values!} {...props} />;
      default:
        return null;
    }
  };

  if (!Array.isArray(filters)) {
    return <div className="text-red-500">Filters data is invalid.</div>;
  }

  

  return (
    <>
      {/* Applied Filters */}
      {Object.keys(appliedFilters).length > 0 && (
        <div className="mt-3 px-2">
          <span className="text-base text-[#5c5c5c]">{t("applied_filters")}</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {Object.entries(appliedFilters).map(([key, val]) =>
              key === "price" && Array.isArray(val) ? (
                <div
                  key={`${key}-${val[0]}-${val[1]}`}
                  className="flex px-2 py-1 w-fit items-center gap-2 bg-[#0000000d] rounded-sm"
                >
                  <span className="text-sm text-[#5c5c5c]">
                    ${val[0]} - ${val[1]}
                  </span>
                  <div
                    onClick={() => removeFilter(key)}
                    className="cursor-pointer"
                  >
                    ✕
                  </div>
                </div>
              ) : (
                (Array.isArray(val) ? val : [val]).map((v) => (
                  <div
                    key={`${key}-${v}`}
                    className="flex px-2 py-1 w-fit items-center gap-2 bg-[#0000000d] rounded-sm"
                  >
                    <span className="text-sm text-[#5c5c5c]">{v}</span>
                    <div
                      onClick={() => removeFilter(key, v)}
                      className="cursor-pointer"
                    >
                      ✕
                    </div> 
                  </div>
                ))
              )
            )}
          </div>

          <button
            onClick={() => {
              setAppliedFilters({});
              setOpenId(null);
            }}
            className="text-base text-[#ff8b8b] mt-3"
          >
            {t("clearAll")}
          </button>
        </div>
      )}

      {/* Filters List */}
      <div className="accordion mt-4 border-t border-gray-200">
        {filters.map((filter, index) => {
          const isOpen = openId === index;

          return (
            <div key={filter.key} className="border-b py-2">
              <button
                className="flex justify-between w-full text-sm text-[#5c5c5c] font-semibold"
                onClick={() => toggleAccordion(index)}
              >
                <span>{t(`filters.${filter.key}`, { defaultValue: filter.title })}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="#5c5c5c"
                  className={`transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  <path d="m12 6.586-8.707 8.707 1.414 1.414L12 9.414l7.293 7.293 1.414-1.414L12 6.586z" />
                </svg>
              </button>

              {/* Плавное открытие через scrollHeight */}
              <div
                ref={(el) => { contentRefs.current[index] = el; }}
                style={{
                  maxHeight: isOpen
                    ? `${contentRefs.current[index]?.scrollHeight}px`
                    : "0px",
                  overflow: "hidden",
                }}
                className="transition-all duration-500"
              >
                <div className="py-2">{renderFilterContent(filter)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default AccordionFilter;
