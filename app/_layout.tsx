import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import { QueryClientProvider } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

import { queryClient } from "@/src/lib/queryClient";
import { useAuthStore } from "@/src/store/auth/auth.store";

export default function RootLayout() {
  const { hydrate, isHydrated } = useAuthStore();

  const [ready, setReady] = useState(false);

  // charger auth store
  useEffect(() => {
    const init = async () => {
      await hydrate();
      setReady(true);
    };

    init();
  }, []);

  // loading global
  if (!ready || !isHydrated) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }} />
      <Toast />
    </QueryClientProvider>
  );
}