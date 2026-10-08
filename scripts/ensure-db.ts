import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL não configurada. Nenhuma alteração foi realizada.");
}

const sql = neon(url);

// Migração aditiva: NUNCA executa DROP, TRUNCATE ou renomeação de tabelas.
await sql`
  CREATE TABLE IF NOT EXISTS public.user_sessions (
    sid varchar PRIMARY KEY,
    sess jsonb NOT NULL,
    expire timestamptz NOT NULL
  )
`;
await sql`
  CREATE INDEX IF NOT EXISTS user_sessions_expire_idx
  ON public.user_sessions (expire)
`;
await sql`
  CREATE TABLE IF NOT EXISTS public.routines (
    id SERIAL PRIMARY KEY,
    seller_id INTEGER NOT NULL REFERENCES public.users(id),
    title TEXT NOT NULL,
    kind TEXT NOT NULL DEFAULT 'INTERNA',
    notes TEXT,
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    google_event_id TEXT,
    cancelled BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`;

console.log("Concluído: tabelas user_sessions e routines verificadas/criadas, sem excluir registros.");
console.log("Atenção: sessões excluídas por uma migração anterior não são recuperadas por este comando.");
