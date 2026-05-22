
import { useThemeStore } from "@/src/store/theme.store";
import { darkColors, lightColors } from "@/src/theme/colors";
import {
    ActivityIndicator,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { useTranslation } from "../i18n/useTranslation";

type Props = {
  visible: boolean;
  title: string;
  isPending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function DeleteModal({
  visible,
  title,
  isPending,
  onConfirm,
  onCancel,
}: Props) {
  const { t } = useTranslation();
  const dark = useThemeStore((s) => s.dark);
  const colors = dark ? darkColors : lightColors;

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}>
    
      <TouchableWithoutFeedback onPress={onCancel} disabled={isPending}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>
      <View style={styles.wrapper}>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>

        
          <View style={styles.iconWrapper}>
            <Text style={styles.icon}>🗑️</Text>
          </View>

         
          <Text style={[styles.heading, { color: colors.text }]}>
            {t("deleteModal.title")}
          </Text>
          <Text style={[styles.sub, { color: colors.textMuted }]}>
            {t("deleteModal.subtitle")}
          </Text>

        
          <View style={styles.row}>
            <TouchableOpacity
              onPress={onCancel}
              disabled={isPending}
              style={[styles.btn, styles.cancelBtn, { borderColor: colors.border }]}
            >
              <Text style={[styles.cancelText, { color: colors.text }]}>
                {t("deleteModal.cancel")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              disabled={isPending}
              style={[styles.btn, styles.deleteBtn, { opacity: isPending ? 0.7 : 1 }]}
            >
              {isPending ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.deleteText}>
                  {t("deleteModal.confirm")}
                </Text>
              )}
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  card: {
    width: "100%",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fee2e2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  icon: { fontSize: 28 },
  heading: { fontSize: 20, fontWeight: "800", textAlign: "center" },
  sub: { fontSize: 14, textAlign: "center", lineHeight: 20 },
  row: { flexDirection: "row", gap: 12, marginTop: 8, width: "100%" },
  btn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelBtn: { borderWidth: 1.5 },
  deleteBtn: { backgroundColor: "#ef4444" },
  cancelText: { fontWeight: "600", fontSize: 15 },
  deleteText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});