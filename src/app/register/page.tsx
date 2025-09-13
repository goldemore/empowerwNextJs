"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { AuthActions } from "@/auth/utils";
import { useTranslation } from "react-i18next";

const RegisterPage = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [rPass, setRPass] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();
  const { register } = AuthActions;

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (pass !== rPass) {
      setError(t("passwordsDoNotMatch"));
      return;
    }

    try {
      const res = await register(email, name, pass);
      console.log("Registered:", res.data);
      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || t("registrationFailed"));
    }
  };

  return (
    <div className="flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center text-black mb-8 uppercase">
          {t("createAccount")}
        </h2>
        <form className="space-y-6" onSubmit={handleRegister}>
          <div>
            <label className="block text-sm font-medium text-black mb-1">{t("name")}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-black/30 rounded-xs"
              placeholder={t("enterName")}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">{t("email")}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-black/30 rounded-xs"
              placeholder={t("enterEmail")}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">{t("password")}</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-black/30 rounded-xs"
                placeholder={t("enterPassword")}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">{t("confirmPassword")}</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={rPass}
                onChange={(e) => setRPass(e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-black/30 rounded-xs"
                placeholder={t("confirmYourPassword")}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-black text-white font-semibold py-2 rounded-xs hover:bg-gray-900 transition"
          >
            {t("createAccountBtn")}
          </button>

          <p className="text-center text-sm text-black">
            {t("alreadyHaveAccount")}{" "}
            <a href="/login" className="hover:underline font-semibold">
              {t("loginHere")}
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
