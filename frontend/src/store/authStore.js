import { create } from 'zustand';
import { authService } from '../services/api';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    set({ token });
  },

  register: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      await authService.register(email, password, name);
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.error || 'Registration failed'
      });
      return false;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(email, password);
      const { token, user } = response.data;
      set({
        token,
        user,
        isLoading: false,
        error: null
      });
      localStorage.setItem('token', token);
      return true;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.error || 'Login failed'
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  fetchProfile: async () => {
    set({ isLoading: true });
    try {
      const response = await authService.getProfile();
      set({ user: response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },
}));
