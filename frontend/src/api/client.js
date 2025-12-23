import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    withCredentials: false,
});

const TOKEN_KEY = "token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => token && localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// Interceptor: agrega Authorization si hay token
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor de respuesta: normaliza errores del backend
api.interceptors.response.use(
  (res) => {
    const { data } = res;
    if (data?.success === false) {
      const err = new Error(data?.error?.message || "Error de negocio");
      err.code = data?.error?.code;
      err.details = data?.error?.details;
      throw err;
    }
    return data?.data ?? data;
  },
  (error) => {
    if (error.response) {
      const payload = error.response.data;
      const err = new Error(
        payload?.error?.message || payload?.message || "Error de servidor"
      );
      err.code = payload?.error?.code;
      err.status = error.response.status;
      err.details = payload?.error?.details;
      throw err;
    }
    if (error.request) throw new Error("No se pudo conectar con el servidor");
    throw error;
  }
);

export default api;