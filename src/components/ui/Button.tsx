import React from "react";
import {
  ActivityIndicator,
  StyleProp,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

import { Text } from "./Text";

type Props = {
  label: string;
  onPress: () => void;

  loading?: boolean;
  disabled?: boolean;

  backgroundColor?: string;
  textColor?: string;

  height?: number;
  borderRadius?: number;

  style?: StyleProp<ViewStyle>;
};

export function Button({
  label,
  onPress,

  loading = false,
  disabled = false,

  backgroundColor = "#6366F1",
  textColor = "#FFFFFF",

  height = 56,
  borderRadius = 16,

  style,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={loading || disabled}
      style={[
        {
          backgroundColor,
          height,
          borderRadius,
          justifyContent: "center",
          alignItems: "center",
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text
          size={15}
          weight="700"
          color={textColor}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}