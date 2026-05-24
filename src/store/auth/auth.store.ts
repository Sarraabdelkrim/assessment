import { create } from "zustand";

import { DeviceSecurity } from "@/src/security/device.security";
import { FingerprintSecurity } from "@/src/security/fingerprint.security";
import { RootSecurity } from "@/src/security/root.security";
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

  checkSession: () => void;
};

const SESSION_TIMEOUT = 1 * 60 * 1000;
const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/auth/login`;

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
    const savedToken = await TokenSecurity.getToken();

    set({
      token: savedToken,
      isHydrated: true,
    });
  },

  
  login: async (data) => {
    const state = get();

    // block l'emulateurrr
    DeviceSecurity.assertRealDevice();

    // block  jailBreak
    RootSecurity.assertSafeDevice();

    // account bloque 
    if (
      state.isBlocked &&
      state.blockedUntil &&
      Date.now() < state.blockedUntil
    ) {
      throw new Error("ACCOUNT_BLOCKED");
    }

    // resete bloque 
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

    try {
      set({ isLoading: true });

      // device finger print
      const fingerprint = FingerprintSecurity.getFingerprint();

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          username: data.username.trim(),
          password: data.password,
          expiresInMins: 30,

          fingerprint,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.accessToken) {
        throw new Error("INVALID_CREDENTIALS");
      }

      // security token 
      await TokenSecurity.saveToken(result.accessToken);

      set({
        token: result.accessToken,
        user: result,

        sessionStart: Date.now(),

        loginAttempts: 0,
        isBlocked: false,
        blockedUntil: null,
      });
    } catch (error) {
      const attempts = state.loginAttempts + 1;

      set({
        token: null,
        user: null,

        loginAttempts: attempts,
        isBlocked: attempts >= 3,

        blockedUntil:
          attempts >= 3
            ? Date.now() + 5 * 60 * 1000
            : null,
      });

      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
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

  // session d'expiration 
  checkSession: () => {
    const state = get();

    if (!state.token || !state.sessionStart) {
      return;
    }

    const now = Date.now();

    if (now - state.sessionStart > SESSION_TIMEOUT) {
      state.logout();
    }
  },
}));