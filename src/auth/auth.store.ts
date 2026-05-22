import { create } from "zustand";
import { api } from "../api/client";

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

  loginAttempts: number;
  isBlocked: boolean;
  blockedUntil: number | null;

  login: (data: { username: string; password: string }) => Promise<void>;
  logout: () => void;
  resetAttempts: () => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  isLoading: false,

  loginAttempts: 0,
  isBlocked: false,
  blockedUntil: null,

  resetAttempts: () =>
    set({
      loginAttempts: 0,
      isBlocked: false,
      blockedUntil: null,
    }),

  login: async (data) => {
    const { loginAttempts, isBlocked, blockedUntil } = get();

    if (isBlocked && blockedUntil && Date.now() < blockedUntil) {
      throw new Error("USER_BLOCKED");
    }

    if (isBlocked && blockedUntil && Date.now() > blockedUntil) {
      set({
        isBlocked: false,
        loginAttempts: 0,
        blockedUntil: null,
      });
    }

    try {
      set({ isLoading: true });

      const res = await api.post("/auth/login", {
        username: data.username,
        password: data.password,
        expiresInMins: 60,
      });

      set({
        token: res.data.accessToken,
        user: {
          id: res.data.id,
          username: res.data.username,
          email: res.data.email,
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          image: res.data.image,
        },
        loginAttempts: 0,
        isBlocked: false,
        blockedUntil: null,
      });
    } catch (error) {
      const newAttempts = loginAttempts + 1;

      const shouldBlock = newAttempts >= 3;

      set({
        loginAttempts: newAttempts,
        isBlocked: shouldBlock,
        blockedUntil: shouldBlock ? Date.now() + 5 * 60 * 1000 : null,
      });

      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () =>
    set({
      token: null,
      user: null,
      loginAttempts: 0,
      isBlocked: false,
      blockedUntil: null,
    }),
}));