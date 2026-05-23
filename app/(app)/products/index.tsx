import { getProductsByCategory } from "@/src/api/product.api";
import { useTranslation } from "@/src/i18n/useTranslation";
import { useCartStore } from "@/src/store/cart/cart.store";
import { useThemeStore } from "@/src/store/theme.store";
import { darkColors, lightColors } from "@/src/theme/colors";
import { Fonts } from "@/src/theme/fonts";
import type { Product } from "@/src/types/product.types";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
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

export default function ProductsScreen() {
  const dark = useThemeStore((s) => s.dark);
  const colors = dark ? darkColors : lightColors;

  const { category } = useLocalSearchParams<{ category: string }>();

  const addItem = useCartStore((s) => s.addItem);
  const totalItems = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0)
  );

  const { t } = useTranslation();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const style = useMemo(() => createStyles(colors), [colors]);


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

 
  const filtered = useMemo(() => {
    return products.filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  const handleAdd = (product: Product) => {
    addItem(product);
  };

  if (loading) {
    return (
      <View style={style.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    
    <View style={style.container}>
  <Stack.Screen options={{ headerShown: false }} />
      <View style={style.header}>
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
        <TouchableOpacity
          onPress={() => router.push("/(app)/cart")}
          style={style.cartBtn}
        >
          <Ionicons name="cart" size={20} color={colors.background} />

          {totalItems > 0 && (
            <View style={style.cartBadge}>
              <Text style={style.cartBadgeText}>{totalItems}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      
    <FlatList
  data={filtered}
  keyExtractor={(item) => String(item.id)}
  renderItem={({ item }) => (
    
    <TouchableOpacity
      onPress={() => router.push(`/(app)/products/${item.id}`)}
      activeOpacity={0.8}
      style={[
        style.listItem,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >

      <Image
        source={{ uri: item.thumbnail }}
        style={style.productImage}
      />

   
      <View style={style.content}>
        <Text style={style.title}>{item.title}</Text>

        <Text style={style.price}>${item.price}</Text>

    
        <TouchableOpacity
          onPress={() => handleAdd(item)}
          style={style.addBtn}
        >
          <Image
            source={{ uri: item.thumbnail }}
            style={style.miniImage}
          />

          <Text numberOfLines={1} style={style.addTitle}>
            {item.title}
          </Text>

          <Text style={style.addText}>
            {t("cart.add")}
          </Text>
        </TouchableOpacity>
      </View>

    </TouchableOpacity>
  )}
/>
    </View>
  );
}


const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    header: {
      flexDirection: "row",
      padding: 16,
      gap: 10,
      paddingTop: 40,
      alignItems: "center",
    },

    searchIcon: {
      width: 20,
      height: 20,
      resizeMode: "contain",
    },



    clearBtn: {
      fontSize: 14,
      color: colors.textMuted,
      paddingHorizontal: 6,
    },

    cartBtn: {
      width: 45,
      height: 45,
      backgroundColor: colors.primary,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
    },

    cartBadge: {
      position: "absolute",
      top: -4,
      right: -4,
      backgroundColor: "red",
      width: 18,
      height: 18,
      borderRadius: 9,
      justifyContent: "center",
      alignItems: "center",
    },

    cartBadgeText: {
      color: colors.background,
      fontSize: 10,
      fontWeight: "bold",
    },

    listItem: {
      flexDirection: "row",
      margin: 10,
      padding: 10,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      backgroundColor: colors.card,
    },

    productImage: {
      width: 80,
      height: 80,
      borderRadius: 10,
    },

    content: {
      flex: 1,
      marginLeft: 10,
    },

    title: {
      color: colors.text,
      fontSize: 14,
      fontFamily: Fonts.brandBold,
    },

    price: {
      color: colors.textMuted,
      marginTop: 4,
    },

    addBtn: {
      marginTop: 8,
      backgroundColor: colors.surface,
      padding: 10,
      borderRadius: 10,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },

    miniImage: {
      width: 35,
      height: 35,
      borderRadius: 8,
    },

    addText: {
      color: colors.primary,
      fontSize: 11,
      fontFamily: Fonts.brandBold,
    },

    addTitle: {
      flex: 1,
      color: colors.text,
      fontSize: 12,
      fontFamily: Fonts.brandBold,
    },

    loader: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
   
    icon: { width: 18, height: 18, resizeMode: "contain" },
    headerRow: {
  flexDirection: "row",
  alignItems: "center",
  padding: 16,
  gap: 10,
},

searchWrapper: {
  flex: 1,            
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: colors.surface,
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: 12,
  paddingHorizontal: 12,
  height: 45,
  gap: 8,
},

searchInput: {
  flex: 1,            
  fontSize: 14,
  color: colors.text,
},


  });