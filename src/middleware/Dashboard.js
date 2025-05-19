import apiClient from "./BaseApi";

export const getDashboardStatsAPI = async () => {
  const response = await apiClient.get("/api/v1/dashboard/stats");
  return response.data;
}; 