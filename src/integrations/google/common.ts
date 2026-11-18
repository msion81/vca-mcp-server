/**
 * Google OAuth token refresh, mirroring vca-server's integrations/google/common.ts
 * (refreshGoogleTokenFromString path) — mcp-server has no live NextAuth session, so it
 * always exchanges the persisted refresh token from `external_calendar.google_refresh_token`.
 */
import { config } from "../../config.js";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

export async function refreshGoogleAccessToken(
  refreshToken: string
): Promise<string | null> {
  const clientId = config.googleClientId;
  const clientSecret = config.googleClientSecret;
  if (!clientId || !clientSecret) {
    console.error(
      "[google.common] GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET not configured"
    );
    return null;
  }

  try {
    const response = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
      signal: AbortSignal.timeout(15_000),
    });

    const tokens = (await response.json()) as { access_token?: unknown };
    if (!response.ok) {
      console.error("[google.common] Failed to refresh access token", tokens);
      return null;
    }
    return typeof tokens.access_token === "string" ? tokens.access_token : null;
  } catch (err) {
    console.error("[google.common] Error refreshing access token", err);
    return null;
  }
}
