import axios, { isAxiosError, type InternalAxiosRequestConfig } from "axios";
import { refreshSession } from "./refreshSession";

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

// Same-origin client. All requests target Next.js route handlers under
// `/api/*`, which proxy to the gateway and re-emit HttpOnly cookies onto the
// Next.js host. `withCredentials` ensures the browser attaches cookies to
// every request automatically — the JS layer never reads or holds tokens.
const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!isAxiosError(error) || !error.config) return Promise.reject(error);

    const original = error.config as InternalAxiosRequestConfig;
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    original._retry = true;

    // One renewal for the whole tab, shared with the Apollo link (GW-8). It
    // uses plain fetch, outside this interceptor, so a 401 from
    // /auth/refresh can't recurse.
    if (await refreshSession()) return api(original);

    const { default: useAuthStore } = await import("@/store/useAuthStore");
    useAuthStore.getState().logout();
    return Promise.reject(error);
  },
);

export default api;
