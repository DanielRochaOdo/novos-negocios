import { spawnSync } from "node:child_process";

const acknowledgement = "SIM_CIENTE_DO_RISCO";
if (process.env.DB_PUSH_ALLOW !== acknowledgement) {
  console.error([
    "",
    "BLOQUEADO: drizzle-kit push pode excluir tabelas e registros.",
    "Já houve exclusão da tabela user_sessions durante uma sincronização de schema.",
    "Para criar/verificar user_sessions e routines sem perder dados: npm run db:ensure",
    "Para mudanças futuras, prefira migrações SQL aditivas e revisadas.",
    "Somente se tiver backup, revisar o SQL e aceitar o risco, execute:",
    "  DB_PUSH_ALLOW=SIM_CIENTE_DO_RISCO npm run db:push",
    ""
  ].join("\n"));
  process.exit(1);
}

console.warn("ATENÇÃO: push de schema autorizado. NÃO confirme DROP/DELETE/RENAME sem revisar.");
const command = process.platform === "win32" ? "npx.cmd" : "npx";
const result = spawnSync(command, ["drizzle-kit", "push"], {
  stdio: "inherit",
  shell: process.platform === "win32",
  env: process.env
});
if (result.error) {
  console.error("Falha ao iniciar drizzle-kit:", result.error.message);
  process.exit(1);
}
process.exit(result.status ?? 1);
