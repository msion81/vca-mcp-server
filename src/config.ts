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
} as const;
