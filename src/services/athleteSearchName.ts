import type { SQL } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { athlete } from "../db/schema/index.js";

/**
 * Latin diacritics → ASCII (one char → one char) for PostgreSQL translate()
 * and stripLatinAccents(). Pairs must stay in sync.
 */
const ACCENT_PAIRS: readonly (readonly [string, string])[] = [
  ["á", "a"],
  ["à", "a"],
  ["â", "a"],
  ["ã", "a"],
  ["ä", "a"],
  ["å", "a"],
  ["ā", "a"],
  ["ă", "a"],
  ["ą", "a"],
  ["ç", "c"],
  ["ć", "c"],
  ["č", "c"],
  ["ď", "d"],
  ["đ", "d"],
  ["é", "e"],
  ["è", "e"],
  ["ê", "e"],
  ["ë", "e"],
  ["ē", "e"],
  ["ĕ", "e"],
  ["ė", "e"],
  ["ę", "e"],
  ["ě", "e"],
  ["ğ", "g"],
  ["ǵ", "g"],
  ["í", "i"],
  ["ì", "i"],
  ["î", "i"],
  ["ï", "i"],
  ["ī", "i"],
  ["ĭ", "i"],
  ["į", "i"],
  ["ı", "i"],
  ["ĺ", "l"],
  ["ľ", "l"],
  ["ł", "l"],
  ["ń", "n"],
  ["ñ", "n"],
  ["ň", "n"],
  ["ó", "o"],
  ["ò", "o"],
  ["ô", "o"],
  ["õ", "o"],
  ["ö", "o"],
  ["ø", "o"],
  ["ō", "o"],
  ["ŏ", "o"],
  ["ő", "o"],
  ["ŕ", "r"],
  ["ř", "r"],
  ["ś", "s"],
  ["š", "s"],
  ["ş", "s"],
  ["ș", "s"],
  ["ť", "t"],
  ["ț", "t"],
  ["ú", "u"],
  ["ù", "u"],
  ["û", "u"],
  ["ü", "u"],
  ["ū", "u"],
  ["ŭ", "u"],
  ["ů", "u"],
  ["ű", "u"],
  ["ų", "u"],
  ["ý", "y"],
  ["ÿ", "y"],
  ["ź", "z"],
  ["ž", "z"],
  ["ż", "z"],
];

function buildTranslateStrings(): { from: string; to: string; charMap: Map<string, string> } {
  let from = "";
  let to = "";
  const charMap = new Map<string, string>();
  for (const [src, dest] of ACCENT_PAIRS) {
    if (src.length !== 1 || dest.length !== 1) {
      throw new Error("Each ACCENT_PAIRS entry must be single-character → single-character for translate()");
    }
    from += src;
    to += dest;
    charMap.set(src, dest);
  }
  if (from.length !== to.length) {
    throw new Error("translate from/to length mismatch");
  }
  return { from, to, charMap };
}

const { from: ACCENT_FROM, to: ACCENT_TO, charMap: ACCENT_CHAR_MAP } =
  buildTranslateStrings();

function sqlLiteralForTranslate(s: string): string {
  return `'${s.replace(/'/g, "''")}'`;
}

/** Lower + accent strip + œ→oe, ß→ss (matches stripLatinAccents). */
function sqlNormalizedLowerText(inner: SQL): SQL {
  const translated = sql`translate(${inner}, ${sql.raw(
    sqlLiteralForTranslate(ACCENT_FROM)
  )}, ${sql.raw(sqlLiteralForTranslate(ACCENT_TO))})`;
  return sql`replace(replace(${translated}, 'œ', 'oe'), 'ß', 'ss')`;
}

/** Normalized single column (lower). */
export function sqlTranslateLowerColumn(
  col: typeof athlete.name | typeof athlete.lastName
) {
  return sqlNormalizedLowerText(sql`lower(coalesce(${col}, ''))`);
}

