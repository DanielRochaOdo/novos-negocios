# AGENTS.md — Novos Negócios Odontoart

> Fonte de verdade funcional e visual para qualquer agente que altere este repositório.
> Antes de corrigir, implementar, refatorar ou revisar qualquer parte do sistema, LEIA ESTE ARQUIVO INTEIRO.
> Não considerar uma tela concluída apenas porque renderiza. Validar fluxo completo frontend → API → Neon → Google Calendar quando aplicável.
> Não substituir regras abaixo por decisões automáticas ou simplificações sem aprovação do usuário.

## 1. Produto

Nome: **Novos Negócios Odontoart**.

CRM comercial com dinâmica semelhante ao VendorCRM, voltado ao fluxo:
**prospecção → agendamento → negociação/proposta → acompanhamento → decisão final**.

Módulos:
- Dashboard
- Agenda
- Funil de Vendas (Kanban)
- Empresas
- Configurações (Gestor)

Existe somente uma Agenda. Qualquer duplicação anterior no documento original era erro de redação.

Timezone canônico de TODO o sistema: **America/Fortaleza**.
Banco: PostgreSQL/Neon.
Frontend: React + Vite + TypeScript.
Backend: Express + TypeScript.
ORM: Drizzle.
Google Calendar é integração central, não opcional no desenho do produto.

## 2. Referência visual obrigatória

O conjunto de 10 telas aprovado pelo usuário é a referência visual oficial. NÃO redesenhar livremente.

Características obrigatórias:
- sidebar esquerda azul-marinho escuro;
- no topo da sidebar usar o lockup completo **Odontoart / Novos Negócios**: bloco verde com a marca oficial à esquerda + textos “Odontoart” e “Novos Negócios” à direita, sobre o fundo azul-marinho; o nome do sistema nunca pode desaparecer; usar como asset interno da marca `https://i0.wp.com/odontoart.com/wp-content/uploads/2024/03/odontoart%405x.png?fit=768%2C261&ssl=1`;
- marca Odontoart / Novos Negócios no topo;
- fundo principal branco/cinza muito claro;
- azul como cor primária de botões e navegação ativa;
- cards arredondados com bordas/sombras sutis;
- tags compactas e coloridas;
- tipografia moderna, limpa e compacta;
- espaçamento eficiente;
- Dashboard com cards, gráfico de barras e donut;
- Agenda com aparência de calendário profissional;
- Kanban com colunas coloridas;
- **mobile-first**, com experiência desktop expandida sem descaracterizar a referência.


### Login
- a tela de Login deve reutilizar o mesmo lockup completo Odontoart / Novos Negócios;
- manter apresentação premium/profissional, com painel institucional azul-marinho, bloco verde da marca, hierarquia forte e formulário claro em card branco;
- evitar login genérico ou aparência de template cru.
- a identidade premium aprovada no Login (azul-marinho institucional, verde Odontoart, superfícies brancas, sombras suaves, cantos arredondados e hierarquia tipográfica forte) deve ser aplicada de forma consistente ao restante do sistema, sem descaracterizar as telas aprovadas.

Telas visuais aprovadas:
1. Login.
2. Dashboard do vendedor.
3. Funil de Vendas/Kanban.
4. Agenda semanal.
5. Agenda diária.
6. Detalhe/registro da visita.
7. Empresa — visão geral.
8. Registrar acompanhamento.
9. Pesquisa de empresas.
10. Configurações — Tags e Regras.

Ao alterar UI, comparar explicitamente com essa referência. Funcionalidade não justifica abandonar o layout aprovado.

