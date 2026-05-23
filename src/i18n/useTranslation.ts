import { useLangStore } from "../store/lang.store";
import en from "./en.json";
import fr from "./fr.json";

type Leaves<T, Prefix extends string = ""> = {
  [K in keyof T]: T[K] extends Record<string, unknown>
    ? Leaves<T[K], `${Prefix}${K & string}.`>
    : `${Prefix}${K & string}`;
}[keyof T];

type TranslationKey = Leaves<typeof fr>;

export const useTranslation = () => {
  const lang = useLangStore((s) => s.lang);
  const dict = lang === "fr" ? fr : en;

const t = (key: string): string => {
    return key.split(".").reduce((obj: any, k) => obj?.[k], dict) ?? key;
  };

  return { t };
};