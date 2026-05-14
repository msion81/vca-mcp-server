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

/** True if the string ends with Z or a numeric UTC offset. */
function hasExplicitUtcOffsetOrZ(s: string): boolean {
  return /[zZ]$|[+-]\d{2}:?\d{2}$/.test(s.trim());
}

/**
 * Parse values from Postgres `timestamp without time zone` (Drizzle `mode: "string"`).
 * Those instants are stored as **UTC wall clock** in this codebase (see appointment SQL:
 * `(column AT TIME ZONE 'UTC')`). A string like `2026-05-14 15:30:00` has **no** offset; ECMAScript
 * may interpret it as **local** time of the Node process, which breaks coach TZ formatting.
 * Naive strings are therefore parsed as UTC by appending `Z` after normalizing `T` separator.
 */
export function parseDbInstant(isoLike: string | Date): Date | null {
  if (isoLike instanceof Date) {
    if (Number.isNaN(isoLike.getTime())) return null;
    return isoLike;
  }

  const raw = String(isoLike).trim();
  if (!raw) return null;

  if (hasExplicitUtcOffsetOrZ(raw)) {
    const d = new Date(raw);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  const withT = raw.includes("T") ? raw : raw.replace(" ", "T");
  const asUtc = new Date(`${withT}Z`);
  if (!Number.isNaN(asUtc.getTime())) return asUtc;

  const fallback = new Date(raw);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
}

export function formatInstantInTimeZone(
  isoLike: string | Date | null,
  timeZone: string
): ZonedInstantParts | null {
  if (isoLike == null) return null;
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
