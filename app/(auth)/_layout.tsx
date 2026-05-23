import { useAuthStore } from "@/src/store/auth/auth.store";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
export default function AuthLayout() {
  const { token, hydrate, isHydrated } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    hydrate();
  }, []);

 useEffect(() => {
  if (!isHydrated) return;

  const inAuthGroup = segments[0] === "(auth)";

  if (!token && !inAuthGroup) {
    router.replace("/(auth)/login");
  }
}, [token, isHydrated, segments]);
  return <Stack screenOptions={{ headerShown: false }} />;

}