
import useAuthStore from '../hook/Auth.store';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_REACT_API_URL || 'http://localhost:9090', 
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await useAuthStore.getState().refreshToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('Refresh token failed, logging out...');
        useAuthStore.getState().logout();
        window.location.href = '/login'; 
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