### Tema escuro e sidebar
- o sistema autenticado usa **tema escuro por padrão**, preservando a identidade Odontoart (azul-marinho, azul de ação e verde institucional);
- entre o bloco do usuário e o botão **Sair** na sidebar deve existir um controle Sun/Moon para alternar entre tema escuro e claro;
- o tema escolhido deve ser persistido localmente no navegador e restaurado nas próximas visitas;
- superfícies, calendário, Kanban, formulários, tabelas, Perfil e Configurações precisam ter contraste adequado no modo escuro;
- a sidebar inicia **colapsada por padrão** em novos navegadores/sessões;
- o usuário pode expandir/recolher a sidebar por um controle explícito;
- a preferência de sidebar pode ser preservada localmente no navegador;
- quando colapsada, mostrar ícones, marca e tooltips/títulos suficientes para manter a navegação compreensível;
- o colapso deve reduzir fisicamente a largura da sidebar em **ambos os temas** (claro e escuro), sem manter uma faixa vazia larga; ícones, avatar e ações ficam centralizados em botões compactos;
- em telas pequenas, a sidebar permanece compacta.

### Referência visual mobile aprovada
- a composição mobile gerada e aprovada nesta conversa passa a ser a referência visual oficial para smartphones;
- ela contém somente módulos e ações existentes no produto: Login, Dashboard, Agenda, Funil de Vendas, Empresa e Visita;
- Login mobile é uma coluna, com marca/hero e formulário legível, nunca duas colunas desktop reduzidas;
- Dashboard mobile usa KPIs em 2 colunas, gráficos empilhados e navegação inferior;
- Agenda mobile usa Dia como visão principal com cards de Visita/Retorno e mantém Dia/Semana/Mês/Lista;
- Funil mobile usa seletor das 5 etapas no topo e exibe os cards da etapa ativa; mudança de estágio por toque usa “Mover para...” e as mesmas validações do desktop;
- Empresa e Visita são fluxos verticais, com ações grandes e informações reais já disponíveis no sistema;
- não adicionar no mobile elementos fictícios, dados inventados ou ações que não possam ser reproduzidas pela implementação real.

### Mobile-first operacional
- cerca de **90% do uso previsto é via celular**; toda alteração de UI deve ser validada primeiro em viewport mobile e depois em desktop;
- breakpoint principal de smartphone: até 760px, com suporte mínimo a 320px de largura;
- no mobile, a sidebar desktop é substituída por cabeçalho compacto e navegação inferior fixa para Dashboard, Agenda, Funil, Empresas e Configurações quando aplicável;
- Perfil, alternância de tema e logout permanecem acessíveis no topo mobile;
- botões e alvos de toque devem ter aproximadamente 44px ou mais sempre que possível;
- inputs no mobile devem evitar zoom automático do navegador;
- Dashboard deve reorganizar KPIs e gráficos sem cortar conteúdo;
- Agenda deve abrir em **Dia** por padrão no celular; Semana e Mês permanecem acessíveis com rolagem horizontal controlada;
- Funil no celular deve permitir navegação horizontal por swipe e não pode depender exclusivamente de drag-and-drop, pois toque não oferece DnD HTML5 confiável; cada card deve oferecer ação de mover estágio por toque, preservando as mesmas validações comerciais;
- cards de Empresas, detalhes de Empresa, Visita, Acompanhamento, Perfil e formulários devem usar uma coluna ou grade compacta adaptativa;
- abas extensas devem rolar horizontalmente sem estourar o viewport;
- tabelas administrativas podem usar rolagem horizontal interna, nunca provocar scroll horizontal da página inteira;
- considerar safe-area de iPhone/Android para barras fixas;
- nenhuma tela pode exigir zoom manual para leitura, edição ou ação principal.

### Lembrar de mim
- o checkbox **Lembrar de mim** deve ter efeito real no backend;
- marcado: sessão autenticada com expiração de 30 dias, persistida no PostgreSQL/Neon para sobreviver a reinícios do servidor;
- desmarcado: sessão de navegador;
- não persistir credenciais sensíveis no frontend para implementar essa função.

## 3. Perfis e permissões

