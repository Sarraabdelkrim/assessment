import { useThemeStore } from "@/src/store/theme.store";
import { darkColors, lightColors } from "@/src/theme/colors";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  error?: string;
  disabled?: boolean;
};

export default function InputNumeric({
  label,
  value,
  onChange,
  error,
  disabled,
}: Props) {
  const dark = useThemeStore((s) => s.dark);
  const colors = dark ? darkColors : lightColors;

  return (
    <View style={{ gap: 6 }}>
      <Text style={[styles.label, { color: colors.text }]}>
        {label}
      </Text>

      <TextInput
        value={String(value ?? "")}
        keyboardType="numeric"
        editable={!disabled}
        onChangeText={(text) => {
          const numericValue = text.replace(/[^0-9.]/g, "");
          onChange(numericValue ? Number(numericValue) : 0);
        }}
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            borderColor: error ? colors.error : colors.border,
            color: colors.text,
          },
        ]}
      />

      {error ? (
        <Text style={{ color: colors.error, fontSize: 12 }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
  },
});