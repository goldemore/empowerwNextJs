import axios from "axios";
import { baseURLAc } from "@/baseURL.js";

// 🔐 Axios с withCredentials — чтобы отправлялись cookie
const api = axios.create({
  baseURL: baseURLAc,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// 👉 Access token храним в памяти
let accessToken: string | null = null;

// 📌 Получаем csrftoken из cookie
const getCSRFToken = (): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; csrftoken=`);
  if (parts.length === 2) return parts.pop()!.split(';').shift() || null;
  return null;
};

// ✅ Установить access token
const storeToken = (token: string) => {
  localStorage.setItem("accessToken", token); // 💾 Сохраняем в localStorage
};

// ✅ Получить access token
const getToken = () => {
  if (accessToken) return accessToken;
  const stored = localStorage.getItem("accessToken"); // 💾 Пробуем достать из localStorage
  if (stored) {
    accessToken = stored;
    return stored;
  }
  return null;
};

// ✅ Удалить access token
const removeTokens = () => { 
  accessToken = null;
  localStorage.removeItem("accessToken"); // 💥 Удаляем из хранилища
};

// 🔑 Логин — теперь с CSRF токеном
const login = async (email: string, password: string) => {
  const csrf = getCSRFToken();
  return api.post(
    "login/",
    { email, password },
    {
      headers: {
        "X-CSRFToken": csrf || "",
      },
    }
  );
};

// 🔄 Обновление access токена из HttpOnly cookie
const handleJWTRefresh = () => {
  const csrf = getCSRFToken(); // ✅ получить токен
  return api.post(
    "login/http-refresh/",
    {},
    {
      headers: {
        "X-CSRFToken": csrf || "", // ✅ добавить заголовок
      },
    }
  );
};

// 🚪 Логаут
const logout = () => {
  localStorage.removeItem("accessToken");
  const csrf = getCSRFToken();
  return api.post(
    "logout/",
    {},
    {
      headers: {
        "X-CSRFToken": csrf || "",
      },
    }
  );
};

// 🔒 Остальное
const register = (email: string, first_name: string, password: string) => {
  const csrf = getCSRFToken();
  return api.post(
    "user-create/",
    { email, first_name, password },
    {
      headers: {
        "X-CSRFToken": csrf || "",
      },
    }
  );
};

const resetPassword = (email: string) => {
  const csrf = getCSRFToken();
  return api.post(
    "reset_password/",
    { email },
    {
      headers: {
        "X-CSRFToken": csrf || "",
      },
    }
  );
}; 

const resetPasswordConfirm = (
  new_password: string,
  re_new_password: string,
  token: string,
  uid: string
) => {
  const csrf = getCSRFToken();
  return api.post(
    "send_email_reset_password/",
    {
      uid,
      token,
      new_password,
      re_new_password,
    },
    {
      headers: {
        "X-CSRFToken": csrf || "",
      },
    }
  );
};

export const AuthActions = {
  login,
  register,
  resetPassword,
  resetPasswordConfirm,
  handleJWTRefresh,
  logout,
  storeToken,
  getToken,
  removeTokens,
};