### Gestor
- vê todas as empresas, visitas, retornos e vendedores;
- vê Kanban global e pode filtrar por vendedor;
- gerencia usuários;
- pode alterar e-mail/senha conforme regras da aplicação;
- usuários nunca são excluídos: apenas inativados/reativados;
- pode criar/editar empresas;
- pode criar, editar e reagendar compromissos de vendedores;
- ao criar visita, escolhe o vendedor responsável;
- qualquer alteração do Gestor em agenda/carteira deve ser auditada como ação do Gestor;
- pode reatribuir empresas;
- somente Gestor libera uma empresa em Venda Ganha para nova prospecção;
- pode prorrogar prazo de uma negociação específica;
- Gestor NÃO possui carteira comercial. Se quiser vender, precisa de login separado como Vendedor.

### Vendedor
- vê e gerencia sua própria carteira;
- cria empresas/prospects respeitando validação de duplicidade e disponibilidade;
- cria e gerencia suas próprias visitas;
- vê sua própria Agenda e Kanban;
- não pode excluir empresas;
- pode assumir empresa disponível conforme regras de posse;
- não pode tomar empresa pertencente a outro vendedor ativo.

## 4. Empresa, oportunidade e posse

- Uma empresa possui no máximo **uma oportunidade/ciclo comercial**.
- Não criar múltiplas oportunidades paralelas para a mesma empresa.
- Uma empresa/oportunidade pode ter múltiplas visitas.
- Empresa pertence a exatamente um vendedor por vez quando há responsável.
- Visitas e histórico são múltiplos e permanentes.
- Não apagar histórico comercial.
- Venda Ganha permanece associada ao vendedor e bloqueada até liberação pelo Gestor.
- Venda Perdida volta a ficar disponível para o primeiro vendedor que a assumir.
- Empresa sem responsável por inativação do vendedor fica disponível.
- Gestor pode reatribuir empresa sem responsável para vendedor ativo.

### Inativação
- usuário não é apagado;
- histórico continua atribuído ao usuário original;
- empresas do vendedor inativado devem ficar disponíveis/sem responsável;
- antes de reatribuição manual do Gestor, outro vendedor pode assumir uma empresa liberada;
- Dashboard do Gestor deve poder sinalizar empresas sem responsável.

## 5. Busca, duplicidade e disponibilidade

Antes de criar empresa ou visita, pesquisar empresa existente e mostrar contexto.

Estados esperados:
- inexistente → criar; vendedor vira proprietário; estágio Prospecção;
- existente e do próprio vendedor → permitir continuar;
- existente de outro vendedor ativo → bloquear tomada e mostrar contexto;
- sem responsável / vendedor inativo → disponível para assumir;
- Venda Perdida → disponível para nova prospecção/claim;
- Venda Ganha → bloqueada até Gestor liberar.

Mostrar tags de sistema/estado durante busca e agendamento para que o usuário entenda a situação.

CNPJ é identificador forte de duplicidade.
Não inventar regra agressiva de duplicidade sem CNPJ sem aprovação específica.

## 6. Tags

Existem DOIS conceitos separados.

### Tags automáticas de sistema
Exemplos:
- PROSPECÇÃO
- AGENDAMENTO
- NEGOCIAÇÃO
- VENDA GANHA
- VENDA PERDIDA
- REMARCADA
- SEM RESPONSÁVEL
- RETORNO ATRASADO
- PRAZO DE NEGOCIAÇÃO / crítico

São derivadas do estado do sistema.

### Tags comerciais/origem
- criadas/configuradas somente pelo Gestor;
- empresa pode possuir várias;
- nova tag NÃO substitui antiga;
- preservar histórico de quem adicionou e quando;
- UI mostra as 2 mais recentes e +N/histórico quando houver mais;
- independentes das tags automáticas.

Exemplos apenas ilustrativos: Indicação, Instagram, Evento, Prospecção ativa, Parceiro.

## 7. Funil de Vendas / Kanban

Colunas:
1. Prospecção
2. Agendamento
3. Negociação
4. Venda Ganha
5. Venda Perdida

Card representa empresa/ciclo comercial.

Regras:
- empresa criada → Prospecção;
- visita criada → Agendamento;
- visita remarcada → continua Agendamento; visita antiga recebe estado/tag Remarcada;
- proposta entregue → Negociação;
- venda ganha → Venda Ganha;
- venda perdida → Venda Perdida.

