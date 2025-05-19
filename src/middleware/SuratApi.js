// src/middleware/SuratApi.js
import apiClient from "./BaseApi";

// Get all surat masuk with pagination and search
export const getSuratAllAPI = async (payload) => {
  const response = await apiClient.get(`/api/v1/surat-masuk/show-all?${payload}`);
  return response.data;
};

// Get single surat by ID
export const getSuratByIdAPI = async (id) => {
  const response = await apiClient.get(`/api/v1/surat-masuk/show-one/${id}`);
  return response.data;
};

// Create new surat masuk
export const createSuratAPI = async (formData) => {
  const response = await apiClient.post(
    "/api/v1/surat-masuk/create",
    formData,
    {
      headers: formData instanceof FormData
        ? { "Content-Type": "multipart/form-data" }
        : {}
    }
  );
  return response.data;
};

// Update existing surat masuk
export const updateSuratAPI = async (id, surat) => {
  const response = await apiClient.put(
    `/api/v1/surat-masuk/update/${id}`,
    surat
  );
  return response.data;
};

// Delete surat masuk
export const deleteSuratAPI = async (id) => {
  const response = await apiClient.delete(`/api/v1/surat-masuk/delete/${id}`);
  return response.data;
};
