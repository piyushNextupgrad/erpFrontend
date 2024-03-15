import axios from "axios";
import Router from "next/router"; // Import the Router object from Next.js

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL, // Set your API base URL
  timeout: 10000, // Set a timeout (optional)
});

// Add a request interceptor to include the token in the request body
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminTokenErpApplication"); // Get the token from localStorage
    if (token) {
      config.data = {
        ...config.data,
        token: token, // Add the token to the request body
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response, // Return the response as-is for successful requests
  (error) => {
    if (
      error.response &&
      error.response.data &&
      error.response.data.success === false &&
      error.response.data.error === "Invalid token"
    ) {
      // Clear localStorage
      localStorage.clear();
      // Redirect to the "/Login" page
      Router.push("/Login");
    }
    return Promise.reject(error); // Return the error for further handling
  }
);

export default axiosInstance;
