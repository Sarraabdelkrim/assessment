import { create } from "zustand";

import { api } from "@/src/constant/api";
import { DeviceSecurityNative } from "@/src/native/deviceSecurity";
import { DeviceSecurity } from "@/src/security/device.security";
import { FingerprintSecurity } from "@/src/security/fingerprint.security";
import { TokenSecurity } from "@/src/security/token.security";

type User = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
};

type AuthState = {
  token: string | null;
  user: User | null;

  isLoading: boolean;
  isHydrated: boolean;

  loginAttempts: number;
  isBlocked: boolean;
  blockedUntil: number | null;

  sessionStart: number | null;

  hydrate: () => Promise<void>;

  login: (data: {
    username: string;
    password: string;
  }) => Promise<void>;

  logout: () => Promise<void>;

  resetAttempts: () => void;
};

const SESSION_TIMEOUT = 1 * 60 * 1000;

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,

  isLoading: false,
  isHydrated: false,

  loginAttempts: 0,
  isBlocked: false,
  blockedUntil: null,

  sessionStart: null,

  hydrate: async () => {
    // récupérer le token sauvegardé dans le storage sécurisé
    const savedToken = await TokenSecurity.getToken();

    // mettre à jour l'état du store avec le token récupéré
    // et indiquer que le chargement est terminée
    set({
      token: savedToken,
      isHydrated: true,
    });
  },

 login: async (data) => {
  const state = get();

  try {
    // sécurité device (root / jailbreak native module)
    if (DeviceSecurityNative.isRooted()) {
      throw new Error("DEVICE_COMPROMISED");
    }

    //  vérifier si c’est un vrai device 
    DeviceSecurity.assertRealDevice();

    //  check blocage compte
    if (
      state.isBlocked &&
      state.blockedUntil &&
      Date.now() < state.blockedUntil
    ) {
      throw new Error("ACCOUNT_BLOCKED");
    }

    //  reset blocage si expiré
    if (
      state.isBlocked &&
      state.blockedUntil &&
      Date.now() > state.blockedUntil
    ) {
      set({
        isBlocked: false,
        loginAttempts: 0,
        blockedUntil: null,
      });
    }

    //  loading
    set({ isLoading: true });

    //  fingerprint device
    const fingerprint = FingerprintSecurity.getFingerprint();
    console.log("fingerprint genere :", fingerprint);

    //  API call
    const response = await api.post("/auth/login", {
      username: data.username.trim(),
      password: data.password,
      expiresInMins: 30,
      fingerprint,
    });

    const result = response.data;

    //  save token secure
    await TokenSecurity.saveToken(result.accessToken);

    //  update store
    set({
      token: result.accessToken,
      user: result,
      sessionStart: Date.now(),
      loginAttempts: 0,
      isBlocked: false,
      blockedUntil: null,
    });

  } catch (error) {
    // blocage logique
    const attempts = state.loginAttempts + 1;
    const blocked = attempts >= 3;

    set({
      token: null,
      user: null,
      loginAttempts: attempts,
      isBlocked: blocked,
      blockedUntil: blocked ? Date.now() + 5 * 60 * 1000 : null,
    });

    throw error;

  } finally {
    set({ isLoading: false });
  }
},
  logout: async () => {
    // supprimer le token du storage sécurisé
    await TokenSecurity.removeToken();

    set({
      token: null,
      user: null,
      sessionStart: null,
      loginAttempts: 0,
      isBlocked: false,
      blockedUntil: null,
    });
  },

  resetAttempts: () => {
    set({
      loginAttempts: 0,
      isBlocked: false,
      blockedUntil: null,
    });
  },
}));