"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { baseURL } from "@/baseURL";
import { ChevronDown } from "lucide-react";

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export default function HelpCenter() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]); // для доступа к высотам

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await axios.get(`${baseURL}tailor/faq/en/`);
        setFaqs(res.data);
      } catch (err) {
        console.error("Failed to fetch FAQs", err);
      }
    };
    fetchFaqs();
  }, []);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-16 mt-12 mb-24 text-[#171717]">
      <h1 className="text-4xl font-bold mb-8 text-center">FAQ & Help Center</h1>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={faq.id}
            className={`border border-gray-200 rounded-lg shadow-sm overflow-hidden transition-colors duration-300 ${
              openIndex === index ? "bg-gray-100" : "bg-white"
            } hover:bg-gray-50`}
          >
            <button
              onClick={() => toggle(index)}
              className="w-full flex justify-between items-center text-lg font-medium px-6 py-4 transition"
            >
              <span>{faq.question}</span>
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-300 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              ref={(el) => {
                contentRefs.current[index] = el;
              }}
              style={{
                height:
                  openIndex === index
                    ? contentRefs.current[index]?.scrollHeight ?? "auto"
                    : 0,
              }}
              className="transition-all duration-500 ease-in-out overflow-hidden"
            >
              <div className="px-8 pb-4 pt-2 text-gray-700 text-sm">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 text-center">
        <h2 className="text-2xl font-semibold mb-2">Still need help?</h2>
        <p className="text-gray-600 mb-4">
          You can always{" "}
          <a href="/contact" className="text-blue-600 underline font-medium">
            contact us
          </a>{" "}
          for further assistance.
        </p>
      </div>
    </div>
  );
}
