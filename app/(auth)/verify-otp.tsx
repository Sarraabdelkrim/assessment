import { Fonts } from "@/src/theme/fonts";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { api } from "../../src/api/client";
import { Text } from "../../src/components/ui/Text";
import { useTranslation } from "../../src/i18n/useTranslation";
import { useThemeStore } from "../../src/store/theme.store";
import { darkColors, lightColors } from "../../src/theme/colors";

const OTP_LENGTH = 6;
const OTP_EXPIRY = 5 * 60; // 5 minutes en secondes

export default function VerifyOtpScreen() {
  const { t } = useTranslation();
  const { email } = useLocalSearchParams<{ email: string }>();
  const dark = useThemeStore((s) => s.dark);
  const colors = dark ? darkColors : lightColors;
 const style = styles(colors); 
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(OTP_EXPIRY);
  const [canResend, setCanResend] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const inputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return; }
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const handleChange = (value: string, index: number) => {
    // Accepter uniquement les chiffres
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Un seul chiffre
    setOtp(newOtp);

    // Auto-focus suivant
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < OTP_LENGTH) {
      Toast.show({ type: "error", text1: t("common.error"), text2: t("otp.incomplete") });
      return;
    }

    // Bloquer après 3 tentatives
    if (attempts >= 3) {
      Toast.show({ type: "error", text1: t("auth.too_many_attempts"), text2: t("auth.blocked_5min") });
      router.replace("/(auth)/login");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/verify-otp", { email, code });

      // OTP valide → étape 3
      router.push({ pathname: "/(auth)/reset-password", params: { email, code } });

    } catch {
      setAttempts((a) => a + 1);
      setOtp(Array(OTP_LENGTH).fill("")); // Reset les champs
      inputRefs.current[0]?.focus();

      const left = 3 - (attempts + 1);
      Toast.show({
        type: "error",
        text1: t("otp.invalid"),
        text2: left > 0 ? `${t("auth.attempts_left")}: ${left}` : t("auth.last_attempt"),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    try {
      await api.post("/auth/forgot-password", { email });
      setCountdown(OTP_EXPIRY);
      setCanResend(false);
      setAttempts(0);
      setOtp(Array(OTP_LENGTH).fill(""));
      Toast.show({ type: "success", text1: t("otp.resent") });
    } catch {
      Toast.show({ type: "error", text1: t("common.error"), text2: t("common.something_went_wrong") });
    }
  };

  return (
    <View style={style.container}>
      <Text style={style.title}>{t("otp.title")}</Text>
      <Text style={style.subtitle}>{t("otp.sent_to")} {email}</Text>

     
      <View style={style.otpRow}>
        {otp.map((digit, i) => (
          <TextInput
            key={i}
            ref={(r) => { if (r) inputRefs.current[i] = r; }}
            style={[style.otpInput, digit ? style.otpFilled : undefined]}
            value={digit}
            onChangeText={(v) => handleChange(v, i)}
            onKeyPress={(e) => handleKeyPress(e, i)}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
          />
        ))}
      </View>

      <Text style={style.timer}>
        {countdown > 0
          ? `${t("otp.expires_in")} ${formatTime(countdown)}`
          : t("otp.expired")}
      </Text>

      <TouchableOpacity
        style={[style.button, (loading || countdown <= 0) && style.disabled]}
        onPress={handleVerify}
        disabled={loading || countdown <= 0}
      >
        <Text weight="700">{loading ? t("login.loading") : t("otp.verify")}</Text>
      </TouchableOpacity>

     
      <TouchableOpacity onPress={handleResend} disabled={!canResend}>
        <Text style={[style.resend, !canResend && style.resendDisabled]}>
          {t("otp.resend")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = (colors: typeof lightColors) => StyleSheet.create({

  container: { flex: 1, padding: 24, justifyContent: "center", backgroundColor: "#fff" },
  title: { fontSize: 26, fontFamily: Fonts.brandExtraBold, marginBottom: 10, color: "#111" },
  subtitle: { fontSize: 14, color: colors.textMuted, marginBottom: 32 },
  otpRow: { flexDirection: "row", justifyContent: "center", gap: 10, marginBottom: 24 },
  otpInput: {
    width: 48, height: 56, borderRadius: 12,
    borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface,
    textAlign: "center", fontSize: 22, fontFamily: "700", color: "#111",
  },
  otpFilled: { borderColor: colors.yellow, backgroundColor: colors.background },
  timer: { textAlign: "center", color: colors.textMuted, fontSize: 13, marginBottom: 16 },
  button: { backgroundColor: colors.yellow, height: 52, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  disabled: { opacity: 0.5 },
  resend: { marginTop: 20, textAlign: "center", color: colors.primary, fontSize: 14 },
  resendDisabled: { color: colors.textMuted },
});