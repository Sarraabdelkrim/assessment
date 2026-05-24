import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

import { QueryClientProvider } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

import { queryClient } from "@/src/lib/queryClient";
import { useAuthStore } from "@/src/store/auth/auth.store";

import { useThemeStore } from "@/src/store/theme.store";
import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
} from "@expo-google-fonts/nunito";
import { darkColors, lightColors } from "@/src/theme/colors";

export default function RootLayout() {
  
   const dark = useThemeStore((s) => s.dark);
    const colors = dark ? darkColors : lightColors;
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
  });

  const {
    token,
    hydrate,
    isHydrated,
    checkSession,
  } = useAuthStore();

  const router = useRouter();
  const segments = useSegments();


  useEffect(() => {
    hydrate();
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      checkSession();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  
  useEffect(() => {
    if (!isHydrated || !fontsLoaded) return;

    const inAuth = segments[0] === "(auth)";

    if (!token && !inAuth) {
      router.replace("/(auth)/login");
    }
  }, [token, isHydrated, fontsLoaded, segments]);

 
  if (!fontsLoaded || !isHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
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