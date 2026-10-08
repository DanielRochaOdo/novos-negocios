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
- Rotina da equipe (somente Gestor — visão consolidada e não duplicação do cadastro)
- Funil de Vendas (Kanban)
- Empresas
- Configurações (Gestor)

Existe somente uma Agenda. Qualquer duplicação anterior no documento original era erro de redação.

Timezone canônico de TODO o sistema: **America/Fortaleza**.
- em deploys Vercel, não usar a variável reservada `TZ`; configurar `APP_TIMEZONE=America/Fortaleza`;
- valores vindos de `datetime-local` sem offset devem ser interpretados explicitamente como horário de Fortaleza no backend, nunca no timezone implícito do servidor;
- datas/horas exibidas no frontend devem formatar explicitamente com `timeZone: "America/Fortaleza"` para evitar divergência em dispositivos ou runtimes fora desse fuso;
- Google Calendar deve receber os mesmos instantes já normalizados e declarar `America/Fortaleza` no evento.
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

### Paleta e contraste oficiais
- as telas mobile aprovadas de Login, Dashboard e Agenda são a **fonte de verdade cromática** do produto;
- fundo escuro principal: azul-marinho profundo, nunca preto puro;
- cards/superfícies: azul-marinho mais claro que o fundo, com borda azul-acinzentada discreta;
- texto principal: branco/quase branco; texto secundário: azul-acinzentado claro; placeholders precisam permanecer legíveis;
- azul vivo é a cor de ação principal, navegação ativa, CTAs e seleção;
- verde Odontoart é reservado para marca, sucesso e pequenos acentos;
- semântica de indicadores: dourado = carteira/empresas; azul = visitas marcadas; verde = realizadas/ganhas; vermelho = não realizadas/perdas; roxo = negociação/retorno; ciano = conversão/indicador complementar;
- nenhum componente pode usar texto claro em superfície clara ou texto escuro em superfície escura sem contraste suficiente;
- inputs, selects e textareas no tema escuro usam superfície escura, borda perceptível, texto claro e placeholder visível;
- estados ativo, selecionado, desabilitado, sucesso, alerta e erro precisam ser visualmente distinguíveis sem depender apenas do texto;
- componentes de acompanhamento (Ligação, WhatsApp, E-mail, Presencial, Outro) devem seguir o tema atual; nunca podem aparecer como blocos brancos vazios no modo escuro;
- novas cores não devem ser inventadas isoladamente por tela: reutilizar os tokens globais de fundo, superfície, borda, texto, ação e estados semânticos.

### Estados visuais e contraste (regressão corrigida)
- todos os botões comerciais do CRM (especialmente `Sim/Não`, `Entrega de proposta/Venda ganha` e demais resultados da Visita) precisam definir **cor de texto explicitamente**, nunca apenas fundo/borda; esta falha fazia rótulos desaparecerem nos temas claro/escuro;
- um botão **não selecionado** continua legível e visualmente clicável; o estado desabilitado é separado e não pode ser confundido com o não selecionado;
- textos de controles normais e selecionados devem atingir, sempre que possível, **WCAG AA 4,5:1** (texto normal); ícones/bordas essenciais devem ser distinguíveis;
- botão ativo com texto branco não deve usar azul claro sem contraste suficiente; preferir azul mais profundo (`#096bd6` ou equivalente aprovado);
- aplicar tokens de contraste compartilhados aos formulários de Visita, Acompanhamento, Agenda, Empresas, Funil, Perfil e Configurações nos dois temas, sem alterar a referência visual;
- botões de escolha mutuamente exclusivos devem expor `aria-pressed` ou semântica equivalente, além do estado visual;
- validar todos os estados **normal, hover, foco, selecionado e disabled** no desktop e no mobile; não declarar validação visual concluída sem executar o app nos dois temas.

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

