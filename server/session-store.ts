import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { Pool } from "pg";

const PgStore = connectPgSimple(session);
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const sessionStore = new PgStore({
  pool,
  tableName: "user_sessions",
  createTableIfMissing: true,
});
