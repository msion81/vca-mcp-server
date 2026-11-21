/**
 * Server and app config from environment.
 * Load .env via dotenv in the entrypoint (server.ts) so this stays isolated.
 */
function getEnv(key: string, fallback: string): string {
  const value = process.env[key];
  return value !== undefined && value !== "" ? value : fallback;
}

export const config = {
  port: Number(getEnv("PORT", "3002")),
  databaseUrl: getEnv("DATABASE_URL", ""),
  allowedHosts: getEnv("ALLOWED_HOSTS", "").split(",").filter(Boolean),
  /** Same Google OAuth app credentials vca-server uses — reused, not a separate Google Cloud app. */
  googleClientId: getEnv("GOOGLE_CLIENT_ID", ""),
  googleClientSecret: getEnv("GOOGLE_CLIENT_SECRET", ""),
  /** Shared secret for internal callers (Tania agent + AthlEvo Connect). Empty = skip check (local dev). */
  internalKey: getEnv("INTERNAL_KEY", ""),
} as const;
