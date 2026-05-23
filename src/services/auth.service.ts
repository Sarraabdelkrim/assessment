import Toast from "react-native-toast-message";
import { storage } from "../services/storage.service";

const API_URL = process.env.EXPO_PUBLIC_API_URL;



export const authService = {
  login: async (data: { username: string; password: string }) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.username.trim(),
          password: data.password,
          expiresInMins: 30,
        }),
      });

      const text = await res.text();

      if (!res.ok) {
        let message = "Invalid credentials";

        try {
          const err = JSON.parse(text);
          message = err?.message || message;
        } catch {}

        // 🚨 TOAST ERROR ICI
        Toast.show({
          type: "error",
          text1: "Login failed",
          text2: message,
        });

        throw new Error(message);
      }

      const result = JSON.parse(text);


await storage.setToken(result.accessToken);
      Toast.show({
        type: "success",
        text1: "Welcome back",
        text2: result.firstName,
      });

      return {
        token: result.accessToken,
        user: {
          id: result.id,
          username: result.username,
          email: result.email,
          firstName: result.firstName,
          lastName: result.lastName,
          image: result.image,
        },
      };
    } catch (error: any) {
      

      if (!error.message.includes("Invalid")) {
        Toast.show({
          type: "error",
          text1: "Network error",
          text2: "Please try again later",
        });
      }

      throw error;
    }
  },

  logout: async () => {
    await storage.removeToken();
  },
};