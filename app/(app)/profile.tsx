import { useTranslation } from "@/src/i18n/useTranslation";
import { useAuthStore } from "@/src/store/auth/auth.store";
import { useLangStore } from "@/src/store/lang.store";
import { useThemeStore } from "@/src/store/theme.store";
import { darkColors, lightColors } from "@/src/theme/colors";
import { Fonts } from "@/src/theme/fonts";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function ProfileScreen() {
  const { t } = useTranslation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const dark = useThemeStore((s) => s.dark);
  const toggleDark = useThemeStore((s) => s.toggleDark);
  const colors = dark ? darkColors : lightColors;

  const lang = useLangStore((s) => s.lang);
  const setLang = useLangStore((s) => s.setLang);

  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const style = styles(colors);

  const confirmLogout = async () => {
    try {
      setIsLoggingOut(true);

      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("user");

      logout();

      setShowLogoutModal(false);
      router.replace("/(auth)/login");
    } catch (e) {
      console.error("err", e);
      setIsLoggingOut(false); 
      setShowLogoutModal(false);
      Toast.show({
        type: "error",
        text1: t("common.error"),
        text2: t("profile.logout_error"),
      });
    }
  };

  return (
    <View style={[style.root, { backgroundColor: colors.background }]}>
      <StatusBar style={dark ? "light" : "dark"} backgroundColor={colors.background} />

     
      <View style={[style.header, { borderBottomColor: colors.border }]}>
        <View style={[style.avatar, { backgroundColor: colors.primary }]}>
          <Text style={style.avatarText}>
            {user?.username?.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={[style.name, { color: colors.text }]}>{user?.username}</Text>
        <Text style={[style.role, { color: colors.textMuted }]}>{user?.email}</Text>
      </View>

      <View style={style.section}>
        <Text style={[style.sectionTitle, { color: colors.textMuted }]}>
          {t("profile.preferences")}
        </Text>

        <View style={[style.row, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={style.rowLeft}>
            <View style={[style.iconBox, { backgroundColor: colors.surface }]}>
              <Ionicons name={dark ? "moon" : "sunny"} size={18} color={colors.primary} />
            </View>
            <Text style={[style.rowLabel, { color: colors.text }]}>
              {t("profile.dark_mode")}
            </Text>
          </View>
          <Switch
            value={dark}
            onValueChange={toggleDark}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.background}
          />
        </View>

   
        <View style={[style.row, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={style.rowLeft}>
            <View style={[style.iconBox, { backgroundColor: colors.surface }]}>
              <Ionicons name="language" size={18} color={colors.primary} />
            </View>
            <Text style={[style.rowLabel, { color: colors.text }]}>
              {t("profile.language")}
            </Text>
          </View>
          <View style={style.langToggle}>
            {(["fr", "en"] as const).map((l) => (
              <TouchableOpacity
                key={l}
                onPress={() => setLang(l)}
                style={[
                  style.langBtn,
                  {
                    backgroundColor: lang === l ? colors.primary : colors.surface,
                    borderColor: lang === l ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text style={{ color: lang === l ? colors.background : colors.text, fontFamily: Fonts.brand, fontSize: 12 }}>
                  {l.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

    
      <View style={style.section}>
        <Text style={[style.sectionTitle, { color: colors.textMuted }]}>
          {t("profile.account")}
        </Text>

        <TouchableOpacity
          onPress={() => setShowLogoutModal(true)}
          style={[style.row, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <View style={style.rowLeft}>
            <View style={[style.iconBox, { backgroundColor: "#FEE2E2" }]}>
              <Ionicons name="log-out-outline" size={18} color={colors.error} />
            </View>
            <Text style={[style.rowLabel, { color: colors.error }]}>
              {t("profile.logout")}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      <Modal
        transparent
        animationType="fade"
        visible={showLogoutModal}
        onRequestClose={() => !isLoggingOut && setShowLogoutModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => !isLoggingOut && setShowLogoutModal(false)}>
          <View style={style.backdrop} />
        </TouchableWithoutFeedback>

        <View style={style.modalWrapper}>
          <View style={[style.modalCard, { backgroundColor: colors.background }]}>
            <View style={[style.modalIconWrapper, { backgroundColor: isLoggingOut ? "transparent" : colors.background }]}>
              {isLoggingOut ? (
                <ActivityIndicator size="large" color={colors.error} />
              ) : (
                <Ionicons name="log-out-outline" size={32} color={colors.error} />
              )}
            </View>

            <Text style={[style.modalTitle, { color: colors.text }]}>
              {isLoggingOut ? t("profile.logging_out") : t("profile.logout")}
            </Text>

            <Text style={[style.modalSub, { color: colors.textMuted }]}>
              {isLoggingOut ? t("profile.please_wait") : t("profile.logout_confirmation")}
            </Text>

          
            {!isLoggingOut && (
              <View style={style.modalRow}>
                <TouchableOpacity
                  onPress={() => setShowLogoutModal(false)}
                  style={[style.modalBtn, style.cancelBtn, { borderColor: colors.border }]}
                >
                  <Text style={[style.cancelText, { color: colors.text }]}>
                    {t("common.cancel")}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={confirmLogout}
                  style={[style.modalBtn, style.logoutBtn]}
                >
                  <Text style={style.logoutText}>
                    {t("profile.logout")}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = (colors: typeof lightColors) =>
  StyleSheet.create({
    root: { flex: 1 },
    header: {
      alignItems: "center",
      paddingTop: 60,
      paddingBottom: 24,
      borderBottomWidth: 1,
      gap: 6,
    },
    avatar: {
      width: 72,
      height: 72,
      borderRadius: 36,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 8,
    },
    avatarText: { color: colors.background, fontFamily: Fonts.brandExtraBold, fontSize: 28 },
    name: { fontSize: 20, fontFamily: Fonts.brandBold },
    role: { fontSize: 13 },
    section: { padding: 16, gap: 10 },
    sectionTitle: {
      fontSize: 12,
      fontFamily: Fonts.brandBold,
      textTransform: "uppercase",
      marginBottom: 4,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 14,
      borderRadius: 14,
      borderWidth: 1,
    },
    rowLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
    iconBox: {
      width: 36,
      height: 36,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    rowLabel: { fontSize: 15, fontFamily: Fonts.brandBold },
    langToggle: { flexDirection: "row", gap: 6 },
    langBtn: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      borderWidth: 1,
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor:colors.background,
    },
    modalWrapper: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 32,
    },
    modalCard: {
      width: "100%",
      borderRadius: 24,
      padding: 28,
      alignItems: "center",
      gap: 12,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 24,
      elevation: 10,
    },
    modalIconWrapper: {
      width: 64,
      height: 64,
      borderRadius: 32,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 4,
    },
    modalTitle: { fontSize: 20, fontFamily: Fonts.brandExtraBold, textAlign: "center" },
    modalSub: { fontSize: 14, textAlign: "center", lineHeight: 20 },
    modalRow: { flexDirection: "row", gap: 12, marginTop: 8, width: "100%" },
    modalBtn: {
      flex: 1,
      height: 48,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
    },
    cancelBtn: { borderWidth: 1.5 },
    logoutBtn: { backgroundColor: colors.error},
    cancelText: { fontFamily: Fonts.brandBold, fontSize: 15 },
    logoutText: { color: colors.background, fontFamily: Fonts.brandExtraBold, fontSize: 15 },
  });