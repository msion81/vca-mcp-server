import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema/index.js";
import { config } from "../config.js";

const sql = config.databaseUrl ? neon(config.databaseUrl) : null;
export const db = sql ? drizzle(sql, {
  schema,
  // Every query + its params would otherwise hit console.log on every single
  // call in production — real per-query overhead and query params ending up
  // in Vercel logs. Keep it for local dev only.
  logger: process.env.NODE_ENV !== "production",
}) : null;
export { schema };
