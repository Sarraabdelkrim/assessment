import { useTranslation } from "@/src/i18n/useTranslation";
import { useThemeStore } from "@/src/store/theme.store";
import { darkColors, lightColors } from "@/src/theme/colors";
import { Fonts } from "@/src/theme/fonts";
import { Ionicons } from "@expo/vector-icons";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type Props = {
  totalItems: number;
  totalPrice: number;
  loading: boolean;
  onCheckout: () => void;
};

export default function CartFooter({
  totalItems,
  totalPrice,
  loading,
  onCheckout,
}: Props) {
  const dark = useThemeStore((s) => s.dark);

  const colors = dark
    ? darkColors
    : lightColors;

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
          backgroundColor:
            colors.background,
          borderTopColor:
            colors.border,
        },
      ]}
    >
      <View
        style={[
          styles.summaryContainer,
          {
            backgroundColor:
              colors.surface,
            borderColor:
              colors.border,
          },
        ]}
      >
        <View style={styles.row}>
          <Text
            style={[
              styles.label,
              {
                color:
                  colors.textMuted,
              },
            ]}
          >
            {t("cart.subtotal")}
          </Text>

          <Text
            style={[
              styles.value,
              {
                color: colors.text,
              },
            ]}
          >
            ${totalPrice.toFixed(2)}
          </Text>
        </View>

        <View
          style={[
            styles.divider,
            {
              backgroundColor:
                colors.border,
            },
          ]}
        />

        <View style={styles.row}>
          <Text
            style={[
              styles.label,
              {
                color:
                  colors.textMuted,
              },
            ]}
          >
            {totalItems} {itemLabel}
          </Text>

          <Text
            style={[
              styles.value,
              {
                color: colors.text,
              },
            ]}
          >
            {totalItems}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        disabled={loading}
        onPress={onCheckout}
        style={[
          styles.checkoutButton,
          {
            backgroundColor:
              colors.primary,
            opacity: loading
              ? 0.7
              : 1,
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator
            color={colors.background}
          />
        ) : (
          <>
            <Ionicons
              name="card-outline"
              size={20}
              color={
                colors.background
              }
            />

            <Text
              style={[
                styles.checkoutText,
                {
                  color:
                    colors.background,
                },
              ]}
            >
              {t("cart.checkout")} — $
              {totalPrice.toFixed(2)}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 14,
    borderTopWidth: 1,
  },

  summaryContainer: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
  },

  label: {
    fontSize: 14,
  },

  value: {
    fontSize: 15,
    fontFamily: Fonts.brandBold,
  },

  divider: {
    height: 1,
  },

  checkoutButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },

  checkoutText: {
    fontSize: 16,
    fontFamily: Fonts.brandBold,
  },
});