/** Normalized full display name for free-text token AND. */
export function sqlAthleteFullNameNormalized() {
  return sqlNormalizedLowerText(
    sql`lower(coalesce(${athlete.name}, '') || ' ' || coalesce(${athlete.lastName}, ''))`
  );
}

/** SQL fragment: length of display name for ranking (shorter first). */
export function sqlAthleteDisplayNameLength() {
  return sql`length(coalesce(${athlete.name}, '') || coalesce(${athlete.lastName}, ''))`;
}

export function stripLatinAccents(input: string): string {
  const base = input.toLowerCase().replace(/œ/g, "oe").replace(/ß/g, "ss");
  let out = "";
  for (const ch of base) {
    out += ACCENT_CHAR_MAP.get(ch) ?? ch;
  }
  return out;
}

export function escapeIlikePattern(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
}

const MIN_TOKEN_LEN = 2;

/**
 * When `lastName` is omitted, `name` is free-text: whitespace tokens, accent-stripped,
 * tokens shorter than MIN_TOKEN_LEN dropped unless the whole query collapses to one short token.
 */
export function tokenizeNameQuery(raw: string): string[] {
  const normalized = raw.trim().replace(/\s+/g, " ");
  if (!normalized) return [];

  const pieces = normalized.split(/\s+/).filter(Boolean);
  const stripped = pieces.map((p) => stripLatinAccents(p));
  const longTokens = stripped.filter((t) => t.length >= MIN_TOKEN_LEN);
  if (longTokens.length > 0) return longTokens;

  const whole = stripLatinAccents(normalized);
  return whole.length > 0 ? [whole] : [];
}

export interface AthleteNameSearchSql {
  conditions: SQL[];
  useDisplayNameRanking: boolean;
}

/**
 * SQL fragments for athletes.search name matching.
 * - Both name + lastName: structured (first token in name OR lastName) AND (lastName column).
 * - Only name: free-text — every whitespace token must match normalized full name (AND).
 * - Only lastName: normalized last-name column partial match.
 */
export function buildAthleteNameSqlConditions(input: {
  name?: string;
  lastName?: string;
}): AthleteNameSearchSql {
  const nameRaw = input.name?.trim();
  const lastRaw = input.lastName?.trim();
  const conditions: SQL[] = [];

  if (nameRaw && lastRaw) {
    const n = stripLatinAccents(nameRaw);
    const l = stripLatinAccents(lastRaw);
    const nPat = `%${escapeIlikePattern(n)}%`;
    const lPat = `%${escapeIlikePattern(l)}%`;
    const nameNorm = sqlTranslateLowerColumn(athlete.name);
    const lastNorm = sqlTranslateLowerColumn(athlete.lastName);
    conditions.push(
      sql`(${nameNorm} ILIKE ${nPat} ESCAPE '\\' OR ${lastNorm} ILIKE ${nPat} ESCAPE '\\')`
    );
    conditions.push(sql`${lastNorm} ILIKE ${lPat} ESCAPE '\\'`);
    return { conditions, useDisplayNameRanking: true };
  }

  if (nameRaw && !lastRaw) {
    const tokens = tokenizeNameQuery(nameRaw);
    const fullNorm = sqlAthleteFullNameNormalized();
    for (const token of tokens) {
      const pat = `%${escapeIlikePattern(token)}%`;
      conditions.push(sql`${fullNorm} ILIKE ${pat} ESCAPE '\\'`);
    }
    return {
      conditions,
      useDisplayNameRanking: tokens.length > 0,
    };
  }

  if (!nameRaw && lastRaw) {
    const lastNorm = sqlTranslateLowerColumn(athlete.lastName);
    const l = stripLatinAccents(lastRaw);
    const lPat = `%${escapeIlikePattern(l)}%`;
    conditions.push(sql`${lastNorm} ILIKE ${lPat} ESCAPE '\\'`);
    return { conditions, useDisplayNameRanking: true };
  }

  return { conditions, useDisplayNameRanking: false };
}
