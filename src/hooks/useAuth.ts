import { useEffect, useState } from "react";
import { storage } from "../services/storage.service";

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const t = await storage.getToken();
      setToken(t);
      setLoading(false);
    };

    load();
  }, []);

  return { token, loading };
};