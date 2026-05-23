import * as SecureStore from "expo-secure-store";

export const storage = {
  setToken: (token: string) => {
    if (!token) throw new Error("TOKEN_IS_UNDEFINED");

    return SecureStore.setItemAsync("token", String(token));
  },

  getToken: () => SecureStore.getItemAsync("token"),

  removeToken: () => SecureStore.deleteItemAsync("token"),
};