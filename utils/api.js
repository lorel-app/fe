import axios from 'axios';
// temp : import from env without dotenv
const BASE_URL = "http://localhost:3000";

let accessToken = null;
let refreshToken = null;

const apiInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const setTokens = (access, refresh) => {
  accessToken = access;
  refreshToken = refresh;
  if (accessToken) {
    apiInstance.defaults.headers["Authorization"] = `Bearer ${accessToken}`;
  } else {
    delete apiInstance.defaults.headers["Authorization"];
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
    setTokens(newAccessToken, refreshToken); // update the access token
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
      // Unauthorized, attempt to refresh token
      try {
        await refreshAccessToken();
        // Retry the original request with the new token
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
    console.log("User Data:", user); // user for future use 
    setTokens(accessToken, refreshToken);
  }
  return response;
};

export default {
  signUp,
  login,
};