import * as Application from "expo-application";
import * as Device from "expo-device";

export const FingerprintSecurity = {
  getFingerprint: () => {
    const deviceInfo = {
      brand: Device.brand,
      model: Device.modelName,
      os: Device.osName,
      osVersion: Device.osVersion,
      appId: Application.applicationId,
    };

    console.log("informations sur l'appareil :", deviceInfo);

    return deviceInfo;
  },
};