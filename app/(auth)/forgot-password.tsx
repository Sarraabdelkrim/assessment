import { Fonts } from "@/src/theme/fonts";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";
import { api } from "../../src/api/client";
import { authSecurity } from "../../src/auth/auth.security";
import { Input } from "../../src/components/ui/Input";
import { Text } from "../../src/components/ui/Text";
import { useTranslation } from "../../src/i18n/useTranslation";
import { useThemeStore } from "../../src/store/theme.store";
import { darkColors, lightColors } from "../../src/theme/colors";

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
   const dark = useThemeStore((s) => s.dark);
  const colors = dark ? darkColors : lightColors;
    const style = styles(colors); 

  const schema = z.object({
    email: z.string().email(t("common.invalid_email")),
  });

  const handleSubmit = async () => {
    if (authSecurity.isBlocked()) {
      const mins = Math.ceil(authSecurity.remainingTime() / 1000 / 60);
      Toast.show({ type: "error", text1: t("auth.blocked" as any), text2: `${t("auth.try_again_in" as any)} ${mins} min` });
      return;
    }

    const result = schema.safeParse({ email });
    if (!result.success) {
      Toast.show({ type: "error", text1: t("common.error") });
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/forgot-password", { email: email.trim() });

      authSecurity.reset();
      router.push({ pathname: "/(auth)/verify-otp", params: { email: email.trim() } });

    } catch (error: any) {
      await authSecurity.registerFailed();

      if (authSecurity.isBlocked()) {
        Toast.show({ type: "error", text1: t("auth.too_many_attempts" as any), text2: t("auth.blockedsoon" as any) });
      } else {
        Toast.show({ type: "error", text1: t("common.error"), text2: t("common.something_went_wrong") });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={style.container}>
      <Text style={style.title}>{t("forgot_password.title")}</Text>
      <Text style={style.subtitle}>{t("forgot_password.enter_email" as any)}</Text>

      <Input
        label={t("common.email")}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TouchableOpacity
        style={[style.button, loading && style.disabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text weight="700">{loading ? t("login.loading") : t("common.continue")}</Text>
      </TouchableOpacity>

      <Text style={style.back} onPress={() => router.replace("/(auth)/login")}>
        {t("forgot_password.back_to_login")}
      </Text>
    </View>
  );
}

const styles = (colors: typeof lightColors) => StyleSheet.create({

  container: { flex: 1, padding: 24, justifyContent: "center", backgroundColor:colors.background },
  title: { fontSize: 26, fontFamily: Fonts.brandExtraBold, marginBottom: 10, color: colors.text },
  subtitle: { fontSize: 14, color: colors.textMuted, marginBottom: 20 },
  button: { marginTop: 20, backgroundColor: colors.yellow, height: 52, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  disabled: { opacity: 0.6 },
  back: { marginTop: 20, textAlign: "center", color: colors.primary },
});