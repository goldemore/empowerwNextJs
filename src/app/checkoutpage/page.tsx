"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { baseURL } from "@/baseURL";
import { AuthActions } from "@/auth/utils";
import { useCart } from "@/hooks/useCart";
import { useTranslation } from "react-i18next";

const CheckoutPage = () => {
  const router = useRouter();
  const { cartItems } = useCart();
  const { t, i18n } = useTranslation();
  const lang: "az" | "en" = i18n.language?.startsWith("en") ? "en" : "az";

  const [isLoading, setIsLoading] = useState(true);
  const [addressExists, setAddressExists] = useState(false);
  const [savedAddress, setSavedAddress] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [showInstallmentModal, setShowInstallmentModal] = useState(false);

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("userAuth") || "{}")
      : null;

  const subtotal = cartItems.reduce((acc, item) => {
    const product = item.product_data;
    if (!product) return acc;
    const price = product.sale_price ?? product.price ?? 0;
    return acc + price * item.quantity;
  }, 0);

  const total = subtotal.toFixed(2);
  const token = AuthActions.getToken();

  useEffect(() => {
    axios
      .get(`${baseURL}tailor/myaddress/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.length > 0) {
          const latest = res.data[res.data.length - 1];
          setSavedAddress(latest);
          setAddressExists(true);
        }
      })
      .catch((err) => console.error("❌ Ошибка при получении адреса:", err))
      .finally(() => setIsLoading(false));
  }, []);

  // 📝 Отправка формы (POST или PUT)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token) return;

    setIsLoading(true);

    const data = {
      first_name: name,
      last_name: lastName,
      email,
      phone_number: phone,
      address,
      note,
      user: user,
    };

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      if (editMode && savedAddress?.id) {
        await axios.put(
          `${baseURL}tailor/address-retrieve-update-delete/${savedAddress.id}/`,
          data,
          { headers }
        );
      } else {
        await axios.post(`${baseURL}tailor/address-create/`, data, { headers });
      }
      window.location.reload();
    } catch (err) {
      console.error("❌ Ошибка при отправке формы:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 📋 При нажатии Edit — заполняем форму
  const handleEdit = () => {
    if (savedAddress) {
      setName(savedAddress.first_name);
      setLastName(savedAddress.last_name);
      setEmail(savedAddress.email);
      setPhone(savedAddress.phone_number);
      setAddress(savedAddress.address);
      setNote(savedAddress.note);
      setEditMode(true);
    }
  };

  // 📦 Подготовка данных заказа
  const orderItems = cartItems.map((item) => ({
    product: item.product,
    quantity: item.quantity,
    size: item.size,
    color: item.color || "",
  }));

  const orderData = {
    order: {
      first_name: savedAddress?.first_name,
      last_name: savedAddress?.last_name,
      email: savedAddress?.email,
      phone_number: savedAddress?.phone_number,
      address: savedAddress?.address,
      note: savedAddress?.note,
    },
    items: orderItems,
  };

  const handleNormalPayment = async () => {
    try {
      const res = await axios.post(
        `${baseURL}tailor/orderitem-create/`,
        orderData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.status === 201) {
        window.location.href = res.data.order_url;
      }
    } catch (err) {
      console.error("❌ Ошибка при полной оплате:", err);
    }
  };

  const handleInstallmentPayment = async (months: number) => {
    try {
      const res = await axios.post(
        `${baseURL}tailor/pay-with-installment/`,
        { ...orderData, installments: months },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status === 201) {
        window.location.href = res.data.order_url;
      }
    } catch (err) {
      console.error("❌ Ошибка при рассрочке:", err);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-lg mb-4">{t("checkout.auth_required")}</p>
        <Link
          href={{ pathname: "/login", query: { callbackUrl: "/checkout" } }}
          className="bg-black text-white px-4 py-2 rounded"
        >
          {t("checkout.go_login")}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-16 py-16">
      {/* 🧾 Левая часть — адрес */}
      <div className="bg-white border p-6 rounded-md order-2 md:order-1">
        {isLoading ? (
          <p>{t("checkout.loading")}</p>
        ) : !savedAddress || editMode ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">
              {editMode
                ? t("checkout.edit_address")
                : t("checkout.shipping_address")}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder={t("checkout.placeholders.first_name")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border rounded p-2"
              />
              <input
                type="text"
                placeholder={t("checkout.placeholders.last_name")}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="border rounded p-2"
              />
            </div>
            <input
              type="email"
              placeholder={t("checkout.placeholders.email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border rounded p-2 w-full"
            />
            <input
              type="tel"
              placeholder={t("checkout.placeholders.phone_number")}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="border rounded p-2 w-full"
            />
            <textarea
              placeholder={t("checkout.placeholders.address")}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="border rounded p-2 w-full"
              rows={4}
            />
            <textarea
              placeholder={t("checkout.placeholders.note_optional")}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="border rounded p-2 w-full"
              rows={2}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="bg-black text-white px-4 py-2 rounded w-full"
            >
              {isLoading
                ? t("checkout.buttons.saving")
                : editMode
                ? t("checkout.buttons.update_address")
                : t("checkout.buttons.save_address")}
            </button>
          </form>
        ) : (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">
              {t("checkout.saved_address")}
            </h2>
            <p>
              <strong>{t("checkout.labels.name")}</strong>{" "}
              {savedAddress.first_name} {savedAddress.last_name}
            </p>
            <p>
              <strong>{t("checkout.labels.email")} </strong>
              {savedAddress.email}
            </p>
            <p>
              <strong>{t("checkout.labels.phone")} </strong>
              {savedAddress.phone_number}
            </p>
            <p>
              <strong>{t("checkout.labels.address")} </strong>
              {savedAddress.address}
            </p>
            <p>
              <strong>{t("checkout.labels.note")} </strong>
              {savedAddress.note}
            </p>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6 w-full">
              <button
                onClick={handleEdit}
                className="bg-yellow-500 text-white px-4 py-2 rounded w-full md:w-fit"
              >
                {t("checkout.buttons.edit_address")}
              </button>
              <div className="flex flex-col md:flex-row gap-3 w/full md:w-fit">
                <button
                  onClick={handleNormalPayment}
                  className="bg-green-600 text-white px-4 py-2 rounded w-full md:w-fit"
                >
                  {t("checkout.buttons.pay_full")}
                </button>
                <button
                  onClick={() => setShowInstallmentModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded w-full md:w-fit"
                >
                  {t("checkout.buttons.pay_installments")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 🛒 Правая часть — корзина */}
      {/* 🛒 Правая часть — корзина */}
      <div className="bg-gray-50 p-6 rounded-md border h-fit md:sticky top-20 order-1 md:order-2 w-full">
        <h2 className="text-xl font-semibold mb-4">
          {t("checkout.right.your_order")}
        </h2>

        {cartItems.length === 0 ? (
          <p className="text-gray-500">{t("checkout.right.empty")}</p>
        ) : (
          <>
            <div className="space-y-6 max-h-[300px] overflow-y-auto">
              {cartItems.map((item) => {
                const pd = item.product_data;
                if (!pd) return null;

                const title =
                  pd.title_translations?.[lang] ??
                  pd.title_translations?.az ??
                  t("checkout.no_title");

                const unitPrice = pd.sale_price ?? pd.price ?? 0;
                const lineTotal = (unitPrice * item.quantity).toFixed(2);

                return (
                  <div
                    key={`${item.product}-${item.size}`}
                    className="flex gap-4"
                  >
                    <div className="w-20 h-28 relative border rounded">
                      <Image
                        src={pd.image || "/placeholder.png"}
                        alt={title}
                        fill
                        className="object-cover rounded"
                        sizes="100%"
                      />
                    </div>

                    <div className="flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-semibold">{title}</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {t("checkout.right.size")} {item.size}
                        </p>
                      </div>
                      <div className="text-sm mt-2 text-gray-700">
                        {lineTotal} ₼
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t pt-4 mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{t("checkout.right.subtotal")}</span>
                <span>{subtotal.toFixed(2)} ₼</span>
              </div>
              <div className="flex justify-between text-base font-bold pt-2">
                <span>{t("checkout.right.total")}</span>
                <span>{total} ₼</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 💳 Модалка рассрочки */}
      {showInstallmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-xl text-center w-80">
            <h2 className="text-lg font-semibold mb-4">
              {t("checkout.installment.title")}
            </h2>

            {[2, 3, 6, 9].map((m) => {
              const rate = 1 + (1.33 * m) / 100;
              const monthlyTotal = (Number(total) * rate).toFixed(2);
              return (
                <button
                  key={m}
                  onClick={() => handleInstallmentPayment(m)}
                  className="block w-full border rounded p-2 my-2 hover:bg-gray-100"
                >
                  {t("checkout.installment.option", {
                    m,
                    amount: monthlyTotal,
                  })}
                </button>
              );
            })}

            <button
              className="mt-4 text-red-600"
              onClick={() => setShowInstallmentModal(false)}
            >
              {t("checkout.buttons.close")}
            </button>
          </div>
        </div>
      )}
      {showInstallmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-xl text-center w-80">
            <h2 className="text-lg font-semibold mb-4">
              {t("checkout.installment.title")}
            </h2>

            {[2, 3, 6, 9].map((m) => {
              const rate = 1 + (1.33 * m) / 100;
              const monthlyTotal = (Number(total) * rate).toFixed(2);
              return (
                <button
                  key={m}
                  onClick={() => handleInstallmentPayment(m)}
                  className="block w-full border rounded p-2 my-2 hover:bg-gray-100"
                >
                  {t("checkout.installment.option", {
                    m,
                    amount: monthlyTotal,
                  })}
                </button>
              );
            })}

            <button
              className="mt-4 text-red-600"
              onClick={() => setShowInstallmentModal(false)}
            >
              {t("checkout.buttons.close")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
