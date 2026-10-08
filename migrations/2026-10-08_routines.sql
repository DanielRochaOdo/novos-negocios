-- Novos Negócios Odontoart - atividades de rotina (idempotente)
-- Aplicar no Neon SQL Editor somente se npm run db:push não tiver criado a tabela.
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
);
