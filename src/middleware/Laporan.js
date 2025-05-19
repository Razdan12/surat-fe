import apiClient from './BaseApi';

// Get laporan surat with filters
export const getLaporanSuratAPI = async (queryParams) => {
  const response = await apiClient.get(`/api/v1/laporan/show-all?${queryParams}`);
  return response.data;
};
