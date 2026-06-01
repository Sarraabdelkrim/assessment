import { TokenSecurity } from "@/src/security/token.security";
import { useAuthStore } from "@/src/store/auth/auth.store";
import axios from "axios";


export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});



// objectif : ajouter automatiquement le token
 
api.interceptors.request.use(
  async (config) => {
    // récupérer le token stocké dans SecureStore
    const token = await TokenSecurity.getToken();

    // si token existe ====> on l'ajoute dans le header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


 //objectif : gérer les erreurs globales 
 
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;

    // si token expiré ou invalide
    if (status === 401) {
      console.log("Token expiré → logout automatique");

      // supprimer le token du storage
      await TokenSecurity.removeToken();

      // reset du store auth (logout global)
      useAuthStore.getState().logout();
    }

    return Promise.reject(error);
  }
);