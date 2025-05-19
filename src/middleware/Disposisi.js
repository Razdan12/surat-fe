import apiClient from "./BaseApi";

// Get all disposisi with pagination and search
export const getDisposisiAPI = async (payload) => {
  const response = await apiClient.get(`/api/v1/disposisi/show-all?${payload}`);
  return response.data;
};

// Get single disposisi by ID
export const getDisposisiByIdAPI = async (id) => {
  const response = await apiClient.get(`/api/v1/disposisi/show-one/${id}`);
  return response.data;
};

// Create new disposisi
export const createDisposisiAPI = async (data) => {
  const { suratType = 'masuk', suratId, ...rest } = data;
  const payload = {
    ...rest,
    suratType,
    ...(data.suratMasukId && { suratMasukId: data.suratMasukId }),
    ...(data.suratKeluarId && { suratKeluarId: data.suratKeluarId })
   
  };
  const response = await apiClient.post("/api/v1/disposisi/create", payload);
  return response.data;
};

// Update existing disposisi
export const updateDisposisiAPI = async (id, data) => {
  const { suratType = 'masuk', suratId, ...rest } = data;
  const payload = {
    ...rest,
    suratType,
    suratMasukId: suratType === 'masuk' ? suratId : null,
    suratKeluarId: suratType === 'keluar' ? suratId : null
  };
  const response = await apiClient.put(`/api/v1/disposisi/update/${id}`, payload);
  return response.data;
};

// Delete disposisi
export const deleteDisposisiAPI = async (id) => {
  const response = await apiClient.delete(`/api/v1/disposisi/delete/${id}`);
  return response.data;
}; 