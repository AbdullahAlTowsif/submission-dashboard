import { z } from "zod";

const createUser = z.object({
  name: z
    .string({ error: "Name is required!" })
    .min(1, { error: "Name is required!" }),

  email: z
    .email({ error: "A valid Email is required!" }),

  password: z
    .string({ error: "Password is required!" })
    .min(6, { error: "Password must be at least 6 characters!" })
    .max(72, { error: "Password must be at most 72 characters!" }),
});


export const UserValidation = {
    createUser,
};