Kanban deve refletir imediatamente alterações feitas na Agenda/Empresa.
Se o usuário mover card diretamente, executar as MESMAS validações/formulários do fluxo de Agenda. Não permitir arrastar para Venda Ganha sem dados obrigatórios.
Gestor deve conseguir filtrar por vendedor.

## 8. Agenda

É o centro de atividades datadas.

Tipos de evento:
- **VISITA**: compromisso comercial formal.
- **RETORNO**: follow-up de negociação.

Reagendamento NÃO é terceiro tipo de evento. É resultado de uma visita antiga e cria nova VISITA.

### Visualizações
- Dia
- Semana
- Mês
- Lista

Todas devem funcionar, não apenas renderizar botões.

Vendedor vê seus compromissos.
Gestor vê todos e deve poder filtrar por vendedor e por Visita/Retorno.

### Criar visita
Campos/conceitos:
- vendedor (quando Gestor está criando);
- empresa;
- data/hora inicial;
- duração/horário final conforme escolha do vendedor.

**Não existe duração fixa obrigatória de 60 minutos.**
A duração é definida pelo vendedor em cada compromisso.
Se a UI optar por facilitar sem horário final, isso não pode transformar um fim arbitrário em requisito comercial.

Não há bloqueio por:
- dia;
- horário comercial;
- final de semana;
- feriado.

Único bloqueio de horário: conflito/sobreposição para o MESMO vendedor.
Compromissos de vendedores diferentes podem coincidir.

### Criar empresa pela Agenda
O fluxo de nova visita deve permitir pesquisar empresa e, se não existir, criar a empresa SEM sair do contexto da Agenda. Depois da criação, a empresa deve ficar selecionada para a visita.

### Evento compacto
Exemplos:
- 14:00 — Clínica Sorriso / VISITA / estado
- 10:30 — Odonto Center / RETORNO / tipo de contato

Não poluir bloco do calendário com todas as tags comerciais.

### Clique em visita
Abre PÁGINA, nunca modal.
Mostrar empresa, status, 2 tags comerciais recentes, data/hora, vendedor, endereço, responsável e telefone.
Ação principal: Registrar visita.

## 9. Registro da visita

Pergunta: visita foi realizada?

### SIM — Entrega de proposta
Obrigatórios:
- responsável;
- telefone;
- número de funcionários;
- valor da proposta;
- e-mail;
- observação.
CNPJ opcional.
Resultado → empresa entra em Negociação.

### SIM — Venda ganha
Obrigatórios:
- CNPJ;
- responsável;
- telefone;
- número de funcionários;
- valor;
- e-mail;
- observação.
Resultado → Venda Ganha.
Empresa permanece associada ao vendedor e indisponível até liberação do Gestor.

### NÃO — Reagendou
Obrigatórios:
- motivo;
- nova data/hora.
A visita original permanece no histórico como REMARCADA.
Criar NOVA visita.
Não sobrescrever/apagar visita antiga.
Empresa permanece em Agendamento.

### NÃO — Não recebeu
- motivo obrigatório;
- nova data/hora opcional.
Com nova data: criar nova visita e manter Agendamento.
Sem nova data: empresa volta a Prospecção, pois não há compromisso futuro.

### NÃO — Venda perdida
- motivo obrigatório;
- empresa → Venda Perdida;
- torna-se disponível para futura prospecção/claim.

## 10. Histórico e reagendamento

Nunca apagar nem sobrescrever visita anterior.
Visita original deve guardar:
- estado REMARCADA;
- motivo;
- referência à nova visita/data.

Nova data = novo registro de visita.

Isso é necessário para métricas de:
- total de visitas;
- realizadas;
- não realizadas;
- remarcadas;
- não recebeu;
- conversão etc.

## 11. Negociação

Ao entregar proposta:
- empresa → Negociação;
- guardar valor da proposta;
- data da proposta;
- vendedor;
- última interação;
- prazo da negociação.

Card/tela deve mostrar:
- valor;
- data;
- dias em negociação;
- vendedor;
- última interação.

