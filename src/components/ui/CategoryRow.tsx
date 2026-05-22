import { useTranslation } from "@/src/i18n/useTranslation";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useProductsByCategory } from "../../hooks/useProducts";
import { useThemeStore } from "../../store/theme.store";
import { darkColors, lightColors } from "../../theme/colors";
import { ProductCard } from "./ProductCard";
import { SkeletonCard } from "./SkeletonCard";

type Props = {
  category: string;
  onPressSeeAll?: (category: string) => void;
  onPressProduct?: (product: any) => void;
  cardWidth?: number;
  cardImageHeight?: number;
};

export function CategoryRow({
  category,
  onPressSeeAll,
  onPressProduct,
  cardWidth,
  cardImageHeight,
}: Props) {
  const dark = useThemeStore((s) => s.dark);
  const colors = dark ? darkColors : lightColors;
const { t } = useTranslation();
  const { data, isLoading } = useProductsByCategory(category);

  return (
    <View style={styles.wrapper}>

   
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={[styles.accent, { backgroundColor: colors.primary }]} />
          <Text style={[styles.title, { color: colors.text }]}>{category}</Text>
        </View>
        <TouchableOpacity
          onPress={() => onPressSeeAll?.(category)}
          style={[styles.seeAllBtn, { borderColor: colors.primary }]}
        >
          <Text style={[styles.seeAllText, { color: colors.primary }]}> {t("home.seeAll")} </Text>
        </TouchableOpacity>
      </View>

  
      {isLoading ? (
        <FlatList
          data={[1, 2, 3]}
          keyExtractor={(i) => i.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={() => (
            <SkeletonCard width={cardWidth} imageHeight={cardImageHeight} />
          )}
        />
      ) : !data || data.length === 0 ? null : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ProductCard
              item={item}
              onPress={onPressProduct}
              width={cardWidth}
              imageHeight={cardImageHeight}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 32,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  accent: {
    width: 4,
    height: 20,
    borderRadius: 2,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  seeAllBtn: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: "600",
  },
  list: {
    paddingHorizontal: 16,
    gap: 12,
  },
});