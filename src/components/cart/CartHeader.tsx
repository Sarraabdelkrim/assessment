import { useTranslation } from "@/src/i18n/useTranslation";
import { useThemeStore } from "@/src/store/theme.store";
import { darkColors, lightColors } from "@/src/theme/colors";
import { Fonts } from "@/src/theme/fonts";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  totalItems: number;
  onClear: () => void;
};

export default function CartHeader({
  totalItems,
  onClear,
}: Props) {
  const dark = useThemeStore((s) => s.dark);
  const colors = dark ? darkColors : lightColors;

  const { t } = useTranslation();

  const itemLabel =
    totalItems > 1
      ? t("cart.itemsPlural")
      : t("cart.items");

  return (
    <View
      style={[
        styles.container,
        {
          borderBottomColor: colors.border,
        },
      ]}
    >
      <Text
        style={[
          styles.items,
          {
            color: colors.textMuted,
          },
        ]}
      >
        {totalItems} {itemLabel}
      </Text>

      <TouchableOpacity onPress={onClear}>
        <Text
          style={[
            styles.clear,
            {
              color: colors.error ,
            },
          ]}
        >
          {t("cart.clearAll")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  items: {
    fontSize: 14,
    fontFamily: Fonts.brandBold,
  },

  clear: {
    fontSize: 14,
    fontFamily: Fonts.brandBold,
  },
});