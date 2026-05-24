import * as Application from "expo-application";
import * as Device from "expo-device";

export const FingerprintSecurity = {
  getFingerprint: () => {
    return {
      brand: Device.brand,
      model: Device.modelName,
      os: Device.osName,
      osVersion: Device.osVersion,
      appId: Application.applicationId,
    };
  },
};