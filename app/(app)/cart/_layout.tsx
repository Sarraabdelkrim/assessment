import { useTranslation } from "@/src/i18n/useTranslation";
import { useCartStore } from "@/src/store/cart/cart.store";
import { useThemeStore } from "@/src/store/theme.store";
import { darkColors, lightColors } from "@/src/theme/colors";
import { Fonts } from "@/src/theme/fonts";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { useMemo } from "react";
import { Text, View } from "react-native";

export default function CartLayout() {
  const dark = useThemeStore((s) => s.dark);
  const colors = dark ? darkColors : lightColors;
  const { t } = useTranslation();

  const items = useCartStore((s) => s.items);

  const totalItems = useMemo(() => {
    return items.reduce((sum, i) => sum + i.quantity, 0);
  }, [items]);

  

  const HeaderRight = useMemo(() => {
    if (totalItems === 0) return null;

    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          marginRight: 4,
        }}
      >
        <Ionicons
          name="cart-outline"
          size={20}
          color={colors.primary}
        />

        <Text
          style={{
            fontFamily: Fonts.brandBold,
            fontSize: 14,
            color: colors.primary,
          }}
        >
          {totalItems}
        </Text>
      </View>
    );
  }, [totalItems, colors.primary]);

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { fontFamily: Fonts.brandBold },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: t("cart.title"),
          headerRight: () => HeaderRight,
        }}
      />
    </Stack>
  );
}