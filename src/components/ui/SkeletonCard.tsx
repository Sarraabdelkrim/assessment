import { useTranslation } from "@/src/i18n/useTranslation";
import { StyleSheet, View } from "react-native";
import { useThemeStore } from "../../store/theme.store";
import { darkColors, lightColors } from "../../theme/colors";

type Props = {
  width?: number;
  imageHeight?: number;
};

export function SkeletonCard({ width = 155, imageHeight = 125 }: Props) {
  const dark = useThemeStore((s) => s.dark);
  const colors = dark ? darkColors : lightColors;
const { t } = useTranslation();
  return (
    <View style={[styles.card, { width, backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.image, { width, height: imageHeight, backgroundColor: colors.border }]} />
      <View style={styles.body}>
        <View style={[styles.line, { backgroundColor: colors.border, width: "80%" }]} />
        <View style={[styles.line, { backgroundColor: colors.border, width: "50%", marginTop: 6 }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
  },
  image: {},
  body: {
    padding: 10,
    gap: 4,
  },
  line: {
    height: 10,
    borderRadius: 6,
  },
});