### Aging
Gestor define prazo padrão global de negociação em Configurações.
A cor do card progride em direção ao vermelho conforme se aproxima do limite.
Ao atingir limite, ALERTAR Gestor; NÃO decidir automaticamente o resultado.

O tempo da negociação conta a partir da data da proposta.
Registrar acompanhamento NÃO reinicia esse relógio.

### Prorrogar prazo
- somente Gestor;
- vale apenas para aquela negociação;
- não altera configuração global;
- preservar auditoria: quem, quando, motivo/dias.

## 12. Acompanhamento / Follow-up

Ação: **+ Registrar acompanhamento**.

Tipos:
- Ligação
- WhatsApp
- E-mail
- Presencial
- Outro

Campos:
- tipo;
- observação;
- Próximo retorno (data/hora).

Preservar histórico.
Próximo retorno cria evento RETORNO na Agenda.
RETORNO não é VISITA.
Abrir retorno deve permitir registrar acompanhamento e agendar outro retorno.

Retorno vencido:
- permanece visível;
- marcado ATRASADO;
- entra nos pendentes do vendedor;
- nunca altera automaticamente estágio do Funil.

Resumo do vendedor pode destacar:
- retornos de hoje;
- retornos atrasados;
- negociações perto do limite.

## 13. Google Calendar — requisito vital

Cada vendedor conecta SUA PRÓPRIA conta Google.

Toda VISITA pertencente ao vendedor deve sincronizar automaticamente para o Google Calendar desse vendedor.
Todo RETORNO com data/hora também deve sincronizar para o Google Calendar desse vendedor.

Exemplo: visita do João → Google Calendar do João, nunca calendário central da empresa.

CRM é fonte de verdade.

Timezone dos eventos Google: **America/Fortaleza**.

### Reagendamento
CRM:
- preserva visita antiga como REMARCADA;
- cria nova visita.

Google:
- deve refletir o compromisso operacional atual/futuro;
- evento antigo precisa ser atualizado/cancelado de forma coerente, sem deixar compromissos fantasmas;
- CRM continua guardando histórico completo.

### Falha de sincronização
Falha do Google NÃO pode impedir salvar operação no CRM.
Marcar estado como **PENDENTE DE SINCRONIZAÇÃO** e permitir retry.
Estados visuais:
- Google Agenda conectado
- Sincronização pendente
- Google Agenda desconectado

### OAuth local
Em desenvolvimento:
- frontend: http://localhost:5173
- backend/API: http://localhost:3000
- callback configurado: http://localhost:3000/api/google/callback
- depois do callback, retornar ao frontend, não a `/` do Express.

O callback OAuth deve ser seguro; não confiar indefinidamente em userId cru como state. Implementar proteção CSRF/state apropriada antes de produção.

O requisito original também prevê opção de enviar compromisso ao calendário do Gestor. Manter essa possibilidade.

## 14. Dashboard

Não usar números simulados/hardcoded.

Métricas:
- visitas agendadas;
- realizadas;
- não realizadas;
- remarcadas;
- próximas;
- empresas por estágio;
- vendas ganhas/perdidas;
- propostas enviadas;
- valor total proposto;
- valor total ganho;
- ticket médio de vendas ganhas;
- conversões Prospecção→Agendamento;
- Agendamento→Proposta;
- Proposta→Venda;
- conversão geral;
- desempenho por vendedor;
- evolução diária/semanal/mensal;
- tempo médio Prospecção→primeira visita;
- tempo médio Proposta→decisão;
- alerta de empresas sem responsável para Gestor.

Dashboard do Vendedor usa apenas seu escopo.
Dashboard do Gestor pode consolidar equipe e filtrar vendedores.

## 15. Empresas

Pesquisa deve mostrar contexto, não apenas nome:
- estágio/tag automática;
- até 2 tags comerciais recentes;
- vendedor responsável;
- disponibilidade/bloqueio;
- última interação quando aplicável.

Gestor:
- pode editar;
- reatribuir;
- liberar Venda Ganha;
- ver histórico completo.

