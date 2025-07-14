// src/store/useThemeStore.js
import { create } from 'zustand';

const useThemeStore = create((set) => ({
  theme: 'dark',
  setTheme: (theme) => set({ theme }),
  toggleTheme: () => set((state) => ({
    theme: state.theme === 'dark' ? 'light' : 'dark'
  })),
}));

// Make sure to export as default
export default useThemeStore;