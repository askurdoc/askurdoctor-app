import { BASE_URL } from '../config/constants';
import axios from "axios";

const baseUrl = BASE_URL();

const axiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 1000 * 10,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercept every request to check if the access token is expired
axiosInstance.interceptors.request.use(
  async (config) => {
    const expiresAt = localStorage.getItem("expiresAt");
    const isExpired = Date.now() > parseInt(expiresAt ?? "");
    if (isExpired) {
      console.log("Refreshing");
      await refreshAccessToken();
    }
    config.headers.Authorization = "Bearer " + localStorage.getItem("accessToken");

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log(response);
    return response;
  },
  async (error) => {
    console.log("ERROR RESPONSE:", error.response);
    return Promise.reject(error.response.data.message.toString());
  }
);

async function refreshAccessToken() {
  try {
    const body = {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };
    const result = await axios.post(baseUrl + "/api/v1/users/auth/refreshToken", body);

    if (result.status === 201) {
      localStorage.setItem("accessToken", result.data.accessToken);
      localStorage.setItem("refreshToken", result.data.refreshToken);
      localStorage.setItem("expiresAt", (Date.now() + 1000 * 60 * 15).toString());
    }
  } catch (e) {
    console.log(e);
    console.log("Navigate to login and clear everything");
    localStorage.clearItem("accessToken");
    localStorage.clearItem("refreshToken");
    localStorage.clearItem("expiresAt");
  }
}

export default axiosInstance;