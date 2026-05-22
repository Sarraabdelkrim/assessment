import { useThemeStore } from "@/src/store/theme.store";
import { darkColors, lightColors } from "@/src/theme/colors";
import { Fonts } from "@/src/theme/fonts";
import { Stack } from "expo-router";

export default function ProductsLayout() {
  const dark = useThemeStore((s) => s.dark);
  const colors = dark ? darkColors : lightColors;

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { fontFamily: Fonts.brandBold },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[id]" options={{ title: "Product" }} />
      <Stack.Screen name="edit/[id]" options={{ title: "Edit Product" }} />
    </Stack>
  );
}