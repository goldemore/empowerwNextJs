"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Премиальный лёгкий лоадер:
 * - без внешних ассетов
 * - fade-out + минимальная длительность показа
 * - уважает prefers-reduced-motion
 */
export default function LuxLoader() {
  const [visible, setVisible] = useState(true);
  const start = useRef<number>(performance.now());

  useEffect(() => {
    const MIN_SHOW = 600; // мс — чтобы не мигал
    const finish = () => {
      const elapsed = performance.now() - start.current;
      const delay = Math.max(0, MIN_SHOW - elapsed);
      const t = setTimeout(() => setVisible(false), delay);
      return () => clearTimeout(t);
    };

    if (document.readyState === "complete") return finish();
    const onLoad = () => finish();
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy={visible}
      className={`fixed inset-0 z-[9999] flex items-center justify-center
      bg-[#f7f6f2] text-[#141414]
      transition-opacity duration-700
      ${
        visible
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Контент лоадера */}
      <div className="relative flex flex-col items-center gap-6">
        {/* Тонкое «кольцо» */}
        <div
          className="h-16 w-16 rounded-full border border-black/10
                     border-t-black/80 motion-safe:animate-spin"
          style={{ animationDuration: "900ms" }}
          aria-hidden
        />
        {/* Монограмма / бренд — очень лёгкая SVG, можно заменить на свой логотип */}
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 relative">
            <Image
              src="/logo-emp.png"
              alt="Empower Woman"
              fill
              className="object-contain"
            />
          </div>

          <div className="h-16 w-16 relative">
            <Image
              src="/empw.png"
              alt="Empower Woman"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Подпись «изысканный» */}
        <div className="text-[11px] tracking-[0.18em] text-neutral-500">
          Loading • • •
        </div>
      </div>

      {/* Мягкая виньетка по краям для «дорогого» ощущения */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          maskImage:
            "radial-gradient(80% 80% at 50% 50%, black 60%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(80% 80% at 50% 50%, black 60%, transparent 100%)",
          background:
            "radial-gradient(60% 60% at 50% 50%, rgba(0,0,0,0.04), transparent 70%)",
        }}
      />

      {/* Уважение reduced motion */}
      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          .motion-safe\\:animate-spin {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
