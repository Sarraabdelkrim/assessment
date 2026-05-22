import { useThemeStore } from "@/src/store/theme.store";
import { darkColors, lightColors } from "@/src/theme/colors";
import React, { useState } from "react";
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { Text } from "./Text";

type Props = TextInputProps & {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  borderRadius?: number;
  height?: number;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
};

export const Input = React.memo(function Input({
  label,
  error,
  containerStyle,
  inputStyle,
  borderRadius = 16,
  height = 56,
  leftElement,
  rightElement,
  ...props
}: Props) {
  const [focused, setFocused] = useState(false);

  const dark = useThemeStore((s) => s.dark);
  const colors = dark ? darkColors : lightColors;

  const isError = !!error;
  const Border = isError
    ? colors.error
    : focused
    ? colors.primary
    : colors.border;

  return (
    <View style={[styles.container, containerStyle]}>
      {!!label && (
        <Text size={12} weight="700" style={[styles.label, { color: colors.text }]}>
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            borderColor: Border,
            backgroundColor: colors.surface,
            borderRadius,
            height,
          },
        ]}
      >
        {leftElement}

        <TextInput
          {...props}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholderTextColor={colors.placeholder}
          style={[
            styles.input,
            { color: colors.text },
            inputStyle,
          ]}
        />

        {rightElement}
      </View>

      {!!error && (
        <Text size={12} style={[styles.error, { color: colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: { marginBottom: 18 },
  label: { marginBottom: 8, letterSpacing: 0.5 },
  inputContainer: {
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  input: { flex: 1, fontSize: 14 },
  error: { marginTop: 6 },
});