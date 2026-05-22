import * as ScreenCapture from "expo-screen-capture";
import { useEffect } from "react";
import Toast from "react-native-toast-message";

export const useScreenshotGuard = () => {
  useEffect(() => {
    const subscription = ScreenCapture.addScreenshotListener(() => {
      Toast.show({
        type: "error",
        text1: "Action interdite",
        text2: "You can’t take screenshots on this screen",
      });
    });

    return () => {
      subscription?.remove?.();
    };
  }, []);
};