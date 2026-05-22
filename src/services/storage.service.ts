import * as SecureStore from "expo-secure-store";

export const storage = {
  setToken: (token: string) =>
    SecureStore.setItemAsync("token", token),

  getToken: () =>
    SecureStore.getItemAsync("token"),

  removeToken: () =>
    SecureStore.deleteItemAsync("token"),
};