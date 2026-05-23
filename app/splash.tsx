import { router } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { Fonts } from "@/src/theme/fonts";
import { useTranslation } from "../src/i18n/useTranslation";
import { useAuthStore } from "../src/store/auth/auth.store";
import { useThemeStore } from "../src/store/theme.store";
import { darkColors, lightColors } from "../src/theme/colors";

export default function Splash() {
  const token = useAuthStore((s) => s.token);
  const dark = useThemeStore((s) => s.dark);
  const { t } = useTranslation();

  const colors = dark ? darkColors : lightColors;
 const style = styles(colors); 

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace(token ? "/(app)/home" : "/(auth)/login");
    }, 2000);

    return () => clearTimeout(timer);
  }, [token]);

  return (
    <View style={[style.container, { backgroundColor: colors.background }]}>
      
   
      <View
        style={
          style.glow
         
        }
      />

      <Animated.View
        entering={FadeInDown.duration(600)}
        style={style.logoContainer}
      >
        <Image
          source={require("../assets/images/wolt-logo.png")}
          style={style.logo}
        />
      </Animated.View>

   
      <Animated.Text
        entering={FadeInDown.delay(200)}
        style={[
          style.title,
          {
            color: colors.text,
          },
        ]}
      >
        {t("login.tagline")}
      </Animated.Text>

    
     

    </View>
  );
}



const styles = (colors: typeof lightColors) => StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  glow: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    opacity: 0.15,
    top: "30%",
  },

  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  logo: {
    width: 170,
    height: 70,
    resizeMode: "contain",
  },

  title: {
    fontSize: 20,
    fontFamily: Fonts.brand,
    textAlign: "center",
    marginTop: 10,
  },

  loading: {
    marginTop: 15,
    fontSize: 14,
  },
});