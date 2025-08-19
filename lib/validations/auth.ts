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
  password: z.string().min(8),
});

export type registerSchemaType = z.infer<typeof registerSchema>;
