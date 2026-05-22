import { getProductsByCategory } from "@/src/api/product.api";
import { useTranslation } from "@/src/i18n/useTranslation";
import { useThemeStore } from "@/src/store/theme.store";
import { darkColors, lightColors } from "@/src/theme/colors";
import { Fonts } from "@/src/theme/fonts";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function CategoryScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();

  const dark = useThemeStore((s) => s.dark);
  const colors = dark ? darkColors : lightColors;
  const { t } = useTranslation();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      if (!category) return;

      try {
        setLoading(true);
        const data = await getProductsByCategory(category);
        setProducts(data);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const title =
    typeof category === "string"
      ? category.charAt(0).toUpperCase() + category.slice(1)
      : "";

  if (loading) {
    return (
      <View style={styles(colors).loader}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>

     
      <Stack.Screen
        options={{
          title: "",
        }}
      />

      
      <View style={styles(colors).header}>
        <Text style={[styles(colors).title, { color: colors.text }]}>
          {title}
        </Text>

        <View
          style={[
            styles(colors).searchWrapper,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Image
            source={require("@/assets/icons/search.png")}
            style={[styles(colors).icon, { tintColor: colors.textMuted }]}
          />

          <TextInput
            placeholder={t("home.searchPlaceholder")}
            placeholderTextColor={colors.placeholder}
            value={search}
            onChangeText={setSearch}
            style={[styles(colors).searchInput, { color: colors.text }]}
          />

          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Text style={{ fontSize: 14, color: colors.textMuted }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

  
      {filtered.length === 0 ? (
        <View style={styles(colors).empty}>
          <Text style={{ color: colors.textMuted }}>
            {t("home.noProductsFound")}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles(colors).list}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/(app)/products/${item.id}`)}
              style={[
                styles(colors).card,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <Image
                source={{ uri: item.thumbnail }}
                style={styles(colors).image}
              />

              <View style={styles(colors).info}>
                <Text
                  numberOfLines={1}
                  style={[styles(colors).name, { color: colors.text }]}
                >
                  {item.title}
                </Text>

                <Text
                  style={[
                    styles(colors).category,
                    { color: colors.textMuted },
                  ]}
                >
                  {item.category}
                </Text>

                <View
                  style={[
                    styles(colors).priceBadge,
                    { backgroundColor: colors.primary },
                  ]}
                >
                  <Text style={styles(colors).priceText}>
                    ${item.price}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = (colors: typeof lightColors) =>
  StyleSheet.create({
    loader: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },

    header: {
      paddingHorizontal: 16,
      //paddingTop: 20,
      paddingBottom: 12,
      gap: 10,
    },

    title: {
      fontSize: 24,
      fontFamily: Fonts.brandBold,
    },

    searchWrapper: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      borderWidth: 1,
      borderRadius: 14,
      paddingHorizontal: 14,
      height: 48,
    },

    searchInput: {
      flex: 1,
      fontSize: 15,
      height: "100%",
    },

    list: {
      padding: 16,
      gap: 12,
    },

    card: {
      flexDirection: "row",
      borderRadius: 16,
      borderWidth: 1,
      overflow: "hidden",
    },

    image: {
      width: 90,
      height: 90,
    },

    info: {
      flex: 1,
      padding: 12,
      gap: 4,
    },

    name: {
      fontSize: 14,
      fontFamily: Fonts.brandBold,
    },

    category: {
      fontSize: 12,
      textTransform: "capitalize",
    },

    priceBadge: {
      marginTop: 6,
      alignSelf: "flex-start",
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 20,
    },

    priceText: {
      color: "colors.background",
      fontSize: 11,
      fontFamily: Fonts.brandBold,
    },

    empty: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },

    icon: {
      width: 18,
      height: 18,
      resizeMode: "contain",
    },
  });