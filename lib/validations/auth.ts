import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type loginSchemaType = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  firstname: z.string().min(1, "First Name is required"),
  lastname: z.string().min(1, "Last Name is required"),
  email: z.string().email(),
  phone: z.string().min(7),
  // password: z.string().min(8),
});

export type registerSchemaType = z.infer<typeof registerSchema>;

export const registerPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"], // where the error shows up
    message: "Passwords do not match",
  });

export type registerPasswordSchemaType = z.infer<typeof registerPasswordSchema>;
