import { and, asc, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
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
import {
  buildAthleteNameSqlConditions,
  sqlAthleteDisplayNameLength,
} from "./athleteSearchName.js";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

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
      const { conditions: nameConditions, useDisplayNameRanking } =
        buildAthleteNameSqlConditions(input);

      const conditions = [...nameConditions];
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

      const orderByRanking = useDisplayNameRanking
        ? [asc(sqlAthleteDisplayNameLength()), desc(athlete.id)]
        : [desc(athlete.id)];

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
          const coachConditions = [
            eq(athleteByUserProfileRole.userRolesId, input.coachId),
            eq(athleteByUserProfileRole.active, 1)
          ];
          const allConditions = [...conditions, sportCondition, ...coachConditions];
          const baseWhere = and(...allConditions);
          
          raw = await baseQuery
            .innerJoin(athleteByUserProfileRole, eq(athlete.id, athleteByUserProfileRole.athleteId))
            .where(baseWhere)
            .orderBy(...orderByRanking)
            .limit(limit * 2);
        } else {
          const baseWhere = conditions.length > 0 ? and(...conditions, sportCondition) : sportCondition;
          raw = await baseQuery
            .where(baseWhere)
            .orderBy(...orderByRanking)
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
        // Si hay coachId, hacemos INNER JOIN con la tabla de relación
        if (input.coachId != null) {
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
            .orderBy(...orderByRanking)
            .limit(limit);
        } else {
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
            .orderBy(...orderByRanking)
            .limit(limit);
        }
      }

      const athleteIds = rows.map((row) => row.id);
      const sportRowsByAthleteId = new Map<
        number,
        { sportId: number; sportName: string; sportCode: string }[]
      >();
      if (athleteIds.length > 0) {
        const allSportRows = await db
          .select({
            athleteId: athleteSports.athleteId,
            sportId: sports.id,
            sportName: sports.name,
            sportCode: sports.code,
          })
          .from(athleteSports)
          .innerJoin(sports, eq(athleteSports.sportId, sports.id))
          .where(inArray(athleteSports.athleteId, athleteIds));
        for (const r of allSportRows) {
          if (r.athleteId == null) continue;
          const list = sportRowsByAthleteId.get(r.athleteId) ?? [];
          list.push(r);
          sportRowsByAthleteId.set(r.athleteId, list);
        }
      }

      const results: AthleteWithSports[] = rows.map((row) =>
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
          sportRowsByAthleteId.get(row.id) ?? []
        )
      );
      return success(results);
    } catch (err) {
      return error(
        err instanceof Error ? err.message : "Failed to search athletes"
      );
    }
  },
};
