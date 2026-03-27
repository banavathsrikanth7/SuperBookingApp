import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});

api.interceptors.request.use(
  async (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url || "";
    const isRefreshRequest = requestUrl.includes("/auth/refresh/");
    const status = error.response?.status;

    // console.log(
    //   `[Interceptor] Request: ${originalRequest.method?.toUpperCase()} ${requestUrl}, Status: ${status}, IsRefresh: ${isRefreshRequest}, Retry: ${originalRequest._retry}`,
    // );

    // Prevent infinite loops: don't retry refresh endpoint or requests already retried
    if (status === 401 && !originalRequest._retry && !isRefreshRequest) {
      // console.log("[Interceptor] Attempting token refresh...");
      originalRequest._retry = true;
      try {
        const refreshResponse = await api.post("/auth/refresh/");
        // console.log(
        //   "[Interceptor] Token refresh successful, retrying original request",
        // );
        return api(originalRequest);
      } catch (err) {
        console.error(
          "[Interceptor] Token refresh failed:",
          err.response?.status,
          err.message,
        );
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    // console.log(
    //   `[Interceptor] Not retrying. Status: ${status}, Already retried: ${originalRequest._retry}, Is refresh: ${isRefreshRequest}`,
    // );
    return Promise.reject(error);
  },
);

export const getExperiences = () => api.get("/experiences");
export const getExperience = (id) => api.get(`/experiences/${id}`);
export const createBooking = (data) => api.post("/bookings", data);
export const getBookings = (userId) => api.get(`/bookings/user/${userId}`);
export const loginUser = (data) => api.post("/auth/login", data);
export default api;
