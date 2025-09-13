"use client";

import { useState } from "react";
import axios from "axios";
import { baseURLAc } from "@/baseURL";
import { FaMapMarkerAlt, FaEnvelope, FaCalendarAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function ContactUs() {
  const { t } = useTranslation();

  // Массив из переводов: contactUS.info.addressLines = [...]
  const addressLines = t("contactUS.info.addressLines", {
    returnObjects: true,
  }) as string[];

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone_number: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      await axios.post(`${baseURLAc}send-message/`, form);
      setSuccess(t("contactUS.form.success"));
      setForm({ name: "", email: "", phone_number: "", message: "" });
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? t("contactUS.form.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mt-12 mb-24 text-[#171717]">
      <h1 className="text-4xl font-bold mb-12 text-center">
        {t("contactUS.title")}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left: Contact Info */}
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <FaMapMarkerAlt className="text-yellow-600 text-2xl mt-1" />
            <div>
              <h2 className="text-xl font-semibold mb-1">
                {t("contactUS.info.addressTitle")}
              </h2>
              {addressLines?.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-4">
            <FaEnvelope className="text-pink-600 text-2xl mt-1" />
            <div>
              <h2 className="text-xl font-semibold mb-1">
                {t("contactUS.info.emailTitle")}
              </h2>
              <p>info@empowerwoman.az</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <FaCalendarAlt className="text-red-500 text-2xl mt-1" />
            <div>
              <h2 className="text-xl font-semibold mb-1">
                {t("contactUS.info.hoursTitle")}
              </h2>
              <p>{t("contactUS.info.hoursValue")}</p>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            {t("contactUS.form.title")}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder={t("contactUS.form.phName")}
                value={form.name}
                onChange={handleChange}
                required
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <input
                type="text"
                name="phone_number"
                placeholder={t("contactUS.form.phPhone")}
                value={form.phone_number}
                onChange={handleChange}
                required
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder={t("contactUS.form.phEmail")}
              value={form.email}
              onChange={handleChange}
              required
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />

            <textarea
              name="message"
              placeholder={t("contactUS.form.phMessage")}
              rows={4}
              value={form.message}
              onChange={handleChange}
              required
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-[#0A1F36] text-white py-3 rounded-md font-semibold hover:bg-[#122d4f] transition"
            >
              {loading ? t("contactUS.form.sending") : t("contactUS.form.send")}
            </button>

            {success && <p className="text-green-600">{success}</p>}
            {error && <p className="text-red-600">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
