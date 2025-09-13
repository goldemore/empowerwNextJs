"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import { baseURL } from "@/baseURL";
import axiosAuth from "@/auth/axiosAuth";

const PaymentResultPage = () => {
  const searchParams = useSearchParams();
  const status = searchParams.get("status"); // Approved, Cancelled, Declined
  const router = useRouter();

useEffect(() => {
  const status = searchParams.get("status");

  // Удаляем корзину только если оплата прошла
  if (status === "Approved") {
    localStorage.removeItem("cart");

    const clearServerCart = async () => {
      try {
        await axiosAuth.delete(`${baseURL}tailor/cart/clear/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN")}`,
          },
        });
        console.log("✅ Корзина на сервере очищена");
      } catch (err) {
        console.error("❌ Ошибка при очистке корзины на сервере:", err);
      }
    };

    clearServerCart();
  }
}, [searchParams]);



  const handleBack = () => {
    router.push("/");
  };

  const getTitle = () => {
    switch (status) {
      case "Approved":
        return "✅ Ödəniş təsdiq edildi!";
      case "Cancelled":
        return "⚠️ Ödəniş ləğv edildi!";
      case "Declined":
        return "❌ Ödəniş rədd edildi!";
      default:
        return "Bilinməyən nəticə";
    }
  };

  const getGif = () => {
    switch (status) {
      case "Approved":
        return "/approved.gif";
      case "Cancelled":
        return "/canceled.gif";
      case "Declined":
        return "/declined.gif";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
      <h2 className="text-xl font-bold">{getTitle()}</h2>

      {getGif() && (
        <Image src={getGif()} alt="Result GIF" width={200} height={200} />
      )}

      <button
        onClick={handleBack}
        className="bg-black text-white px-4 py-2 rounded mt-4"
      >
        Əsas səhifəyə qayıt
      </button>
    </div>
  );
};

export default PaymentResultPage;
