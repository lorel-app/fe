import axios from 'axios';

const BASE_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const handleResponse = async (request) => {
  try {
    const response = await request;
    return {
      success: true,
      statusCode: response.status || 200,
      data: response.data,
    };
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        statusCode: error.response.status || -1,
        error: error.response.data?.message || 'Unknown error',
      };
    } else {
      return {
        success: false,
        statusCode: -1,
        error: 'Unknown error',
      };
    }
  }
};

export const signUp = async (body) => {
  const request = api.post("/auth/signup", body);
  return handleResponse(request);
};

export const login = async (body) => {
  const request = api.post('/auth/login', body);
  return handleResponse(request);
};
