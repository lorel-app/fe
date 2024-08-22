// import { BASE_URL } from "@env"; > cannot use dotenv
const BASE_URL= "http://localhost:3000"

export const apiCall = async (endpoint, method = "GET", body = null) => {
  const headers = {
    "Content-Type": "application/json",
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Something went wrong!");
  }

  return response.json();
};
