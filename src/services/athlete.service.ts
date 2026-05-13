import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { athlete, athleteSports, sports, athleteByUserProfileRole } from "../db/schema/index.js";
import type {
  AthleteGetByIdInput,
  AthleteSearchInput,
  AthleteWithSports,
  SportInfo,
} from "../schemas/athlete.js";
import type { ToolResponse } from "../types/responses.js";
import { success, error } from "../types/responses.js";
import { getAge } from "./athlete.utils.js";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

/**
 * If the caller puts a full name in `name` (e.g. "Debora Soledad") and omits `lastName`,
 * a single-field ILIKE would miss rows where DB has name="Debora" and lastName="Soledad".
 * When `lastName` is not provided, split on whitespace into first token + remainder.
 */
function resolveSearchNameFields(input: {
  name?: string;
  lastName?: string;
}): { name?: string; lastName?: string } {
  const rawLast = input.lastName?.trim();
  const rawName = input.name?.trim();
  if (!rawName) return { name: undefined, lastName: rawLast || undefined };
  if (rawLast) return { name: rawName, lastName: rawLast };

  const tokens = rawName.split(/\s+/).filter(Boolean);
  if (tokens.length <= 1) return { name: rawName, lastName: undefined };

  return {
    name: tokens[0],
    lastName: tokens.slice(1).join(" "),
  };
}

function toAthleteWithSports(
  row: {
    id: number;
    name: string;
    lastName: string;
    email: string;
    sex: string;
    phone: string;
    city: string | null;
    state: string | null;
    country: string;
    birthday: string | null;
    bodyWeight: number;
    height: number;
    metricSystemId: number;
    createdAt: string | null;
    updatedAt: string | null;
    socialNumber: string | null;
  },
  sportRows: { sportId: number; sportName: string; sportCode: string }[]
): AthleteWithSports {
  const sportsList: SportInfo[] = sportRows.map((s) => ({
    id: s.sportId,
    name: s.sportName,
    code: s.sportCode,
  }));
  return {
    ...row,
    sports: sportsList,
    age: getAge(row.birthday),
  };
}