Vendedor:
- vê empresas próprias;
- também precisa conseguir ENCONTRAR empresas que estejam disponíveis para claim (sem responsável/Venda Perdida), caso contrário não consegue prospectá-las;
- não deve ver/tomar carteira ativa de outro vendedor como se fosse sua.

## 16. Configurações

Abas devem ser realmente funcionais:
- Geral
- Tags comerciais
- Regras comerciais
- Usuários
- Integrações

Não criar aba visual sem comportamento.

### Usuários
- criar Gestor/Vendedor;
- inativar/reativar;
- nunca excluir;
- histórico preservado;
- vendedor inativado libera carteira conforme regras.

### Regras comerciais
- prazo global padrão de negociação;
- aviso/antecedência quando configurável.

### Integrações
- Configurações continua exclusiva do Gestor;
- Gestor pode visualizar o estado das integrações dos vendedores, mas não autoriza a conta Google por eles;
- cada Vendedor conecta/reconecta SUA PRÓPRIA conta Google em **Perfil → Google Agenda**;
- a autorização manual acontece uma vez; depois Visitas e Retornos sincronizam automaticamente;
- Perfil deve mostrar Conectado/Desconectado e Conectar/Reconectar;
- feedback de sucesso/erro do OAuth retorna para Perfil, nunca exige acesso do Vendedor a Configurações.

## 17. Auditoria

Registrar ações relevantes, especialmente:
- empresa criada/alterada;
- claim;
- reatribuição;
- liberação;
- visita criada;
- visita registrada;
- reagendamento;
- acompanhamento;
- prorrogação;
- alterações feitas por Gestor em agenda/carteira.

Não apagar histórico.

## 18. Regras técnicas de implementação

Antes de declarar uma correção concluída:
1. ler este AGENTS.md;
2. identificar regra funcional envolvida;
3. conferir frontend;
4. conferir endpoint/API;
5. conferir persistência/schema;
6. conferir autorização Gestor/Vendedor;
7. conferir efeitos no Funil;
8. conferir efeitos na Agenda;
9. conferir Google Calendar quando houver data/hora;
10. conferir auditoria;
11. rodar TypeScript check/build;
12. testar fluxo completo, não somente tela isolada.

Não usar dados fictícios no produto para mascarar backend ausente.
Não criar botão/aba sem ação real.
Não capturar exceção silenciosamente quando isso impede diagnóstico; registrar erro e retornar estado de sincronização apropriado.
Não considerar `try/catch {}` de Google Calendar uma implementação completa de retry/sync.
Não usar alert genérico "Erro" quando o backend possui mensagem útil.

## 19. Falhas confirmadas pelo teste manual do usuário (prioridade máxima)

Em teste com usuário vendedor válido `tech` / conta Google corporativa, foi observado:
1. visita aparece na Agenda, mas a empresa não aparece no Funil;
2. visita não apareceu no Google Calendar;
3. Gestor não consegue transferir/atribuir agenda/compromisso ao usuário tech;
4. usuário tech não consegue encontrar/ver empresas cadastradas necessárias ao fluxo de prospecção.

Esses quatro itens são defeitos reais e devem ser tratados como regressões prioritárias, não como melhorias opcionais.

Ao corrigir:
- verificar dados reais no banco e IDs de owner/seller;
- confirmar que criação de visita atualiza stage da MESMA empresa;
- confirmar que listagem do Funil usa escopo correto para Gestor/Vendedor;
- confirmar que sellerId usado no Google é o vendedor da visita, não o ator Gestor;
- confirmar refresh token do vendedor correto;
- confirmar que Gestor pode criar/reagendar/editar compromisso em nome de vendedor;
- confirmar que pesquisa de empresas oferece ao vendedor próprias + disponíveis, sem expor tomada indevida de carteira ativa.

## 20. Regras adicionais confirmadas — visita encerrada e manipulação via Funil

