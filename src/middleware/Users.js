import apiClient from "./BaseApi";


export const getUsersAPI = async (payload) => {
  const response = await apiClient.get(`/api/v1/user/show-all?${payload}`);
  return response.data;
}
export const getUserAPI = async (id) => {
  const response = await apiClient.get(`/api/v1/user/show-one/${id}`);
  return response.data;
}
export const createUserAPI = async (user) => {
  const response = await apiClient.post('/api/v1/user/create', user);
  return response.data;
}
export const updateUserAPI = async (id, user) => {
  const response = await apiClient.put(`/api/v1/user/update/${id}`, user);
  return response.data;
}
export const deleteUserAPI = async (id) => {
  const response = await apiClient.delete(`/api/v1/user/delete/${id}`);
  return response.data;
}