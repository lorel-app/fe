import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://localhost:3000";

let onTokenChange = null;
let accessToken = null;
let refreshToken = null;

const setOnTokenChangeCallback = (callback) => {
  onTokenChange = callback;
};

const apiInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const setTokens = async (access, refresh) => {
  accessToken = access;
  refreshToken = refresh;

  try {
    if (accessToken) {
      await AsyncStorage.setItem("accessToken", accessToken);
      apiInstance.defaults.headers["Authorization"] = `Bearer ${accessToken}`;
    } else {
      await AsyncStorage.removeItem("accessToken");
      delete apiInstance.defaults.headers["Authorization"];
    }
    if (refreshToken) {
      await AsyncStorage.setItem("refreshToken", refreshToken);
    } else {
      await AsyncStorage.removeItem("refreshToken");
    }
  } catch (e) {
    console.error("Failed to save tokens to storage", e);
  }
};

const loadTokens = async () => {
  try {
    const storedAccessToken = await AsyncStorage.getItem("accessToken");
    const storedRefreshToken = await AsyncStorage.getItem("refreshToken");

    if (storedAccessToken && storedRefreshToken) {
      setTokens(storedAccessToken, storedRefreshToken);
    }
  } catch (e) {
    console.error("Failed to load tokens from storage", e);
  }
};

const refreshAccessToken = async () => {
  if (!refreshToken) throw new Error("No refresh token available");

  try {
    const response = await apiInstance.post("/auth/refresh", {
      userId: getUserIdFromAccessToken(),
      refreshToken,
    });
    const newAccessToken = response.data.accessToken;
    await setTokens(newAccessToken, refreshToken);
    return newAccessToken;
  } catch (error) {
    throw new Error("Failed to refresh access token");
  }
};

const getUserIdFromAccessToken = () => {
  if (!accessToken) return null;
  const payload = JSON.parse(atob(accessToken.split(".")[1]));
  return payload.userId;
};

const handleResponse = async (request) => {
  try {
    const response = await request;
    return {
      success: true,
      statusCode: response.status || 200,
      data: response.data,
    };
  } catch (error) {
    if (error.response && error.response.status === 401) {
      try {
        await refreshAccessToken();
        const response = await request;
        return {
          success: true,
          statusCode: response.status || 200,
          data: response.data,
        };
      } catch (refreshError) {
        return {
          success: false,
          statusCode: 401,
          error: "Session expired. Please log in again.",
        };
      }
    } else if (error.response) {
      return {
        success: false,
        statusCode: error.response.status || -1,
        error: error.response.data?.message || "Unknown error",
      };
    } else {
      return {
        success: false,
        statusCode: -1,
        error: "Unknown error",
      };
    }
  }
};

const signUp = async (body) => {
  const request = apiInstance.post("/auth/signup", body);
  const response = await handleResponse(request);

  if (response.success) {
    const identity = body.username;
    const password = body.password;
    const loginResponse = await login({ identity, password });
    return loginResponse;
  }
  return response;
};

const login = async (body) => {
  const request = apiInstance.post("/auth/login", body);
  const response = await handleResponse(request);
  if (response.success) {
    const { accessToken, refreshToken, user } = response.data;
    await setTokens(accessToken, refreshToken);
  }
  return response;
};

const logout = async () => {
  const request = apiInstance.post("/auth/logout");
  const response = await handleResponse(request);
  if (response.success) {
    await setTokens(null, null);
    if (onTokenChange) onTokenChange(); // Notify context of the change
    return { success: true };
  } else {
    return { success: false, error: response.error };
  }
};

const getMe = async (body) => {
  const request = apiInstance.get("/me", body);
  const response = await handleResponse(request);
  if (response.success) {
    return response.data;
  }
  return null;
};

const updateProfilePic = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const request = apiInstance.put("me/display-picture", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  const response = await handleResponse(request);
  return response;
};

loadTokens();

export default {
  signUp,
  login,
  logout,
  getMe,
  updateProfilePic,
  loadTokens,
  setOnTokenChangeCallback,
};