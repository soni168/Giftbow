import { create } from "zustand";

const useThemeStore = create((set) => ({
  isDark: false,

  toggleTheme: () =>
    set((state) => {
      const newTheme = !state.isDark;
      if (newTheme) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return { isDark: newTheme };
    }),

  initTheme: () => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      set({ isDark: true });
    }
  },
}));

export default useThemeStore;