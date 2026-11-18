/**
 * Google Calendar sync for appointments created/updated by the agent.
 *
 * Mirrors vca-server's src/integrations/google/calendar.ts (same REST endpoints, same
 * event shape, same silent-failure contract), adapted to mcp-server's model: there is no
 * live NextAuth session here (this runs from an MCP tool call, not an authenticated HTTP
 * request), so the access token always comes from exchanging the coach's persisted
 * `external_calendar.google_refresh_token` — the same path vca-server's hourly
 * calendar-sync cron uses for the same reason.
 *
 * Every exported function swallows its own errors (network, timeout, missing calendar,
 * non-2xx) and resolves to null/void — appointment writes in appointment.service.ts never
 * block or fail because of a Google Calendar problem.
 */
import { and, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { athlete, externalCalendar } from "../../db/schema/index.js";
import { refreshGoogleAccessToken } from "./common.js";

const GOOGLE_API_URL = "https://www.googleapis.com/calendar/v3";

export type GoogleCalendarAppointment = {
  id: number;
  athleteId: number | null;
  startDate: string;
  endDate: string;
  status: string | null;
  description: string | null;
  optCode?: string | null;
  metadata?: { googleMeetConference?: boolean } | null;
};

type CalendarEventResponse = {
  id: string;
  hangoutLink?: string;
  [key: string]: unknown;
};

type CalendarEventBody = {
  summary: string;
  description: string;
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
  status: string;
  attendees: { email: string }[];
  sendUpdates: string;
  conferenceData?: { createRequest: { requestId: string } } | null;
};

/**
 * Drizzle's `timestamp({ mode: 'string' })` columns round-trip as Postgres's native
 * "YYYY-MM-DD HH:MM:SS" string (space separator, no zone suffix) rather than ISO 8601 —
 * the same naive-UTC quirk appointment.service.ts already accounts for when formatting
 * display times (see its `sqlWallClockInClientZone` comment). Google's Calendar API
 * requires RFC3339, so reshape that naive string into an explicit UTC instant.
 */
function toRfc3339Utc(raw: string): string {
  const trimmed = raw.trim();
  const iso = trimmed.includes("T") ? trimmed : trimmed.replace(" ", "T");
  if (/[zZ]$/.test(iso) || /[+-]\d{2}:\d{2}$/.test(iso)) return iso;
  return `${iso}Z`;
}

async function buildCalendarEvent(
  appt: GoogleCalendarAppointment,
  timeZone: string
): Promise<CalendarEventBody> {
  let summary = appt.description ?? "";
  let description = appt.description ?? "";
  const attendees: { email: string }[] = [];

  if (appt.athleteId != null && db) {
    const [a] = await db
      .select({ name: athlete.name, lastName: athlete.lastName, email: athlete.email })
      .from(athlete)
      .where(eq(athlete.id, appt.athleteId))
      .limit(1);
    if (a) {
      summary = `${a.name} ${a.lastName} - Sesión`;
      attendees.push({ email: a.email });
    }
  }

  if (appt.optCode) {
    description = `${description}\n\nIngresa a https://athlevo.com.ar/anamnesis \n con el código de acceso: ${appt.optCode}`;
  }

  // mcp-server only ever writes status "confirmed" | "cancelled" (appointmentWritableStatusSchema),
  // so unlike vca-server there is no "pending" → "tentative" case to map here.
  const status = appt.status === "cancelled" ? "cancelled" : "confirmed";

  // No sendNotification input exists yet on the agent's create/update tools, so default to
  // "none" (never email the athlete) rather than inventing an opt-in that isn't there.
  const sendUpdates = "none";

  const conferenceData = appt.metadata?.googleMeetConference
    ? { createRequest: { requestId: `athlevo-invite-${appt.id}` } }
    : null;

  return {
    summary,
    description,
    start: { dateTime: toRfc3339Utc(appt.startDate), timeZone },
    end: { dateTime: toRfc3339Utc(appt.endDate), timeZone },
    status,
    attendees,
    sendUpdates,
    conferenceData,
  };
}

async function getActiveCalendarWithToken(
  coachId: number
): Promise<{ calendarId: string; accessToken: string } | null> {
  if (!db) return null;

  const [row] = await db
    .select({
      calendarId: externalCalendar.calendarId,
      googleRefreshToken: externalCalendar.googleRefreshToken,
    })
    .from(externalCalendar)
    .where(
      and(eq(externalCalendar.userRolesId, coachId), eq(externalCalendar.active, 1))
    )
    .limit(1);

  if (!row?.calendarId || !row.googleRefreshToken) return null;

  const accessToken = await refreshGoogleAccessToken(row.googleRefreshToken);
  if (!accessToken) return null;

  return { calendarId: row.calendarId, accessToken };
}

export async function createGoogleCalendarEvent(
  coachId: number,
  appt: GoogleCalendarAppointment,
  timeZone: string
): Promise<CalendarEventResponse | null> {
  const target = await getActiveCalendarWithToken(coachId);
  if (!target) return null;

  const bodyEvent = await buildCalendarEvent(appt, timeZone);
  const url = new URL(
    `${GOOGLE_API_URL}/calendars/${encodeURIComponent(target.calendarId)}/events`
  );
  url.searchParams.set("conferenceDataVersion", "1");
  url.searchParams.set("sendUpdates", bodyEvent.sendUpdates);

  try {
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${target.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyEvent),
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) {
      console.error(
        "[google.calendar] Failed to create event",
        response.status,
        await response.text()
      );
      return null;
    }
    return (await response.json()) as CalendarEventResponse;
  } catch (err) {
    console.error("[google.calendar] Error creating event (network/timeout)", err);
    return null;
  }
}

export async function updateGoogleCalendarEvent(
  coachId: number,
  eventId: string,
  appt: GoogleCalendarAppointment,
  timeZone: string
): Promise<CalendarEventResponse | null> {
  const target = await getActiveCalendarWithToken(coachId);
  if (!target) return null;

  const bodyEvent = await buildCalendarEvent(appt, timeZone);
  const url = new URL(
    `${GOOGLE_API_URL}/calendars/${encodeURIComponent(target.calendarId)}/events/${encodeURIComponent(eventId)}`
  );
  url.searchParams.set("conferenceDataVersion", "1");
  url.searchParams.set("sendUpdates", bodyEvent.sendUpdates);

  try {
    const response = await fetch(url.toString(), {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${target.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyEvent),
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) {
      console.error(
        "[google.calendar] Failed to update event",
        response.status,
        await response.text()
      );
      return null;
    }
    return (await response.json()) as CalendarEventResponse;
  } catch (err) {
    console.error("[google.calendar] Error updating event (network/timeout)", err);
    return null;
  }
}

export async function deleteGoogleCalendarEvent(
  coachId: number,
  eventId: string
): Promise<void> {
  const target = await getActiveCalendarWithToken(coachId);
  if (!target) return;

  try {
    const response = await fetch(
      `${GOOGLE_API_URL}/calendars/${encodeURIComponent(target.calendarId)}/events/${encodeURIComponent(eventId)}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${target.accessToken}` },
        signal: AbortSignal.timeout(15_000),
      }
    );
    // 410 Gone means it's already deleted on Google's side — not an error for us.
    if (!response.ok && response.status !== 410) {
      console.error("[google.calendar] Failed to delete event", response.status);
    }
  } catch (err) {
    console.error("[google.calendar] Error deleting event (network/timeout)", err);
  }
}
