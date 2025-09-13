import axios from "axios";
import { baseURL } from "@/baseURL";
import { AuthActions } from "./utils";

const axiosAuth = axios.create({
  baseURL,
  withCredentials: true,
});

axiosAuth.interceptors.request.use(
  (config) => {
    const token = AuthActions.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosAuth.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const res = await AuthActions.handleJWTRefresh();  // ✅ правильный путь
        const newAccess = res.data.access;
        AuthActions.storeToken(newAccess);

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return axiosAuth(originalRequest);
      } catch (refreshErr) {
        console.error("🔁 Ошибка при обновлении токена", refreshErr);
        AuthActions.logout();
      }
    }

    return Promise.reject(error);
  }
);

export default axiosAuth;
