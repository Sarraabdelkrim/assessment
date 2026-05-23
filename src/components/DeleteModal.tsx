import {
    ActivityIndicator,
    Image,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";

import { useThemeStore } from "@/src/store/theme.store";
import { darkColors, lightColors } from "@/src/theme/colors";
import { useTranslation } from "../i18n/useTranslation";

type Props = {
  visible: boolean;
  title?: string;
  subtitle?: string;
  isPending?: boolean;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function DeleteModal({
  visible,
  title,
  subtitle,
  isPending = false,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}: Props) {
  const { t } = useTranslation();
  const dark = useThemeStore((s) => s.dark);
  const colors = dark ? darkColors : lightColors;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}
    >
     
      <TouchableWithoutFeedback onPress={onCancel} disabled={isPending}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <View style={styles.wrapper}>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface },
          ]}
        >
     
          <View
            style={[
              styles.iconWrapper,
              { backgroundColor: colors.background },
            ]}
          >
            <Image
              source={require("@/assets/icons/trash.png")}
              style={styles.icon}
            />
          </View>

          <Text style={[styles.title, { color: colors.text }]}>
            {title ?? t("deleteModal.title")}
          </Text>

    
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            {subtitle ?? t("deleteModal.subtitle")}
          </Text>

       
          <View style={styles.row}>
            <TouchableOpacity
              onPress={onCancel}
              disabled={isPending}
              style={[
                styles.btn,
                styles.cancelBtn,
                { borderColor: colors.border },
              ]}
            >
              <Text style={[styles.cancelText, { color: colors.text }]}>
                {cancelText ?? t("deleteModal.cancel")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              disabled={isPending}
              style={[
                styles.btn,
                styles.deleteBtn,
                { opacity: isPending ? 0.7 : 1 },
              ]}
            >
              {isPending ? (
                <ActivityIndicator color={colors.background} />
              ) : (
                <Text style={styles.deleteText}>
                  {confirmText ?? t("deleteModal.confirm")}
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
    paddingHorizontal: 24,
  },

  card: {
    width: "100%",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    gap: 12,
    elevation: 10,
  },

  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },

  icon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },

  title: {
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },

  row: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    marginTop: 10,
  },

  btn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  cancelBtn: {
    borderWidth: 1.5,
  },

  deleteBtn: {
    backgroundColor: "#ef4444",
  },

  cancelText: {
    fontWeight: "600",
  },

  deleteText: {
    color: "#fff",
    fontWeight: "700",
  },
});