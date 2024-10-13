import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";

import dotEnv from "dotenv";
import path from "path";

dotEnv.config({
    path: path.join(process.cwd(), "../.env"),
});

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis

const conn = globalForDb.conn ?? postgres(process.env.DATABASE_URL, {});
if (process.env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, { schema });