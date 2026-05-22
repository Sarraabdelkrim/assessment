export type Login = {
  username: string;
  password: string;
};

export type AuthResponse = {
  token: string;
  user: {
    id: string;
    username: string;
  };
};

export type AuthState = {
  token: string | null;
  isLoading: boolean;
};