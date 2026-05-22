const MAX_ATTEMPTS = 3;
const BLOCK_TIME = 5 * 60 * 1000;

type SecurityState = {
  attempts: number;
  blockedUntil: number | null;
};

let state: SecurityState = {
  attempts: 0,
  blockedUntil: null,
};

export const authSecurity = {
  isBlocked: () => {
    if (!state.blockedUntil) return false;
    return Date.now() < state.blockedUntil;
  },

  registerFailed: () => {
    state.attempts += 1;

    if (state.attempts >= MAX_ATTEMPTS) {
      state.blockedUntil = Date.now() + BLOCK_TIME;
    }
  },

  reset: () => {
    state.attempts = 0;
    state.blockedUntil = null;
  },

  remainingTime: () => {
    if (!state.blockedUntil) return 0;
    return state.blockedUntil - Date.now();
  },
};