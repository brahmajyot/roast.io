import axios from "axios";

const api = axios.create({
 baseURL:
  process.env
    .NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(
        "accessToken"
      );

    // ATTACH TOKEN
    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) =>
    Promise.reject(error)
);

export default api;