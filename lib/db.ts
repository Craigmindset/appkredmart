// Neon Postgres client (server-only). Real practice: singleton to avoid multiple connections.

import { neon } from "@neondatabase/serverless"
import { env } from "./env"

declare global {
  // eslint-disable-next-line no-var
  var __neon_sql__: ReturnType<typeof neon> | undefined
}

export function sql() {
  if (!globalThis.__neon_sql__) {
    globalThis.__neon_sql__ = neon(env().DATABASE_URL)
  }
  return globalThis.__neon_sql__!
}