- Depois que uma visita recebe resultado final de registro (realizada/proposta, reagendada, não recebeu, venda ganha ou venda perdida), esse registro torna-se histórico e **não pode mais ser editado/re-registrado**.
- Reagendou: a visita antiga deve mostrar explicitamente a nova visita, data/hora e link/referência para ela.
- Não recebeu: a visita antiga deve informar explicitamente se houve ou não nova visita; havendo, mostrar data/hora e referência; não havendo, informar retorno à Prospecção.
- Venda Perdida: registro fica encerrado, mostra motivo e informa disponibilidade para nova prospecção.
- Venda Ganha: registro fica encerrado e informa que a empresa permanece vinculada ao vendedor até liberação do Gestor.
- O backend deve rejeitar tentativa de registrar novamente uma visita cujo status não seja AGENDADA.
- O Funil é manipulável por drag-and-drop, mas arrastar um card **não contorna regras comerciais**.
- Prospecção → Agendamento exige criação de visita/data/hora.
- Agendamento/Prospecção → Negociação exige fluxo equivalente ao registro de entrega de proposta e seus campos obrigatórios.
- Movimento para Venda Ganha exige os mesmos campos/validações da visita ganha.
- Movimento para Venda Perdida exige motivo e o mesmo registro histórico da perda.
- Venda Ganha → Prospecção continua exclusiva do Gestor por meio de liberação.
- Quando o drop exigir dados adicionais, a UI deve encaminhar o usuário ao fluxo correspondente em vez de simplesmente alterar a coluna no banco.

## 21. Melhorias visuais confirmadas — documento melhorias.docx

Estas regras foram acrescentadas a partir do documento de revisão visual enviado pelo usuário e passam a fazer parte da referência obrigatória:

### Agenda
- o formulário de criação deve permanecer alinhado, compacto e visualmente integrado ao calendário;
- o acesso ao Perfil/usuário no rodapé da sidebar precisa ter contraste e legibilidade adequados;
- deve ser possível criar uma visita clicando diretamente em um horário livre nas visualizações Dia e Semana;
- a visualização **Dia** deve carregar uma grade horária real, e não reutilizar uma lista genérica;
- a visualização **Lista** deve sempre renderizar os compromissos ou um estado vazio explícito;
- clicar em um dia na visualização Mês deve levar ao contexto diário daquele dia;
- horários livres devem comunicar visualmente que são clicáveis para criar visita.

### Funil
- cards precisam ter apresentação profissional, sem aparência de hyperlink HTML cru;
- card deve exibir contexto amplo da empresa: nome, endereço, responsável, telefone, CNPJ, funcionários, vendedor, proposta, e-mail quando houver, estágio/tags e prazo quando aplicável;
- clicar na empresa abre o cadastro para consulta/edição/atualização;
- drag-and-drop deve parecer **fluido e intuitivo**: card com cursor de arraste, estado visual enquanto é movido, coluna de destino destacada e pré-visualização do card acompanhando a coluna sob o ponteiro;
- a fluidez visual do drag-and-drop NÃO elimina as validações comerciais já definidas.

### Empresas
- resultados de pesquisa devem usar cards/linhas estruturadas e profissionais;
- não exibir nome/status como hyperlinks HTML visualmente crus;
- mostrar dados de contexto, estado, responsável/vendedor e ações claras.

### Qualidade visual geral
- evitar aparência de protótipo/amador;
- manter consistência de bordas, sombras, radius, espaçamentos, estados hover/focus, tipografia e hierarquia;
- respeitar sempre a referência visual aprovada do produto e estas correções adicionais.

## 22. Critério de pronto

Uma funcionalidade só está pronta quando:
- UI corresponde à referência aprovada;
- regra de negócio está aplicada;
- persistência está correta;
- permissões estão corretas;
- módulos relacionados refletem a mudança;
- Google sincroniza ou registra claramente pendência;
- histórico/auditoria é preservado;
- check/build passam;
- fluxo foi testado ponta a ponta.

Não responder ao usuário que está "completo" apenas porque o código foi escrito. Diferenciar sempre:
- implementado;
- compilado;
- testado;
- validado pelo usuário.
