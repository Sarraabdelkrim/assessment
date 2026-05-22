import * as ScreenCapture from "expo-screen-capture";
import { useEffect } from "react";

export const useSecureScreen = () => {
  useEffect(() => {
    ScreenCapture.preventScreenCaptureAsync();

    return () => {
      ScreenCapture.allowScreenCaptureAsync();
    };
  }, []);
};