"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch } from "react-redux";
import { setAuth } from "@/store/slices/authSlice";
import { AuthActions } from "@/auth/utils";
import { useTranslation } from "react-i18next";

type FormData = {
  email: string;
  password: string;
};

const Login = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>();

  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login, storeToken } = AuthActions;
  const dispatch = useDispatch();

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await login(data.email, data.password);
      const { access } = response.data;
      localStorage.setItem("userAuth", JSON.stringify(response.data.id));

      storeToken(access);
      dispatch(setAuth(true));
      router.push("/");
    } catch (err: any) {
      const message =
        err.response?.data?.detail || t("login.errorFailed");
      setError("root", {
        type: "manual",
        message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center text-black mb-8 uppercase">
          {t("login.title")}
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-black mb-1"
            >
              {t("login.emailLabel")}
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 rounded-xs border border-black/30 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder={t("login.phEmail")}
              {...register("email", { required: t("login.emailRequired") })}
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-black mb-1"
            >
              {t("login.passwordLabel")}
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-2 pr-10 rounded-xs border border-black/30 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder={t("login.phPassword")}
                {...register("password", { required: t("login.passwordRequired") })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-black"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {errors.root && (
            <div className="text-red-600 text-center text-sm">
              {errors.root.message}
            </div>
          )}

          <div className="flex justify-between text-sm text-black">
            <Link href="/forgot-password" className="hover:underline">
              {t("login.forgot")}
            </Link>
            <Link href="/register" className="hover:underline">
              {t("login.createAccountCta")}
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full font-semibold py-2 rounded-xs transition
              ${isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-900"
              }`}
          >
            {isLoading ? t("login.signingIn") : t("login.submit")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
