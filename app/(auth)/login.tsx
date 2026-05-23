import { Text } from "@/src/components/ui/Text";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Dimensions, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { LoginForm } from "../../src/components/forms/LoginForm";
import SmoothInfiniteScroll from "../../src/components/SmoothInfiniteScroll";
import { useAuthStore } from "../../src/store/auth/auth.store";

import { useScreenshotGuard } from "@/src/auth/useScreenshotGuard";
import { useLoginBlockTimer } from "@/src/hooks/useLoginBlockTimer";
import { useSecureScreen } from "@/src/hooks/useSecureScreen";
import { useThemeStore } from "@/src/store/theme.store";
import { darkColors, lightColors } from "@/src/theme/colors";

const { height } = Dimensions.get("window");
const BG_HEIGHT = height * 0.5;

export default function LoginScreen() {
  useSecureScreen();
  useScreenshotGuard();

  const dark = useThemeStore((s) => s.dark);
  const colors = dark ? darkColors : lightColors;

  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);

  const { isActuallyBlocked, remainingTime } = useLoginBlockTimer();

  const handleLogin = async (data: any) => {
    

    try {
      if (isActuallyBlocked) {
        return;
      }

      await login({
        username: data.username,
        password: data.password,
      });

      router.replace("/(app)/home");
    } catch (e: any) {
      if (e.message === "USER_BLOCKED") {
        router.replace("/(auth)/forgot-password");
      }
    }
  };

  return (
    <View style={styles(colors).container}>
      <View style={styles(colors).bgWrapper}>
        <View style={styles(colors).columnsRow}>
          <View style={styles(colors).column}>
            <SmoothInfiniteScroll iconSet="set1" />
          </View>
          <View style={styles(colors).column}>
            <SmoothInfiniteScroll iconSet="set2" />
          </View>
          <View style={styles(colors).column}>
            <SmoothInfiniteScroll iconSet="set3" />
          </View>
        </View>

        <LinearGradient
          colors={[
            "transparent",
            colors.background + "cc",
            colors.background,
          ]}
          style={styles(colors).fade}
        />
      </View>

      {isActuallyBlocked && (
        <Text style={{ textAlign: "center", marginBottom: 10 }}>
          Try again in {remainingTime}s
        </Text>
      )}

      <KeyboardAwareScrollView
        style={styles(colors).scroll}
        contentContainerStyle={styles(colors).formContainer}
        keyboardShouldPersistTaps="handled"
      >
        <LoginForm
          onSubmit={handleLogin}
          loading={isLoading}
          disabled={isActuallyBlocked}
        />
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = (colors: typeof lightColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    bgWrapper: {
      paddingTop: 40,
      height: BG_HEIGHT,
      overflow: "hidden",
    },
    columnsRow: {
      flexDirection: "row",
      width: "100%",
      flex: 1,
    },
    column: {
      flex: 1,
      overflow: "hidden",
    },
    fade: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 120,
    },
    scroll: {
      flex: 1,
    },
    formContainer: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingTop: 16,
    },
  });