import { NativeModules } from "react-native";


const { DeviceSecurity } = NativeModules;

export const DeviceSecurityNative = {
  
   // check si device rooté / jailbreaké
   
  isRooted: (): boolean => {
    return DeviceSecurity?.isRooted?.() ?? false;
  },
};