import { storage } from "../services/storage.service";
import { AuthResponse, Login } from "./auth.types";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const authService = {
  login: async (data: Login): Promise<AuthResponse> => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Invalid credentials");
    }

    const result = await res.json();

    await storage.setToken(result.token);

    return result;
  },

  logout: async () => {
    await storage.removeToken();
  },
};