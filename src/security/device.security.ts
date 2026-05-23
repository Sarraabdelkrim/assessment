import * as Device from "expo-device";
import { Platform } from "react-native";

export const DeviceSecurity = {
  isRealDevice: Device.isDevice,

  assertRealDevice: () => {
    if (!Device.isDevice) {
      throw new Error("EMULATOR_NOT_ALLOWED");
    }
  },

  logDeviceInfo: () => {
    console.log("Device:", Device.modelName);
    console.log("OS:", Platform.OS);
    console.log("Real device:", Device.isDevice);
  },
};