### Busca global preventiva
- a pesquisa usada durante criação, agendamento e busca explícita é **global**, não filtrada pela carteira do vendedor;
- ao digitar parte do nome, por exemplo `Odo`, retornar todas as empresas cujo nome contenha esse trecho, independentemente do vendedor responsável;
- a pesquisa também pode localizar por CNPJ;
- empresa de outro vendedor ativo deve aparecer no resultado com estágio e vendedor responsável, mas permanecer bloqueada para qualquer ação comercial;
- o vendedor não pode abrir o cadastro completo, agendar, assumir, editar ou criar duplicata de empresa pertencente a outro vendedor ativo;
- empresas sem responsável ou em Venda Perdida aparecem como disponíveis para claim;
- Venda Ganha aparece bloqueada até liberação do Gestor;
- a listagem padrão de carteira pode continuar restrita ao escopo do vendedor; somente a busca preventiva é global;
- criação de empresa deve bloquear CNPJ já existente e também nome exatamente igual após normalização de espaços/maiúsculas, orientando o uso do cadastro existente;
- Gestor pode ver o contexto global, mas agendar para vendedor diferente do proprietário exige reatribuição explícita antes do agendamento; nunca reatribuir silenciosamente ao criar visita.

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

### Empresas cadastradas fora do Funil
- cadastro no banco **não implica** participação automática em um ciclo comercial ativo;
- empresas importadas em massa podem permanecer com `in_funnel = false`: continuam disponíveis na busca global e prevenção de duplicidade e ficam ocultas **somente enquanto estiverem em Prospecção**;
- empresas criadas manualmente pelo fluxo comercial nascem no Funil;
- ao vendedor **assumir** uma empresa disponível/importada, ela entra no Funil em Prospecção;
- ao criar uma visita para a empresa, ela entra/permanece no Funil e passa para Agendamento;
- reatribuição comercial explícita pelo Gestor também ativa a participação no Funil;
- o Kanban deve excluir `in_funnel = false` apenas da coluna **Prospecção**. Empresas em Agendamento, Negociação, Venda Ganha ou Venda Perdida devem aparecer normalmente mesmo que a flag tenha sido marcada como false em uma importação anterior;
- a busca global nunca deve filtrar por `in_funnel`, pois precisa localizar também a base importada fora do ciclo.

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

### Entrada de data e hora — digitação ou calendário
- em **todo campo onde o usuário informa data e hora**, permitir digitar livremente no formato brasileiro `dd/mm/aaaa hh:mm` (inclusive no mobile);
- manter o **ícone de calendário ao lado do campo**: ao clicar/tocar, abrir o seletor nativo de data e hora, sem obrigar o uso do calendário;
- usar um componente reutilizável para início/fim da rotina, data da visita, próxima data do reagendamento e próximo retorno do acompanhamento;
- não bloquear datas anteriores ou horários livres do vendedor; visitas retroativas seguem permitidas;
- validar dia, mês, ano, hora e minuto reais (inclusive anos bissextos), exibindo erro legível antes de salvar;
- manter internamente a data local em formato `YYYY-MM-DDTHH:mm` e interpretar no backend com `America/Fortaleza`, **sem converter inadvertidamente pelo timezone do dispositivo**;
- ao limpar ou digitar parcialmente, não conservar escondida no estado a data válida antiga; evitar salvar data diferente da visualizada;
- tanto tema escuro quanto claro devem oferecer contraste e alvo de toque adequado para campo e ícone;
- caso o navegador não suporte abrir o seletor por `showPicker()`, oferecer um seletor nativo visível alternativo.

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

