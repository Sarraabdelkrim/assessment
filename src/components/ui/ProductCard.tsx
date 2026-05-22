import { useThemeStore } from "@/src/store/theme.store";
import { darkColors, lightColors } from "@/src/theme/colors";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "./Text";

type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  category: string;
};

type Props = {
  item: Product;
  onPress?: (item: Product) => void;
  width?: number;
  imageHeight?: number;
};

export function ProductCard({ item, onPress, width = 155, imageHeight = 125 }: Props) {
  const dark = useThemeStore((s) => s.dark);
  const colors = dark ? darkColors : lightColors;

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={() => onPress?.(item)}
      style={[
        styles.card,
        {
          width,
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <Image
        source={{ uri: item.thumbnail }}
        style={[styles.image, { width, height: imageHeight }]}
        resizeMode="cover"
      />

      <View style={[styles.badge, { backgroundColor: colors.primary }]}>
        <Text size={12} weight="800" color="#fff">
          ${item.price}
        </Text>
      </View>

      <View style={styles.body}>
      
        <Text numberOfLines={1} weight="700" size={13}>
          {item.title}
        </Text>

        <View style={styles.footer}>
          <View style={[styles.dot, { backgroundColor: colors.primary }]} />
          <Text size={11} color={colors.textMuted} style={styles.category}>
            {item.category}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
  },
  image: {
    borderRadius: 0,
  },
  badge: {
    position: "absolute",
    top: 10,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  body: {
    padding: 10,
    gap: 4,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  category: {
    textTransform: "capitalize",
  },
});