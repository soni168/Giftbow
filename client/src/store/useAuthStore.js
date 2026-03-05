import { create } from "zustand";
import axios from "axios";

const API = "/api";

const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  signup: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.post(
        `${API}/auth/signup`,
        { name, email, password },
        { withCredentials: true }
      );
      set({ user: data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message, loading: false });
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.post(
        `${API}/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      set({ user: data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message, loading: false });
    }
  },

  logout: async () => {
    await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
    set({ user: null });
  },

  getMe: async () => {
    try {
      const { data } = await axios.get(`${API}/auth/me`, {
        withCredentials: true,
      });
      set({ user: data });
    } catch {
      set({ user: null });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;