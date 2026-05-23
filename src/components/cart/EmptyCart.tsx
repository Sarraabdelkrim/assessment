import { useTranslation } from "@/src/i18n/useTranslation";
import { useThemeStore } from "@/src/store/theme.store";
import { darkColors, lightColors } from "@/src/theme/colors";
import { Fonts } from "@/src/theme/fonts";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function EmptyCart() {
  const dark = useThemeStore((s) => s.dark);

  const colors = dark
    ? darkColors
    : lightColors;

  const { t } = useTranslation();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            colors.background,
        },
      ]}
    >
      <View
        style={[
          styles.iconWrapper,
          {
            backgroundColor:
              colors.surface,
          },
        ]}
      >
        <Ionicons
          name="cart-outline"
          size={52}
          color={colors.primary}
        />
      </View>

      <Text
        style={[
          styles.title,
          {
            color: colors.text,
          },
        ]}
      >
        {t("cart.empty")}
      </Text>

      <Text
        style={[
          styles.subtitle,
          {
            color: colors.textMuted,
          },
        ]}
      >
        {t("cart.emptySubtitle")}
      </Text>

      <TouchableOpacity
        onPress={() =>
          router.push("/(app)/products")
        }
        style={[
          styles.button,
          {
            backgroundColor:
              colors.primary,
          },
        ]}
      >
        <Ionicons
          name="storefront-outline"
          size={20}
          color={colors.background}
        />

        <Text
          style={[
            styles.buttonText,
            {
              color:
                colors.background,
            },
          ]}
        >
          {t("cart.browse")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  iconWrapper: {
    width: 110,
    height: 110,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 22,
    fontFamily: Fonts.brandBold,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 26,
  },

  button: {
    height: 54,
    borderRadius: 16,
    paddingHorizontal: 26,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  buttonText: {
    fontSize: 15,
    fontFamily: Fonts.brandBold,
  },
});