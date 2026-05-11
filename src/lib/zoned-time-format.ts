/**
 * Format DB timestamps for display in a client's IANA time zone.
 */

export function isValidIanaTimeZone(tz: string): boolean {
  if (!tz || typeof tz !== "string" || tz.length > 120) return false;
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

export interface ZonedInstantParts {
  calendarDate: string;
  timeHm: string;
}

/** Parse Postgres / ISO-like timestamp; returns null if invalid. */
export function parseDbInstant(isoLike: string): Date | null {
  const d = new Date(isoLike);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

export function formatInstantInTimeZone(
  isoLike: string | null,
  timeZone: string
): ZonedInstantParts | null {
  if (!isoLike) return null;
  const instant = parseDbInstant(isoLike);
  if (!instant) return null;
  const dateParts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(instant);
  const y = dateParts.find((p) => p.type === "year")?.value;
  const mo = dateParts.find((p) => p.type === "month")?.value;
  const d = dateParts.find((p) => p.type === "day")?.value;
  if (!y || !mo || !d) return null;
  const timeParts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(instant);
  const hh = timeParts.find((p) => p.type === "hour")?.value ?? "00";
  const mm = timeParts.find((p) => p.type === "minute")?.value ?? "00";
  return {
    calendarDate: `${y}-${mo}-${d}`,
    timeHm: `${hh.padStart(2, "0")}:${mm.padStart(2, "0")}`,
  };
}
