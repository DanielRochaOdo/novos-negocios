# Novos Negócios Odontoart

CRM comercial da Odontoart com Dashboard, Agenda, Funil Kanban, Empresas, histórico, tags comerciais, acompanhamento de negociação, perfis Gestor/Vendedor e sincronização Google Calendar.

## Requisitos
Node 20+, PostgreSQL/Neon e credenciais OAuth do Google Calendar.

## Instalação
1. `npm install`
2. Copie `.env.example` para `.env` e preencha as variáveis.
3. `npm run db:push`
4. `npm run dev`

## Primeiro gestor
Com o banco vazio, faça uma única requisição `POST /api/auth/bootstrap` com JSON `{"name":"Gestor","email":"seu@email.com","password":"senha-forte"}`. Depois disso o endpoint recusa novos bootstraps.

## Regras implementadas
- Uma empresa possui no máximo um vendedor responsável; gestores não possuem carteira.
- Venda perdida libera a empresa; venda ganha só é liberada por gestor.
- Inativação do vendedor libera sua carteira sem apagar histórico.
- Visitas preservam histórico de reagendamento e bloqueiam choque de agenda.
- Duração é definida livremente pelo vendedor, sem bloqueio de dia/horário/feriado.
- Visitas e retornos são enviados ao Google Calendar do vendedor; timezone `America/Fortaleza`.
- Negociação registra proposta, follow-ups e prazo; prorrogação é individual e exclusiva do gestor.
- Tags comerciais são criadas pelo gestor e mantêm histórico independente dos status do sistema.

## Produção
Execute `npm run build` e `npm start`. Configure `GOOGLE_REDIRECT_URI` para o domínio real e cadastre a mesma URI no Google Cloud Console.
