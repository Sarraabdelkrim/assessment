import { useThemeStore } from "@/src/store/theme.store";
import { darkColors, lightColors } from "@/src/theme/colors";
import React from "react";
import {
  Text as RNText,
  StyleProp,
  TextProps,
  TextStyle,
} from "react-native";

type Props = TextProps & {
  children: React.ReactNode;
  size?: number;
  color?: string;     
  weight?: TextStyle["fontWeight"];
  align?: TextStyle["textAlign"];
  style?: StyleProp<TextStyle>;
};

export function Text({
  children,
  size = 14,
  color,              
  weight = "400",
  align = "left",
  style,
  ...props
}: Props) {
  const dark = useThemeStore((s) => s.dark);
  const colors = dark ? darkColors : lightColors;


  const textColor = color ?? colors.text;

  return (
    <RNText
      {...props}
      style={[
        {
          fontSize: size,
          color: textColor,
          fontWeight: weight,
          textAlign: align,
        },
        style,
      ]}
    >
      {children}
    </RNText>
  );
}