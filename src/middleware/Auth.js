import apiClient from "./BaseApi";

export const loginAPI = async (credentials) => {
  const response = await apiClient.post('/api/v1/auth/login', credentials);
  return response.data;
};

export const refreshTokenAPI = async (refresh_token) => {
  const response = await apiClient.post('/api/v1/auth/refresh', { refresh_token });
  return response.data;
};
