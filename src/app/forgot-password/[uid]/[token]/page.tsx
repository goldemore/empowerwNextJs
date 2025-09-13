"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AuthActions } from "@/auth/utils";

const ResetPasswordPage = () => {
  const { uid, token } = useParams();
  const { resetPasswordConfirm } = AuthActions;
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [reNewPassword, setReNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  // 1. Проверка совпадения
  if (newPassword !== reNewPassword) {
    setError("Passwords do not match.");
    return;
  }

  // 2. Проверка наличия цифры
  if (!/\d/.test(newPassword)) {
    setError("The password must contain at least one number.");
    return;
  }

  // 3. Проверка наличия заглавной буквы
  if (!/[A-Z]/.test(newPassword)) {
    setError("The password must contain at least one uppercase letter.");
    return;
  }

  try {
    await resetPasswordConfirm(newPassword, reNewPassword, token as string, uid as string);
    setSuccess("Password reset successfully.");
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  } catch (err: any) {
    setError(err.response?.data?.message || "Invalid or expired link.");
  }
};


  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-xl font-semibold mb-4">Set New Password</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="password"
          placeholder="New Password"
          className="border p-2"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="border p-2"
          value={reNewPassword}
          onChange={(e) => setReNewPassword(e.target.value)}
          required
        />
        <button className="bg-black text-white py-2">Reset Password</button>
        {success && <p className="text-green-600">{success}</p>}
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default ResetPasswordPage;