### Consulta cadastral por CNPJ
- sempre que existir um campo **editável** de CNPJ, exibir uma ação de lupa ao lado do campo para consultar os dados cadastrais;
- a consulta usa o endpoint interno `/api/cnpj/:cnpj`; o backend consulta **Minha Receita** diretamente como fonte principal e usa **BrasilAPI** como fallback, sempre sem expor chamadas externas ao frontend;
- em ambiente serverless/Vercel, enviar `User-Agent` explícito nas consultas externas para evitar bloqueios conhecidos da mitigação anti-bot da BrasilAPI;
- a falha de uma fonte não deve encerrar a consulta: tentar a fonte seguinte antes de retornar erro ao usuário;
- aplicar a lupa em: **Nova Empresa**, **Editar Empresa** e **Registro de Visita → Venda Ganha**;
- não exibir essa lupa em campos cujo objetivo seja apenas **pesquisar empresas já cadastradas no CRM** (por exemplo, busca global da Agenda, busca da tela Empresas e busca do Funil);
- ao consultar no cadastro completo de empresa, preencher quando disponíveis: CNPJ, Nome (nome fantasia; na ausência, razão social), Telefone, E-mail e Endereço completo;
- no registro de Venda Ganha, preencher somente os campos existentes naquele formulário: CNPJ, Telefone e E-mail; não persistir alterações extras na empresa antes de o usuário salvar o registro;
- **Responsável comercial** não deve ser preenchido automaticamente pelo QSA/representante legal da Receita, pois são conceitos diferentes;
- número de funcionários e valor da proposta não existem no cadastro da Receita e nunca devem ser inferidos;
- a consulta deve mostrar erro legível quando o CNPJ for inválido, não existir ou a fonte estiver indisponível;
- preservar edição manual após a consulta; dados retornados são assistência de preenchimento, não decisão automática.

### Performance e paginação da listagem
- a tela **Empresas** não deve carregar toda a base de uma vez;
- a listagem padrão e a busca global dentro da tela Empresas usam paginação server-side;
- carregar **50 empresas por página**;
- o backend deve retornar itens da página, total de registros, página atual e total de páginas;
- busca por nome/CNPJ continua global, mas também paginada em lotes de 50;
- Agenda e fluxo de Nova Empresa podem continuar usando a busca global sem envelope paginado quando precisarem de autocomplete, preservando compatibilidade;
- ao trocar o termo de busca, voltar para a página 1;
- exibir ao usuário o intervalo atual (ex.: 51–100 de 1.984) e controles Anterior/Próxima;
- não consultar tags de todas as empresas quando apenas uma página está sendo exibida; limitar dados relacionados aos IDs carregados na página.

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

### Senhas e segurança de acesso
- Gestor pode redefinir a senha de qualquer usuário pela aba **Configurações → Usuários**, sem precisar conhecer a senha atual desse usuário;
- redefinição pelo Gestor deve exigir nova senha com no mínimo 8 caracteres e confirmação no frontend;
- ao redefinir a senha de outro usuário, encerrar todas as sessões existentes desse usuário;
- se o Gestor redefinir a própria senha por esse fluxo, preservar apenas a sessão atual e encerrar as demais;
- qualquer usuário autenticado, incluindo Vendedor, pode alterar a própria senha em **Perfil**;
- alteração da própria senha exige a senha atual correta, nova senha com no mínimo 8 caracteres e confirmação;
- nova senha não pode ser igual à senha atual;
- após alteração da própria senha, preservar a sessão atual e encerrar as demais sessões do mesmo usuário;
- senhas nunca são retornadas pela API nem armazenadas em texto puro; usar bcrypt com hash de custo 12.

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

### Sessão autenticada atrás da Vercel
- o Express deve confiar no proxy da Vercel (`app.set("trust proxy", 1)`) antes de registrar o middleware de sessão;
- `express-session` deve usar `proxy: true` em produção/serverless para permitir emissão correta de cookie `Secure` atrás do proxy HTTPS;
- cookie de sessão: `Secure` em produção, `HttpOnly`, `SameSite=Lax`, `Path=/`;
- um `401` isolado em `/api/me` antes do login é esperado; `401` após login bem-sucedido indica falha de cookie/sessão e deve ser tratado como regressão;
- validar em produção que a resposta de `POST /api/auth/login` contém `Set-Cookie` e que a chamada seguinte a `GET /api/me` retorna o usuário autenticado.