export const athleteService = {
  getById: async (
    input: AthleteGetByIdInput
  ): Promise<ToolResponse<AthleteWithSports | null>> => {
    if (!db) {
      return error("Database not configured");
    }
    try {
      // Si hay coachId, validar que el coach tenga acceso a este atleta
      if (input.coachId != null) {
        const [accessRow] = await db
          .select({ athleteId: athleteByUserProfileRole.athleteId })
          .from(athleteByUserProfileRole)
          .where(and(
            eq(athleteByUserProfileRole.athleteId, input.id),
            eq(athleteByUserProfileRole.userRolesId, input.coachId),
            eq(athleteByUserProfileRole.active, 1)
          ))
          .limit(1);
        
        if (!accessRow) {
          // Coach no tiene acceso a este atleta
          return success(null);
        }
      }
      
      const [row] = await db
        .select()
        .from(athlete)
        .where(eq(athlete.id, input.id))
        .limit(1);
      if (!row) {
        return success(null);
      }
      const sportRows = await db
        .select({
          sportId: sports.id,
          sportName: sports.name,
          sportCode: sports.code,
        })
        .from(athleteSports)
        .innerJoin(sports, eq(athleteSports.sportId, sports.id))
        .where(eq(athleteSports.athleteId, input.id));
      const result = toAthleteWithSports(
        {
          id: row.id,
          name: row.name,
          lastName: row.lastName,
          email: row.email,
          sex: row.sex,
          phone: row.phone,
          city: row.city,
          state: row.state,
          country: row.country,
          birthday: row.birthday,
          bodyWeight: row.bodyWeight,
          height: row.height,
          metricSystemId: row.metricSystemId,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
          socialNumber: row.socialNumber,
        },
        sportRows
      );
      return success(result);
    } catch (err) {
      return error(
        err instanceof Error ? err.message : "Failed to get athlete"
      );
    }
  },

  search: async (
    input: AthleteSearchInput
  ): Promise<ToolResponse<AthleteWithSports[]>> => {
    if (!db) {
      return error("Database not configured");
    }
    try {
      const { name: searchName, lastName: searchLastName } =
        resolveSearchNameFields(input);

      // Debug log
      console.log('[athletes.search] Query filters:', {
        name: input.name,
        lastName: input.lastName,
        resolvedName: searchName,
        resolvedLastName: searchLastName,
        coachId: input.coachId,
        age: input.age,
        sex: input.sex,
        namePattern: searchName ? `%${searchName}%` : null,
      });

      const conditions = [];
      if (searchName) {
        // Buscar en AMBOS campos: name O lastName
        conditions.push(
          or(
            ilike(athlete.name, `%${searchName}%`),
            ilike(athlete.lastName, `%${searchName}%`)
          )
        );
      }
      if (searchLastName) {
        conditions.push(ilike(athlete.lastName, `%${searchLastName}%`));
      }
      if (input.email?.trim()) {
        conditions.push(ilike(athlete.email, `%${input.email.trim()}%`));
      }
      if (input.sex?.trim()) {
        conditions.push(ilike(athlete.sex, input.sex.trim()));
      }
      if (input.age != null) {
        conditions.push(
          sql`EXTRACT(YEAR FROM AGE(CURRENT_DATE, (${athlete.birthday})::date))::int = ${input.age}`
        );
      }
      
      const limit = Math.min(input.limit ?? DEFAULT_LIMIT, MAX_LIMIT);
      const hasSportFilter = input.sport?.trim();

      type AthleteRow = {
        id: number;
        name: string;
        lastName: string;
        email: string;
        sex: string;
        phone: string;
        city: string | null;
        state: string | null;
        country: string;
        birthday: string | null;
        bodyWeight: number;
        height: number;
        metricSystemId: number;
        createdAt: string | null;
        updatedAt: string | null;
        socialNumber: string | null;
      };

      let rows: AthleteRow[];
      if (hasSportFilter) {
        const sportCondition = or(
          ilike(sports.name, `%${hasSportFilter}%`),
          ilike(sports.code, `%${hasSportFilter}%`)
        );
        
        // Construir query base
        const baseQuery = db
          .select({
            id: athlete.id,
            name: athlete.name,
            lastName: athlete.lastName,
            email: athlete.email,
            sex: athlete.sex,
            phone: athlete.phone,
            city: athlete.city,
            state: athlete.state,
            country: athlete.country,
            birthday: athlete.birthday,
            bodyWeight: athlete.bodyWeight,
            height: athlete.height,
            metricSystemId: athlete.metricSystemId,
            createdAt: athlete.createdAt,
            updatedAt: athlete.updatedAt,
            socialNumber: athlete.socialNumber,
          })
          .from(athlete)
          .innerJoin(athleteSports, eq(athlete.id, athleteSports.athleteId))
          .innerJoin(sports, eq(athleteSports.sportId, sports.id));
        
        // Si hay coachId, agregar INNER JOIN con la tabla de relación
        let raw;
        if (input.coachId != null) {
          console.log('[athletes.search] Applying coach filter with INNER JOIN (sport filter case):', input.coachId);
          
          const coachConditions = [
            eq(athleteByUserProfileRole.userRolesId, input.coachId),
            eq(athleteByUserProfileRole.active, 1)
          ];
          const allConditions = [...conditions, sportCondition, ...coachConditions];
          const baseWhere = and(...allConditions);
          
          raw = await baseQuery
            .innerJoin(athleteByUserProfileRole, eq(athlete.id, athleteByUserProfileRole.athleteId))
            .where(baseWhere)
            .orderBy(desc(athlete.id))
            .limit(limit * 2);
        } else {
          const baseWhere = conditions.length > 0 ? and(...conditions, sportCondition) : sportCondition;
          raw = await baseQuery
            .where(baseWhere)
            .orderBy(desc(athlete.id))
            .limit(limit * 2);
        }
        const seen = new Set<number>();
        rows = [];
        for (const r of raw) {
          if (!seen.has(r.id)) {
            seen.add(r.id);
            rows.push(r);
            if (rows.length >= limit) break;
          }
        }
      } else {
        // Debug: Log the SQL query
        console.log('[athletes.search] Executing query with conditions:', conditions.length, 'filters');
        
        // Si hay coachId, hacemos INNER JOIN con la tabla de relación
        if (input.coachId != null) {
          console.log('[athletes.search] Applying coach filter with INNER JOIN:', input.coachId);
          
          const coachConditions = [
            eq(athleteByUserProfileRole.userRolesId, input.coachId),
            eq(athleteByUserProfileRole.active, 1)
          ];
          
          // Combinar condiciones del atleta con la del coach
          const allConditions = [...conditions, ...coachConditions];
          const baseWhere = allConditions.length > 0 ? and(...allConditions) : undefined;
          
          rows = await db
            .select({
              id: athlete.id,
              name: athlete.name,
              lastName: athlete.lastName,
              email: athlete.email,
              sex: athlete.sex,
              phone: athlete.phone,
              city: athlete.city,
              state: athlete.state,
              country: athlete.country,
              birthday: athlete.birthday,
              bodyWeight: athlete.bodyWeight,
              height: athlete.height,
              metricSystemId: athlete.metricSystemId,
              createdAt: athlete.createdAt,
              updatedAt: athlete.updatedAt,
              socialNumber: athlete.socialNumber,
            })
            .from(athlete)
            .innerJoin(athleteByUserProfileRole, eq(athlete.id, athleteByUserProfileRole.athleteId))
            .where(baseWhere)
            .orderBy(desc(athlete.id))
            .limit(limit);
        } else {
          console.log('[athletes.search] WARNING: No coach filter applied!');
          const baseWhere = conditions.length > 0 ? and(...conditions) : undefined;
          
          rows = await db
            .select({
              id: athlete.id,
              name: athlete.name,
              lastName: athlete.lastName,
              email: athlete.email,
              sex: athlete.sex,
              phone: athlete.phone,
              city: athlete.city,
              state: athlete.state,
              country: athlete.country,
              birthday: athlete.birthday,
              bodyWeight: athlete.bodyWeight,
              height: athlete.height,
              metricSystemId: athlete.metricSystemId,
              createdAt: athlete.createdAt,
              updatedAt: athlete.updatedAt,
              socialNumber: athlete.socialNumber,
            })
            .from(athlete)
            .where(baseWhere)
            .orderBy(desc(athlete.id))
            .limit(limit);
        }
          
        console.log('[athletes.search] Query returned:', rows.length, 'rows');
      }

      const results: AthleteWithSports[] = [];
      for (const row of rows) {
        const sportRows = await db
          .select({
            sportId: sports.id,
            sportName: sports.name,
            sportCode: sports.code,
          })
          .from(athleteSports)
          .innerJoin(sports, eq(athleteSports.sportId, sports.id))
          .where(eq(athleteSports.athleteId, row.id));
        results.push(
          toAthleteWithSports(
            {
              id: row.id,
              name: row.name,
              lastName: row.lastName,
              email: row.email,
              sex: row.sex,
              phone: row.phone,
              city: row.city,
              state: row.state,
              country: row.country,
              birthday: row.birthday,
              bodyWeight: row.bodyWeight,
              height: row.height,
              metricSystemId: row.metricSystemId,
              createdAt: row.createdAt,
              updatedAt: row.updatedAt,
              socialNumber: row.socialNumber,
            },
            sportRows
          )
        );
      }
      console.log('[athletes.search] Results:', {
        count: results.length,
        athleteIds: results.map(r => r.id)
      });
      return success(results);
    } catch (err) {
      return error(
        err instanceof Error ? err.message : "Failed to search athletes"
      );
    }
  },
};
