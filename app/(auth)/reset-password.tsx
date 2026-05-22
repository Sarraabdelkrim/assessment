import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";

import { api } from "../../src/api/client";
import { Input } from "../../src/components/ui/Input";
import { Text } from "../../src/components/ui/Text";
import { useTranslation } from "../../src/i18n/useTranslation";

import { useThemeStore } from "@/src/store/theme.store";
import { Fonts } from "@/src/theme/fonts";
import { darkColors, lightColors } from "../../src/theme/colors";
export default function ResetPasswordScreen() {
  const { t } = useTranslation();
  const dark = useThemeStore((s) => s.dark);
  const colors = dark ? darkColors : lightColors;

  const { email, code } = useLocalSearchParams<{
    email: string;
    code: string;
  }>();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const schema = z
    .object({
      password: z
        .string()
        .min(8, t("reset.min_8"))
        .regex(/[A-Z]/, t("reset.need_uppercase"))
        .regex(/[0-9]/, t("reset.need_number")),
      confirm: z.string(),
    })
    .refine((d) => d.password === d.confirm, {
      message: t("reset.passwords_no_match"),
      path: ["confirm"],
    });

  const getStrength = (p: string) => {
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };

  const strength = getStrength(password);

  const strengthColors = [
    colors.error,
    colors.warning,
    colors.yellow,
    colors.success,
  ];

  const strengthLabels = [
    t("reset.weak"),
    t("reset.fair"),
    t("reset.good"),
    t("reset.strong"),
  ];

  const handleReset = async () => {
    const result = schema.safeParse({ password, confirm });

    if (!result.success) {
      Toast.show({
        type: "error",
        text1: t("common.error"),
       
      });
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/reset-password", {
        email,
        code,
        password,
      });

      Toast.show({
        type: "success",
        text1: t("reset.success"),
        text2: t("reset.can_login"),
      });

      router.replace("/(auth)/login");
    } catch {
      Toast.show({
        type: "error",
        text1: t("common.error"),
        text2: t("common.something_went_wrong"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles(colors).container}>
      <Text style={styles(colors).title}>{t("reset.title")}</Text>

      <Text style={styles(colors).subtitle}>
        {t("reset.subtitle")}
      </Text>

      <Input
        label={t("reset.new_password")}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {password.length > 0 && (
        <View style={styles(colors).strengthContainer}>
          <View style={styles(colors).strengthBars}>
            {[0, 1, 2, 3].map((i) => (
              <View
                key={i}
                style={[
                  styles(colors).strengthBar,
                  {
                    backgroundColor:
                      i < strength
                        ? strengthColors[strength - 1]
                        : colors.border,
                  },
                ]}
              />
            ))}
          </View>

          <Text
            style={[
              styles(colors).strengthLabel,
              {
                color:
                  strength > 0
                    ? strengthColors[strength - 1]
                    : colors.text,
              },
            ]}
          >
            {strength > 0 ? strengthLabels[strength - 1] : ""}
          </Text>
        </View>
      )}

      <Input
        label={t("reset.confirm_password")}
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry
        error={
          confirm && confirm !== password
            ? t("reset.passwords_no_match")
            : undefined
        }
      />

      <TouchableOpacity
        style={[
          styles(colors).button,
          (loading || strength < 2) && styles(colors).disabled,
        ]}
        onPress={handleReset}
        disabled={loading || strength < 2}
      >
        <Text weight="700">
          {loading ? t("login.loading") : t("reset.confirm")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = (colors: typeof lightColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      justifyContent: "center",
      backgroundColor: colors.background,
    },

    title: {
      fontSize: 26,
      fontFamily:Fonts.brandExtraBold,
      marginBottom: 10,
      color: colors.text,
    },

    subtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 20,
    },

    strengthContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginTop: 8,
      marginBottom: 8,
    },

    strengthBars: {
      flexDirection: "row",
      gap: 4,
      flex: 1,
    },

    strengthBar: {
      flex: 1,
      height: 4,
      borderRadius: 2,
    },

    strengthLabel: {
      fontSize: 12,
      fontFamily: Fonts.brandBold,
      minWidth: 50,
    },

    button: {
      marginTop: 20,
      backgroundColor: colors.primary,
      height: 52,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },

    disabled: {
      opacity: 0.5,
    },
  });