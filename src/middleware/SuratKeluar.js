import apiClient from "./BaseApi";

export const getSuratKeluarAllAPI = async (payload) => {
  const response = await apiClient.get(`/api/v1/surat-keluar/show-all?${payload}`);
  return response.data;
};

export const getSuratKeluarByIdAPI = async (id) => {
  const response = await apiClient.get(`/api/v1/surat-keluar/show-one/${id}`);
  return response.data;
};

export const createSuratKeluarAPI = async (formData) => {
  const response = await apiClient.post(
    "/api/v1/surat-keluar/create",
    formData,
    {
      headers: {
        ...(formData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {})
      }
    }
  );
  return response.data;
};

export const updateSuratKeluarAPI = async (id, formData) => {
  const response = await apiClient.put(
    `/api/v1/surat-keluar/update/${id}`,
    formData,
    {
      headers: {
        ...(formData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {})
      }
    }
  );
  return response.data;
};

export const deleteSuratKeluarAPI = async (id) => {
  const response = await apiClient.delete(`/api/v1/surat-keluar/delete/${id}`);
  return response.data;
};

export const downloadSuratKeluarAPI = async (filename) => {
  const response = await apiClient.get(`/api/v1/surat-keluar/download/${filename}`, {
    responseType: 'blob'
  });
  return response;
};
