import { create } from "zustand";

export type Lang = "fr" | "en";

type LangState = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
};

export const useLangStore = create<LangState>((set, get) => ({
  lang: "fr",

  setLang: (lang) => set({ lang }),

  toggleLang: () =>
    set({
      lang: get().lang === "fr" ? "en" : "fr",
    }),
}));