import { z } from "zod";

const login = z.object({
  email: z.email({ error: "A valid email is required!" }).toLowerCase(),
  password: z
    .string({ error: "Password is required!" })
    .min(1, { error: "Password is required!" }),
});

export const AuthValidation = {
  login,
};
