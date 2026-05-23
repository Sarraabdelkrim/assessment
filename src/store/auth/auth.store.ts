import { create } from "zustand";

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
  login: (data: { username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;

  checkSession: () => void;
};

const SESSION_TIMEOUT = 2 * 60 * 1000; 
const API_URL = process.env.EXPO_PUBLIC_API_URL;
export const useAuthStore = create<AuthState>((set, get) => ({

  token: null,
  user: null,

  isLoading: false,
  isHydrated: false,

  loginAttempts: 0,
  isBlocked: false,
  blockedUntil: null,

  sessionStart: null,

  // 🔄 INIT APP
  hydrate: async () => {
    set({
      token: null,
      user: null,
      isHydrated: true,
      sessionStart: null,
    });
  },

  // 🔐 LOGIN (FIXED DUMMYJSON)
  login: async (data) => {
    const { loginAttempts, isBlocked, blockedUntil } = get();

    // 🚫 BLOCK CHECK
    if (isBlocked && blockedUntil && Date.now() < blockedUntil) {
      throw new Error("ACCOUNT_BLOCKED");
    }

    // ♻️ RESET BLOCK IF EXPIRED
    if (isBlocked && blockedUntil && Date.now() > blockedUntil) {
      set({
        isBlocked: false,
        loginAttempts: 0,
        blockedUntil: null,
      });
    }

    try {
      set({ isLoading: true });

    const response = await fetch(`${API_URL}/auth/login`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  body: JSON.stringify({
    username: data.username.trim(),
    password: data.password,
    expiresInMins: 30,
  }),
});

      const result = await response.json();

    
      if (!response.ok || !result.accessToken) {
        throw new Error("INVALID_CREDENTIALS");
      }

    
      set({
        token: result.accessToken,
        user: result,
        sessionStart: Date.now(),

        loginAttempts: 0,
        isBlocked: false,
        blockedUntil: null,
      });

    } catch (error) {
      const attempts = loginAttempts + 1;

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
    set({
      token: null,
      user: null,
      sessionStart: null,
      loginAttempts: 0,
      isBlocked: false,
      blockedUntil: null,
    });
  },


  checkSession: () => {
    const state = get();

    if (!state.token || !state.sessionStart) return;

    const now = Date.now();

    if (now - state.sessionStart > SESSION_TIMEOUT) {
    
      state.logout();
    }
  },
}));