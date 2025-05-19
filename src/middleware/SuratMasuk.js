import apiClient from "./BaseApi";

export const getSuratMasukAllAPI = async (payload) => {
  const response = await apiClient.get(`/api/v1/surat-masuk/show-all?${payload}`);
  return response.data;
};

export const getSuratMasukByIdAPI = async (id) => {
  const response = await apiClient.get(`/api/v1/surat-masuk/show-one/${id}`);
  return response.data;
};

export const createSuratMasukAPI = async (formData) => {
  const response = await apiClient.post(
    "/api/v1/surat-masuk/create",
    formData,
    {
      headers: {
        ...(formData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {})
      }
    }
  );
  return response.data;
};

export const updateSuratMasukAPI = async (id, formData) => {
  const response = await apiClient.put(
    `/api/v1/surat-masuk/update/${id}`,
    formData,
    {
      headers: {
        ...(formData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {})
      }
    }
  );
  return response.data;
};

export const deleteSuratMasukAPI = async (id) => {
  const response = await apiClient.delete(`/api/v1/surat-masuk/delete/${id}`);
  return response.data;
};

export const downloadSuratMasukAPI = async (filename) => {
  const response = await apiClient.get(`/api/v1/surat-masuk/download/${filename}`, {
    responseType: 'blob'
  });
  return response;
}; 