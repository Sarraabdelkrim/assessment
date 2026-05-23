import { authService } from "@/src/services/auth.service";
import { storage } from "@/src/services/storage.service";
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

  loginAttempts: number;
  isBlocked: boolean;
  blockedUntil: number | null;

  login: (data: { username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
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

  hydrate: async () => {
    const token = await storage.getToken();

    if (token) {
      set({ token });
    }
  },

  
  login: async (data) => {
    const { loginAttempts, isBlocked, blockedUntil } = get();

    console.log("🔐 LOGIN ATTEMPT:", data);

    
    if (isBlocked && blockedUntil && Date.now() < blockedUntil) {
      throw new Error("ACCOUNT_TEMPORARILY_BLOCKED");
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

      const { token, user } = await authService.login(data);

      await storage.setToken(token);


      set({
        token,
        user,
        loginAttempts: 0,
        isBlocked: false,
        blockedUntil: null,
      });

    } catch (error) {
      const attempts = loginAttempts + 1;

      const shouldBlock = attempts >= 3;

      //console.log("❌ LOGIN FAILED");

      set({
        loginAttempts: attempts,
        isBlocked: shouldBlock,
        blockedUntil: shouldBlock
          ? Date.now() + 5 * 60 * 1000
          : null,
      });

      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

 
  logout: async () => {
    await storage.removeToken();

    set({
      token: null,
      user: null,
      loginAttempts: 0,
      isBlocked: false,
      blockedUntil: null,
    });
  },
}));