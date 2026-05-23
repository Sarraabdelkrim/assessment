import { useTranslation } from "@/src/i18n/useTranslation";
import { useThemeStore } from "@/src/store/theme.store";
import { darkColors, lightColors } from "@/src/theme/colors";
import { Fonts } from "@/src/theme/fonts";
import { Ionicons } from "@expo/vector-icons";
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type Props = {
  item: any;
  onDelete: (id: number) => void;
  onUpdateQuantity: (
    id: number,
    quantity: number
  ) => void;
};

export default function CartItem({
  item,
  onDelete,
  onUpdateQuantity,
}: Props) {
  const dark = useThemeStore((s) => s.dark);
  const colors = dark ? darkColors : lightColors;

  const { t } = useTranslation();

  const total =
    item.product.price * item.quantity;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <Image
        source={{
          uri: item.product.thumbnail,
        }}
        style={styles.image}
      />

      <View style={styles.content}>
        <Text
          numberOfLines={1}
          style={[
            styles.title,
            {
              color: colors.text,
            },
          ]}
        >
          {item.product.title}
        </Text>

        <Text
          style={[
            styles.category,
            {
              color: colors.textMuted,
            },
          ]}
        >
          {item.product.category}
        </Text>

        <View style={styles.priceRow}>
          <View
            style={[
              styles.priceBadge,
              {
                backgroundColor: colors.primary,
              },
            ]}
          >
            <Text
              style={[
                styles.price,
                {
                  color: colors.background,
                },
              ]}
            >
              ${total.toFixed(2)}
            </Text>
          </View>

          {item.quantity > 1 && (
            <Text
              style={[
                styles.unitPrice,
                {
                  color: colors.textMuted,
                },
              ]}
            >
              ${item.product.price.toFixed(2)}{" "}
              {t("cart.eachUnit")}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              borderColor: colors.border,
              backgroundColor: colors.surface,
            },
          ]}
          onPress={() =>
            onUpdateQuantity(
              item.product.id,
              item.quantity + 1
            )
          }
        >
          <Ionicons
            name="add"
            size={18}
            color={colors.text}
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.quantity,
            {
              color: colors.text,
            },
          ]}
        >
          {item.quantity}
        </Text>

        <TouchableOpacity
          style={[
            styles.button,
            {
              borderColor: colors.border,
              backgroundColor: colors.surface,
            },
          ]}
          onPress={() =>
            onUpdateQuantity(
              item.product.id,
              item.quantity - 1
            )
          }
        >
          <Ionicons
            name="remove"
            size={18}
            color={colors.text}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() =>
            onDelete(item.product.id)
          }
        >
          <Ionicons
            name="trash-outline"
            size={18}
            color={colors.error}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 18,
    overflow: "hidden",
    alignItems: "center",
  },

  image: {
    width: 95,
    height: 95,
  },

  content: {
    flex: 1,
    padding: 12,
    gap: 6,
  },

  title: {
    fontSize: 14,
    fontFamily: Fonts.brandBold,
  },

  category: {
    fontSize: 12,
    textTransform: "capitalize",
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  priceBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },

  price: {
    fontSize: 13,
    fontFamily: Fonts.brandBold,
  },

  unitPrice: {
    fontSize: 11,
  },

  actions: {
    alignItems: "center",
    gap: 6,
    paddingRight: 12,
  },

  button: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  quantity: {
    fontSize: 15,
    fontFamily: Fonts.brandBold,
  },

  deleteButton: {
    marginTop: 2,
  },
});