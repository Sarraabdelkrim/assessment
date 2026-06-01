import { router } from "expo-router";
import { useEffect } from "react";
import { Alert, Image, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { useAuthStore } from "../src/store/auth/auth.store";
import { useThemeStore } from "../src/store/theme.store";
import { darkColors, lightColors } from "../src/theme/colors";

import { DeviceSecurity } from "@/src/security/device.security";

export default function Splash() {
  const {
    token,
    sessionStart,
    isBlocked,
    blockedUntil,
    logout,
  } = useAuthStore();

  const dark = useThemeStore((s) => s.dark);
  const colors = dark ? darkColors : lightColors;

  const SESSION_TIMEOUT = 1 * 60 * 1000;

  useEffect(() => {
  const timer = setTimeout(async () => {
    try {
      // vérifier si le device est autorisé à utiliser l’application
      DeviceSecurity.assertRealDevice();
    } catch (e) {
      Alert.alert(
        "Security Alert",
        "This device is not allowed to run this application."
      );

      // rediriger vers login si device non valide
      router.replace("/(auth)/login");
      return;
    }

    // vérifier si le compte est bloqué à cause des tentatives de login
    if (isBlocked && blockedUntil && Date.now() < blockedUntil) {
      Alert.alert(
        "Account Blocked",
        "Too many login attempts. Please try again later."
      );

      // redirection vers login si utilisateur bloqué
      router.replace("/(auth)/login");
      return;
    }

    // vérifier si la session a expiré
    if (token && sessionStart) {
      const isExpired =
        Date.now() - sessionStart > SESSION_TIMEOUT;

      if (isExpired) {
        await logout();

        Alert.alert(
          "Session Expired",
          "Please login again."
        );

        // redirection après expiration de session
        router.replace("/(auth)/login");
        return;
      }
    }

    // navigation principale selon l’état de connexion
    if (token) {
      router.replace("/(app)/home");
    } else {
      router.replace("/(auth)/login");
    }
  }, 2000);

  return () => clearTimeout(timer);
}, [token, isBlocked, blockedUntil, sessionStart]);
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      <View style={styles.glow} />

      <Animated.View
        entering={FadeInDown.duration(600)}
        style={styles.logoContainer}
      >
        <Image
          source={require("../assets/images/wolt-logo.png")}
          style={styles.logo}
        />
      </Animated.View>

      <Animated.Text
        entering={FadeInDown.delay(200)}
        style={[styles.title, { color: colors.text }]}
      >
        Welcome
      </Animated.Text>

    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  glow: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    opacity: 0.15,
    top: "30%",
    backgroundColor: "#6c5ce7",
  },

  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  logo: {
    width: 170,
    height: 70,
    resizeMode: "contain",
  },

  title: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 10,
  },
});