### Deploy na Vercel
- o frontend Vite gera artefatos em `dist/public`; a Vercel deve publicar exatamente esse diretório;
- `vercel.json` precisa declarar `buildCommand: npm run build` e `outputDirectory: dist/public`;
- a SPA usa fallback para `/index.html`, mas rotas `/api/*` devem ser encaminhadas antes para a Vercel Function da API;
- o Express deve exportar `app` e não executar `app.listen()` quando `process.env.VERCEL` estiver presente;
- `api/index.ts` é a entrada serverless que reaproveita o Express e reconstrói o caminho original `/api/*`;
- em Project Settings da Vercel, o Root Directory deve permanecer na raiz do repositório, salvo decisão arquitetural explícita diferente;
- um deploy não é considerado validado apenas porque o build ficou READY: testar `/`, `/api/me`, login, Neon e callback Google em produção.

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

## 22. Ajustes vitais — Google, Funil, Acompanhamento e Rotina diária (08/10/2026)

### Sincronização com Google Agenda
- criar visitas e retornos primeiro no CRM e tentar sincronizar em seguida; falha do Google não deve perder o dado;
- visitas retroativas são válidas, inclusive para sincronização no calendário do vendedor;
- evento do Google deve ir à conta Google vinculada ao vendedor responsável, não à conta do Gestor;
- na página Perfil exibir quantidade de pendências e ação real **Sincronizar pendências agora**; após conectar/reconectar, tentar um lote de pendências;
- visitas antigas sem `google_event_id` devem poder ser reenviadas, inclusive depois de reconectar; não criar eventos repetidos quando já existir `google_event_id`;
- retornos agendados e atividades de rotina com data e hora também podem sincronizar; mostrar falhas e manter opção de tentar novamente;
- visitas remarcadas não podem ficar duplicadas no calendário operacional: cancelar evento antigo e criar novo; falhas devem ser registradas nos logs.

### Visitas retroativas
- os campos de data/hora da Agenda aceitam dias anteriores, sem bloqueio temporal artificial;
- a data comercial da proposta registrada a partir de visita retroativa deve ser a data da visita, não automaticamente a data atual;
- não confundir visita passada **ainda não registrada** com visita cancelada/remarcada; pode ser concluída pelo registro normal.

### Funil com registro real de resultado
- ao mudar para Agendamento, encaminhar à Agenda com a empresa selecionada, para criar visita com data/hora;
- ao mudar para Negociação, Venda Ganha ou Venda Perdida, abrir formulário comercial REAL no próprio Funil, adequado a celular; nunca apenas mensagem/alert;
- exigir campos aprovados, incluindo CNPJ em Venda Ganha, e motivo em Venda Perdida;
- se existir visita AGENDADA pendente, o usuário pode vinculá-la ao registro do Funil, para encerrar a visita corretamente;
- sem visita pendente, registrar decisão comercial auditada na empresa sem criar visita fictícia;
- manter o histórico e as regras de posse; não permitir tomar empresa de outro vendedor;
- depois de salvar, atualizar a coluna do card de forma coerente no desktop e mobile.

### Acompanhamento
- o formulário `Novo Acompanhamento` fica EXCLUSIVAMENTE na aba Acompanhamento da empresa, junto de seu histórico;
- as abas Histórico, Visitas, Tags e Dados da Empresa NÃO podem renderizar o formulário;
- retorno com próxima data cria compromisso RETORNO na Agenda e pode sincronizar no Google.

