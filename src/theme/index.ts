import { useThemeStore } from "../store/theme.store";
import { darkColors, lightColors } from "./colors";

export const useAppTheme = () => {
  const dark = useThemeStore((s) => s.dark);

  return dark ? darkColors : lightColors;
};