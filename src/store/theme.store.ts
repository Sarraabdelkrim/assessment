import { create } from "zustand";

type ThemeState = {
  dark: boolean;
  toggleDark: () => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
  dark: false,
  toggleDark: () => set((s) => ({ dark: !s.dark })),
}));