### Rotina diária na Agenda (sem novo módulo)
- a rotina diária fica na própria Agenda, por ser a fonte de atividades datadas;
- vendedor cria, edita e cancela atividades com título, tipo (Reunião interna, Atividade interna, Planejamento, Outra), início/fim e observações;
- dados da rotina ficam em tabela `routines`; cancelamentos preservam registro e auditoria;
- Gestor tem visão simples da rotina dos vendedores pela Agenda com filtro de vendedor;
- a rotina aparece na Agenda junto de VISITA e RETORNO, porém com aparência distinta; nunca deve virar automaticamente empresa/card do Funil;
- blocos de rotina e retornos agendados entram na checagem de conflitos quando uma visita ou outra atividade é marcada;
- o Funil mostra um resumo da rotina do dia com acesso à Agenda para o vendedor/gestor consultar a ocupação;
- respeitar `America/Fortaleza`, mobile-first e estados de sincronização Google;
- para provisionar `routines` e `user_sessions` de maneira aditiva, executar `npm run db:ensure` ou a migração SQL idempotente revisada. NÃO executar `db:push` indiscriminadamente em produção.

### Módulo de Rotina exclusivo do Gestor — ajuste aprovado (08/10/2026)
- o Gestor tem **módulo dedicado "Rotina"**, visível na sidebar e na navegação mobile apenas para perfil GESTOR; Vendedor não recebe esse módulo;
- o cadastro/edição de atividades da rotina do Vendedor **permanece na Agenda**: o módulo do Gestor é uma visão consolidada de acompanhamento da equipe, sem duplicação de registros;
- o módulo consolida, em uma linha do tempo por vendedor, **Visitas**, **Retornos** e **Rotina interna**, consultando as mesmas tabelas existentes (`visits`, `followups`, `routines`);
- cada visita mostra **o status original dela ao lado** (AGENDADA, REALIZADA, REMARCADA, NAO_RECEBEU, VENDA_GANHA, VENDA_PERDIDA ou CANCELADA), além de empresa, vendedor, data e hora;
- as visitas não devem ter seu status comercial alterado automaticamente porque estão atrasadas: mostrar o estado persistido e permitir abrir o registro completo;
- filtro por vendedor, período Dia/Semana com navegação anterior/próximo/Hoje, e tipo de atividade; apresentação agrupada por vendedor;
- abrir uma visita deve levar à página de detalhe/registro da própria visita, um retorno à aba Acompanhamento da empresa e uma rotina à Agenda;
- API dedicada `GET /api/gestor/rotina` **somente GESTOR** (403 para Vendedor), com filtro por data e vendedor, evitando carregar todo o histórico desnecessariamente;
- interface mobile-first, status legível sem scroll horizontal da página, temas claro/escuro e navegação inferior usável com seis destinos do Gestor;
- **sem alteração no schema do banco**: dados já existentes são reaproveitados; não orientar `db:push` para esta funcionalidade.

### Segurança de migrações e armazenamento de sessões (incidente 08/10/2026)
- houve uma execução de `drizzle-kit push` que **excluiu** a tabela `user_sessions` contendo 31 sessões; a tabela não estava declarada no `shared/schema.ts`, então a ferramenta sugeriu descartá-la como externa ao schema;
- manter `user_sessions` **declarada** em `shared/schema.ts` com colunas `sid` (varchar), `sess` (jsonb), `expire` (timestamptz) e índice `user_sessions_expire_idx`; não renomear `user_sessions` para `routines`;
- `server/session-store.ts` pode recriar uma tabela vazia de sessões automaticamente, mas NÃO restaura os registros excluídos nem as sessões antigas;
- **jamais orientar a confirmação de `DROP TABLE`, `DELETE`, `TRUNCATE` ou renomeação sugerida pelo Drizzle sem inspecionar impacto e backup**;
- o caminho seguro aditivo para estrutura de sessões e rotina é `npm run db:ensure` (`scripts/ensure-db.ts`), que apenas executa `CREATE TABLE IF NOT EXISTS` e `CREATE INDEX IF NOT EXISTS`;
- `npm run db:push` fica bloqueado por padrão e exige aceite explícito em variável de ambiente, além de backup e revisão humana;
- para qualquer futura mudança em produção, usar migração SQL versionada e não destrutiva, revisar diffs e manter tabelas externas documentadas no schema;
- sempre executar `npm run check` e `npm run build` em código atualizado antes de considerar um deploy pronto.

## 23. Critério de pronto

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
