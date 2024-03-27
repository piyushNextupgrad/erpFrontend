import axios from "axios";
import Router from "next/router";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL,
  timeout: 10000, // Set a timeout (optional)
});

// Add a request interceptor to include the token in the request body
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminTokenErpApplication"); // Get the token from localStorage
    if (token) {
      config.data = {
        ...config.data,
        token: token,
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.data &&
      error.response.data.success === false &&
      error.response.data.error === "Invalid token"
    ) {
      localStorage.clear();

      Router.push("/Login");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
