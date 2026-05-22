import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from "react-native";
import { z } from "zod";

import { useAuthStore } from "../../auth/auth.store";
import { useTranslation } from "../../i18n/useTranslation";
import { useThemeStore } from "../../store/theme.store";
import { darkColors, lightColors } from "../../theme/colors";
import { Input } from "../ui/Input";
import { Text } from "../ui/Text";

type FormData = {
  username: string;
  password: string;
};

export function LoginForm({ onSubmit, loading }: any) {
  const { t } = useTranslation();
  const isBlocked = useAuthStore((s) => s.isBlocked);
  const dark = useThemeStore((s) => s.dark);
  const colors = dark ? darkColors : lightColors;
  const S = styles(colors); 

  const schema = z.object({
    username: z.string().min(1, t("login.required")),
    password: z.string().min(1, t("login.required")),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "emilys",
      password: "emilyspass",
    },
  });

  return (
    <View style={S.container}>

  
      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, value } }) => (
          <Input
            label={t("login.username")}
            value={value}
            error={errors.username?.message}
            onChangeText={onChange}
            autoCapitalize="none"
            style={[S.input, errors.username && S.inputError]}
          />
        )}
      />


      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <Input
            label={t("login.password")}
            value={value}
            error={errors.password?.message}
            onChangeText={onChange}
            secureTextEntry
            autoCapitalize="none"
            style={[S.input, errors.password && S.inputError]}
          />
        )}
      />

      <TouchableOpacity
        disabled={loading || isBlocked}
        onPress={handleSubmit(onSubmit)}
        style={[S.button, (loading || isBlocked) && S.buttonDisabled]}
      >
        {loading ? (
          <ActivityIndicator color={colors.background} size="small" />
        ) : (
          <Text weight="700" style={S.buttonText}>
            {t("login.submit")}
          </Text>
        )}
      </TouchableOpacity>

    
      {isBlocked && (
        <Text style={S.blockedText}>
          {t("login.blocked_account")}
        </Text>
      )}

    </View>
  );
}

const styles = (colors: typeof lightColors) => StyleSheet.create({
  container: {
    gap: 16,
  },
  input: {
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: colors.surface,
    color: colors.text,
  },
  inputError: {
    borderColor: colors.error,
  },
  button: {
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
  },
  blockedText: {
    color: colors.error,
    textAlign: "center",
    fontSize: 13,
    marginTop: 4,
  },
});