// components/CertificateModal.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

interface Certificate {
  id: number;
  title: string;
  description: string;
  issue_date: string;
  image: string;
}

export default function CertificateModal({ certificates }: { certificates: Certificate[] }) {
  const { t, i18n } = useTranslation();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // ESC для закрытия модалки
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelectedImage(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) setSelectedImage(null);
  };

  const fmtDate = (iso?: string) => {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleDateString(i18n.language || "az", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-16 mt-12 mb-24 text-[#171717]">
      <h1 className="text-4xl font-bold mb-8">{t("certificate.title")}</h1>

      {certificates.length ? (
        <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition cursor-pointer"
            >
              <div
                className="relative w-full h-48 mb-4 rounded overflow-hidden"
                onClick={() => setSelectedImage(item.image)}
                aria-label={item.title}
                role="button"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                  className="object-cover hover:scale-105 transition-transform"
                />
              </div>
              <h2 className="text-xl font-semibold mb-1">{item.title}</h2>
              <p className="text-sm text-gray-500 mb-2">
                {t("certificate.issuedOn")}: {fmtDate(item.issue_date)}
              </p>
              <p className="text-gray-700">{item.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">{t("certificate.empty")}</p>
      )}

      {/* Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={handleBackdropClick}
          aria-modal="true"
          role="dialog"
        >
          <button
            className="absolute top-4 right-4 text-white text-4xl font-bold z-50"
            onClick={() => setSelectedImage(null)}
            aria-label={t("certificate.modalClose")}
            title={t("certificate.modalClose")}
          >
            &times;
          </button>

          <div className="relative w-[600px] max-w-[90vw]">
            <Image
              src={selectedImage}
              alt="Certificate"
              width={600}
              height={400}
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
}
