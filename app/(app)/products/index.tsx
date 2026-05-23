import { getProducts } from "@/src/api/product.api";
import { useTranslation } from "@/src/i18n/useTranslation";
import { useCartStore } from "@/src/store/cart/cart.store";
import { useThemeStore } from "@/src/store/theme.store";
import { darkColors, lightColors } from "@/src/theme/colors";
import { Fonts } from "@/src/theme/fonts";
import type { Product } from "@/src/types/product.types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProductsScreen() {
  const dark = useThemeStore((s) => s.dark);
  const colors = dark ? darkColors : lightColors;

  const addItem = useCartStore((s) => s.addItem);
const { t } = useTranslation();
  const totalItems = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0)
  );

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getProducts({ page: 0, search: "" });
        setProducts(data);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

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
      <ActivityIndicator size="large" color={colors.primary} />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
    
      <View
        style={{
          flexDirection: "row",
          padding: 16,
          gap: 10,
          paddingTop: 40,
        }}
      >
    
        <TextInput
          placeholder="Search..."
          value={search}
          onChangeText={setSearch}
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 10,
            padding: 10,
            color: colors.text,
          }}
        />

        <TouchableOpacity
          onPress={() => router.push("/(app)/cart")}
          style={{
            width: 45,
            height: 45,
            backgroundColor: colors.primary,
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name="cart" size={20} color={colors.background} />

          {totalItems > 0 && (
            <View
              style={{
                position: "absolute",
                top: -4,
                right: -4,
                backgroundColor: "red",
                width: 18,
                height: 18,
                borderRadius: 9,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: colors.background, fontSize: 10 }}>
                {totalItems}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

     
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              margin: 10,
              padding: 10,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 12,
            }}
          >
            <Image
              source={{ uri: item.thumbnail }}
              style={{ width: 80, height: 80 }}
            />

            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={{ color: colors.text }}>
                {item.title}
              </Text>

              <Text style={{ color: colors.textMuted }}>
                ${item.price}
              </Text>

              <TouchableOpacity
            onPress={() => handleAdd(item)}
            style={{
              marginTop: 8,
              backgroundColor: colors.surface,
              padding: 10,
              borderRadius: 10,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >

            <Image
              source={{ uri: item.thumbnail }}
              style={{
                width: 35,
                height: 35,
                borderRadius: 8,
              }}
              resizeMode="cover"
            />

            
            <Text
              numberOfLines={1}
              style={{
                flex: 1,
                color: colors.text,
                fontSize: 12,
                fontFamily: Fonts.brandBold,
              }}
            >
              {item.title}
            </Text>


            <Text style={{ color: colors.primary, fontSize: 11 }}>
              {t("cart.add")}
            </Text>
          </TouchableOpacity>
                      </View>
                    </View>
                  )}
                />
              </View>
            );
          }