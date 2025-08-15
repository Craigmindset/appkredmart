// Centralized environment validation and access
// Real practice: validate once and use typed access everywhere.

import { z } from "zod"

const EnvSchema = z.object({
  // Database (Neon)
  DATABASE_URL: z.string().url().describe("Postgres connection string from Neon"),

  // Auth
  JWT_SECRET: z.string().min(32).describe("JWT secret for signing session tokens"),

  // Email provider (optional placeholder)
  RESEND_API_KEY: z.string().optional(),

  // Caching / KV (optional placeholder)
  UPSTASH_KV_REST_API_URL: z.string().optional(),
  UPSTASH_KV_REST_API_TOKEN: z.string().optional(),

  // Public site URL
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
})

type Env = z.infer<typeof EnvSchema>

let _env: Env | null = null

export function env(): Env {
  if (_env) return _env
  const parsed = EnvSchema.safeParse(process.env)
  if (!parsed.success) {
    // During local/dev: make the error helpful.
    console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors)
    throw new Error(
      "Invalid environment variables. Please set them in Vercel Project Settings > Environment Variables.",
    )
  }
  _env = parsed.data
  return _env
}
