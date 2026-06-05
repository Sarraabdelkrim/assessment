import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from "react-native";



import {
  LoginFormData,
  loginSchema,
} from "@/src/validation/auth.validation";
import { useTranslation } from "../../i18n/useTranslation";
import { useAuthStore } from "../../store/auth/auth.store";
import { useThemeStore } from "../../store/theme.store";
import { darkColors, lightColors } from "../../theme/colors";
import { Input } from "../ui/Input";
import { Text } from "../ui/Text";

type LoginFormProps = {
  onSubmit: (data: LoginFormData) => void | Promise<void>;
  loading: boolean;
};

export function LoginForm({ onSubmit, loading }: LoginFormProps) {
  const { t } = useTranslation();
  const isBlocked = useAuthStore((s) => s.isBlocked);
  const dark = useThemeStore((s) => s.dark);
  const colors = dark ? darkColors : lightColors;
  const S = styles(colors);
  const schema = loginSchema(t);

  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
        username: "emilys",
    password: "emilyspass",
    },
  });

  return (
    <ScrollView
      contentContainerStyle={S.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
    
      <Controller
        control={control}
        name="username"
        
        render={({ field: { onChange, value } }) => (
          <Input
            label={t("login.username")}
             testID="usernameInput"
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
       testID="passwordInput"
      error={errors.password?.message}
      onChangeText={onChange}
      secureTextEntry={!showPassword}
      autoCapitalize="none"
      containerStyle={errors.password && S.inputError}
      rightElement={
        <TouchableOpacity
          onPress={() => setShowPassword((prev) => !prev)}
            testID="togglePassword"
          style={S.eyeIcon}
        >
          <Image
            source={
              showPassword
                ? require("../../../assets/icons/view.png")
                : require("../../../assets/icons/hide.png")
            }
            style={{
              width: 20,
              height: 20,
              tintColor: colors.textMuted,
            }}
          />
        </TouchableOpacity>
      }
    />
  )}
/>
    
      <TouchableOpacity
        disabled={loading || isBlocked}
         testID="loginButton"
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
        <Text style={S.blockedText}>{t("login.blocked_account")}</Text>
      )}
    </ScrollView>
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
   passwordWrapper: {
      position: "relative",
      justifyContent: "center",
    },

   eyeIcon: {
  position: "absolute",
  right: 14,
  top: 0,
  bottom: 0,
  justifyContent: "center",
  alignItems: "center",
}
});