import { useAuthStore } from "@/src/store/auth/auth.store";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (token) {
      router.replace("/(app)/home");
    } else {
      router.replace("/(auth)/login");
    }
  }, [token]);

  return null;
}