import { useAuthStore } from "@/src/auth/auth.store";
import { useEffect, useState } from "react";

export const useLoginBlockTimer = () => {
  const blockedUntil = useAuthStore((s) => s.blockedUntil);
  const isBlocked = useAuthStore((s) => s.isBlocked);

  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());

      if (
        isBlocked &&
        blockedUntil &&
        Date.now() > blockedUntil
      ) {
        useAuthStore.getState().resetAttempts();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isBlocked, blockedUntil]);

  const isActuallyBlocked =
    isBlocked && blockedUntil !== null && now < blockedUntil;

  const remainingTime = blockedUntil
    ? Math.max(0, Math.ceil((blockedUntil - now) / 1000))
    : 0;

  return { isActuallyBlocked, remainingTime };
};