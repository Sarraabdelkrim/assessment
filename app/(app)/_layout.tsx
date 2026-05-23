import { useMemo } from "react";
import { Text, View } from "react-native";

import { useCartStore } from "@/src/store/cart/cart.store";
import { useThemeStore } from "@/src/store/theme.store";
import { darkColors, lightColors } from "@/src/theme/colors";

import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  const dark = useThemeStore((s) => s.dark);
  const colors = dark ? darkColors : lightColors;

  const totalItems = useCartStore((s) =>
    s.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  const tabKey = dark ? "dark" : "light";

  const tabBarStyle = useMemo(
    () => ({
      backgroundColor: colors.card,
      borderTopColor: colors.border,
    }),
    [colors.card, colors.border]
  );

  return (
    <Tabs
      key={tabKey}
      screenOptions={{
        headerShown: false,

        tabBarStyle,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
    
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />


      <Tabs.Screen
        name="products"
        options={{
          title: "Products",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="shopping-bag" color={color} size={size} />
          ),
        }}
      />

     
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, size }) => (
            <View style={{ width: 24, height: 24 }}>
              <Ionicons name="cart" color={color} size={size} />

              {totalItems > 0 && (
                <View
                  style={{
                    position: "absolute",
                    top: -6,
                    right: -10,
                    backgroundColor: "red",
                    minWidth: 16,
                    height: 16,
                    borderRadius: 8,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 4,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 10,
                      fontWeight: "bold",
                    }}
                  >
                    {totalItems}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}