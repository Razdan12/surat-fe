import { create } from 'zustand';
import { loginAPI, refreshTokenAPI } from '../middleware/Auth';
import getErrorMessage from '../middleware/helper';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await loginAPI(credentials);
    
      const { user, token } = response.data;

      set({
        user,
        token: token.access_token,
        isLoading: false,
      });

      sessionStorage.setItem('token', token.access_token);
      localStorage.setItem('refresh', token.refresh_token);
      return user;
    } catch (error) {
   
      set({
        error: getErrorMessage(error, 'failed. Please try again.'),
        isLoading: false,
      });
    }
  },

  logout: () => {
    set({ user: null, token: null, error: null, isLoading: false });
    sessionStorage.removeItem('token');
    localStorage.removeItem('refresh');
  },

  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refresh') || '';
      const response = await refreshTokenAPI(refreshToken);
      const { token } = response.data;

      set({ token: token.access_token });

      sessionStorage.setItem('token', token.access_token);
      localStorage.setItem('refresh', token.refresh_token);

      return token.access_token;
    } catch (error) {
      set({ user: null, token: null });
      sessionStorage.removeItem('token');
      return null;
    }
  },
}));

export default useAuthStore;
