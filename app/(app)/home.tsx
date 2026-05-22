import { useTranslation } from "@/src/i18n/useTranslation";
import { useThemeStore } from "@/src/store/theme.store";
import { Fonts } from "@/src/theme/fonts";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CategoryRow } from "../../src/components/ui/CategoryRow";
import { useCategories } from "../../src/hooks/useProducts";
import { darkColors, lightColors } from "../../src/theme/colors";
export default function Home() {
  const [search, setSearch] = useState("");
  const dark = useThemeStore((s) => s.dark);
  const colors = dark ? darkColors : lightColors;
  const { t } = useTranslation();
  const { data: categories, isLoading } = useCategories();
 const style = styles(colors); 
  const filtered = search.trim()
    ? categories?.filter((c) => c.toLowerCase().includes(search.toLowerCase()))
    : categories;

  return (
    <View style={[style.root, { backgroundColor: colors.background }]}>
      <View style={[style.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <View style={style.titleRow}>
          <View>
            
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Text style={[style.title, { color: colors.text }]}>{t("home.discover")}</Text>
          
            </View>
          </View>
         
        </View>

        <View style={[style.searchWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Image
      source={require("@/assets/icons/search.png")}
      style={[style.icon, { tintColor: colors.textMuted }]}
    />
          <TextInput
            placeholder={t("home.searchPlaceholder")}
            placeholderTextColor={colors.placeholder}
            value={search}
            onChangeText={setSearch}
            style={[style.searchInput, { color: colors.text }]}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Text style={{ fontSize: 14, color: colors.textMuted }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

     
      {isLoading ? (
        <View style={style.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={style.scroll}>

          {search.trim() && (
            <Text style={[style.resultCount, { color: colors.textMuted }]}>
              {filtered?.length} result{filtered?.length !== 1 ? "s" : ""} for "{search}"
            </Text>
          )}

        {filtered?.map((category) => (
  <CategoryRow
    key={category}
    category={category}
    onPressSeeAll={(cat) => {
      router.push({
        pathname: "/(app)/products/category",
        params: { category: cat },
      });
    }}
    onPressProduct={(product) =>
      console.log("Producttt:", product.id)
    }
  />
))}

         {filtered?.length === 0 && (
  <View style={style.empty}>
   <Image
              source={require("@/assets/icons/search.png")}
              style={[style.icon, { tintColor: colors.textMuted }]}
            />
    <Text style={[style.emptyTitle, { color: colors.text }]}>
      {t("home.noResults")}
    </Text>
    <Text style={[style.emptySub, { color: colors.textMuted }]}>
      {t("home.noResultsSub")}
    </Text>
  </View>
)}

        </ScrollView>
      )}
    </View>
  );
}

const styles = (colors: typeof lightColors) => StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    gap: 16,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sub: { fontSize: 13, fontFamily: Fonts.brand, marginBottom: 2, color: colors.textMuted },
  title: { fontSize: 30, fontFamily: Fonts.brandExtraBold, letterSpacing: -0.5, color: colors.text },
  titleDot: { width: 8, height: 8, borderRadius: 4, marginBottom: 2, backgroundColor: colors.primary },
  avatar: {
    width: 42, height: 42, borderRadius: 21,
    justifyContent: "center", alignItems: "center",
    backgroundColor: colors.primary,
  },
  avatarText: { color: colors.background, fontFamily: Fonts.brandExtraBold, fontSize: 16 },
  searchWrapper: {
    flexDirection: "row", alignItems: "center", gap: 10,
    borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, height: 48,
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  searchInput: { flex: 1, fontSize: 15, height: "100%", color: colors.text },
  scroll: { paddingBottom: 40, paddingTop: 12, backgroundColor: colors.background },
  resultCount: { fontSize: 13, paddingHorizontal: 16, marginBottom: 12, color: colors.textMuted },
  loader: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background },
  empty: { alignItems: "center", paddingTop: 60, gap: 8 },
  emptyTitle: { fontSize: 18, fontFamily: Fonts.brandBold, color: colors.text },
  emptySub: { fontSize: 14, color: colors.textMuted },
  icon: { width: 18, height: 18, resizeMode: "contain" },
});