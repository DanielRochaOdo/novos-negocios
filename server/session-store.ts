import session, { type SessionData } from "express-session";
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL obrigatório");
}

const sql = neon(process.env.DATABASE_URL);
let readyPromise: Promise<void> | null = null;

function ensureTable() {
  if (!readyPromise) {
    readyPromise = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS user_sessions (
          sid varchar PRIMARY KEY,
          sess jsonb NOT NULL,
          expire timestamptz NOT NULL
        )
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS user_sessions_expire_idx
        ON user_sessions (expire)
      `;
    })();
  }
  return readyPromise;
}

function expiresAt(sess: SessionData) {
  const expires = sess.cookie?.expires;
  if (expires) return new Date(expires);
  const maxAge = sess.cookie?.maxAge;
  if (typeof maxAge === "number") return new Date(Date.now() + maxAge);
  return new Date(Date.now() + 24 * 60 * 60 * 1000);
}

class NeonSessionStore extends session.Store {
  get(sid: string, callback: (err: any, session?: SessionData | null) => void) {
    void (async () => {
      try {
        await ensureTable();
        const rows = await sql`
          SELECT sess
          FROM user_sessions
          WHERE sid = ${sid} AND expire > NOW()
          LIMIT 1
        `;
        if (!rows[0]) return callback(null, null);
        const raw = rows[0].sess as unknown;
        const value = typeof raw === "string" ? JSON.parse(raw) : raw;
        callback(null, value as SessionData);
      } catch (error) {
        callback(error);
      }
    })();
  }

  set(sid: string, sess: SessionData, callback?: (err?: any) => void) {
    void (async () => {
      try {
        await ensureTable();
        const expire = expiresAt(sess).toISOString();
        const payload = JSON.stringify(sess);
        await sql`
          INSERT INTO user_sessions (sid, sess, expire)
          VALUES (${sid}, ${payload}::jsonb, ${expire}::timestamptz)
          ON CONFLICT (sid)
          DO UPDATE SET sess = EXCLUDED.sess, expire = EXCLUDED.expire
        `;
        callback?.();
      } catch (error) {
        callback?.(error);
      }
    })();
  }

  destroy(sid: string, callback?: (err?: any) => void) {
    void (async () => {
      try {
        await ensureTable();
        await sql`DELETE FROM user_sessions WHERE sid = ${sid}`;
        callback?.();
      } catch (error) {
        callback?.(error);
      }
    })();
  }

  touch(sid: string, sess: SessionData, callback?: () => void) {
    void (async () => {
      try {
        await ensureTable();
        const expire = expiresAt(sess).toISOString();
        await sql`
          UPDATE user_sessions
          SET expire = ${expire}::timestamptz
          WHERE sid = ${sid}
        `;
      } finally {
        callback?.();
      }
    })();
  }
}

export const sessionStore = new NeonSessionStore();

export async function destroyUserSessions(userId: number, exceptSid?: string) {
  await ensureTable();
  if (exceptSid) {
    await sql`
      DELETE FROM user_sessions
      WHERE sess ->> 'userId' = ${String(userId)}
        AND sid <> ${exceptSid}
    `;
    return;
  }
  await sql`
    DELETE FROM user_sessions
    WHERE sess ->> 'userId' = ${String(userId)}
  `;
}
