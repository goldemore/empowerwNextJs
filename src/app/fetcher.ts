import axios, { AxiosInstance, AxiosError } from "axios";
import { AuthActions } from "@/auth/utils";
import { baseURL } from "@/baseURL"; // базовый URL для API

const { handleJWTRefresh, storeToken, getToken, removeTokens } = AuthActions;

// Создаём экземпляр axios
const api: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// Добавляем access token к каждому запросу
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Обработка ошибки 401: попытка обновить токен
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      try {
        const response = await handleJWTRefresh();
        const { access } = response.data;
        storeToken(access);

        // Повторяем исходный запрос с новым токеном
        const originalRequest = error.config;
        if (originalRequest && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return axios(originalRequest);
        }
      } catch (err) {
        removeTokens();
        window.location.replace("/login");
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

// Универсальный fetcher (например, для SWR или просто общего API-вызова)
export const fetcher = async (url: string): Promise<any> => {
  const response = await api.get(url);
  return response.data;
};
