import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema/index.js";
import { config } from "../config.js";

const sql = config.databaseUrl ? neon(config.databaseUrl) : null;
export const db = sql ? drizzle(sql, { 
  schema,
  logger: true // Enable SQL logging
}) : null;
export { schema };
