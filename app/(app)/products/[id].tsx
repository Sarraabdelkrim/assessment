import { useProduct } from "@/src/hooks/useProducts";
import { useTranslation } from "@/src/i18n/useTranslation";
import { useThemeStore } from "@/src/store/theme.store";
import { darkColors, lightColors } from "@/src/theme/colors";
import { Fonts } from "@/src/theme/fonts";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dark = useThemeStore((s) => s.dark);
  const colors = dark ? darkColors : lightColors;
  const { t } = useTranslation();

  const { data: product, isLoading } = useProduct(Number(id));
 const style = styles(colors); 

  if (isLoading) {
    return (
      <View style={[style.loader, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

   

  return (
    <ScrollView style={{ backgroundColor: colors.background }} showsVerticalScrollIndicator={false}>

    
      <View>
        <Image source={{ uri: product.thumbnail }} style={style.image} resizeMode="cover" />
        <TouchableOpacity
          onPress={() => router.back()}
          style={[style.backBtn, { backgroundColor: colors.background }]}
        >
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>

        
        <View style={[style.priceBadge, { backgroundColor: colors.primary }]}>
          <Text style={style.priceText}>${product.price}</Text>
        </View>
      </View>

      <View style={[style.content, { backgroundColor: colors.background }]}>

       
        <View style={style.row}>
          <View style={[style.categoryBadge, { backgroundColor: colors.surface }]}>
            <Text style={[style.categoryText, { color: colors.textMuted }]}>
              {product.category}
            </Text>
          </View>
          <View style={[style.ratingBadge, { backgroundColor: colors.surface }]}>
            <Ionicons name="star" size={12} color={colors.primary} />
            <Text style={[style.ratingText, { color: colors.text }]}>
              {product.rating}
            </Text>
          </View>
        </View>

        <Text style={[style.title, { color: colors.text }]}>{product.title}</Text>
        <Text style={[style.description, { color: colors.textSecondary }]}>
          {product.description}
        </Text>

     
        <View style={[style.statsRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={style.stat}>
            <Text style={[style.statValue, { color: colors.primary }]}>{product.stock}</Text>
            <Text style={[style.statLabel, { color: colors.textMuted }]}>In stock</Text>
          </View>
          <View style={[style.divider, { backgroundColor: colors.border }]} />
          <View style={style.stat}>
            <Text style={[style.statValue, { color: colors.primary }]}>{product.discountPercentage}%</Text>
            <Text style={[style.statLabel, { color: colors.textMuted }]}>Discount</Text>
          </View>
          <View style={[style.divider, { backgroundColor: colors.border }]} />
          <View style={style.stat}>
            <Text style={[style.statValue, { color: colors.primary }]}>{product.rating}</Text>
            <Text style={[style.statLabel, { color: colors.textMuted }]}>Rating</Text>
          </View>
        </View>

       
        <TouchableOpacity
          onPress={() => router.push(`/(app)/products/edit/${product.id}`)}
          style={[style.editBtn, { backgroundColor: colors.primary }]}
        >
          <Ionicons name="pencil" size={18} color="#fff" />
          <Text style={style.editBtnText}>{t("editProduct.editButton")}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = (colors: typeof lightColors) => StyleSheet.create({
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  image: { width: "100%", height: 300 },
  backBtn: {
    position: "absolute",
    top: 50,
    left: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
  priceBadge: {
    position: "absolute",
    bottom: 16,
    right: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  priceText: { color:colors.background, fontFamily: Fonts.brandBold, fontSize: 16 },
  content: { padding: 20, gap: 12 },
  row: { flexDirection: "row", gap: 8 },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  categoryText: { fontSize: 12, textTransform: "capitalize" },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  ratingText: { fontSize: 12, fontFamily: Fonts.brandSemiBold },
  title: { fontSize: 22, fontFamily: "800", letterSpacing: -0.3 },
  description: { fontSize: 14, lineHeight: 22 },
  statsRow: {
    flexDirection: "row",
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginTop: 8,
  },
  stat: { flex: 1, alignItems: "center", gap: 4 },
  statValue: { fontSize: 18, fontFamily: "800" },
  statLabel: { fontSize: 11 },
  divider: { width: 1, marginVertical: 4 },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 52,
    borderRadius: 14,
    marginTop: 8,
  },
  editBtnText: { color: colors.background, fontFamily: "700", fontSize: 16 },
});