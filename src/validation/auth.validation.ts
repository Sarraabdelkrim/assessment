import { z } from "zod";

export const loginSchema = (t: (key: string) => string) =>
  z.object({
    username: z.string().min(1, t("login.required")),
    password: z.string().min(1, t("login.required")),
  });

export type LoginFormData = {
  username: string;
  password: string;
};