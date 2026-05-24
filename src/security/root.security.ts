import JailMonkey from "jail-monkey";

export const RootSecurity = {
  assertSafeDevice: () => {
    const rooted =
      JailMonkey.isJailBroken() ||
      JailMonkey.canMockLocation() ||
      JailMonkey.hookDetected();

    if (rooted) {
      throw new Error("ROOTED_DEVICE_NOT_ALLOWED");
    }
  },
};