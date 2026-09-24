---
name: gotcha-celula-de-matriz-decide-autorizacao-e-registro
description: a célula da matriz decide duas coisas (`R` × `P`, RN-NUC-029) — quem pode e se o ato deixa rastro; lacuna de célula escrita como pergunta de autorização faz quem valora fechar a captura por omissão, e "leitura" é o caso em que isso sempre acontece
type: gotcha
escopo: plataforma
camada: produto
data: 2026-09-12
relaciona: [[decision-celula-e-autoridade-unica-sobre-autorizacao]], [[gotcha-regra-nova-que-nao-corrige-a-celula-nasce-inerte]], [[decision-capturar-e-o-padrao-nao-capturar-exige-justificativa]]
tarefa: T-0010
---

**Sintoma:** uma lacuna pergunta "quem pode ler X?", alguém responde com o papel certo, marca `P`
porque **ler não muda nada** — e sem que nada acuse, acabou de decidir que aquela leitura não deixa
rastro em lugar nenhum.

`R` e `P` não diferem só em autorização. `R` é *permitido com registro de auditoria* e `P` é
*permitido sem registro* (`RN-NUC-029`, `matriz-operacao-papel-contrato.md:50`). A célula é a
autoridade única sobre as duas coisas, e a lacuna que a cria costuma estar escrita sobre uma só.

**Por quê morde:** o enquadramento "é leitura, não muda dado" empurra para `P` com naturalidade, e a
pergunta de captura nunca é feita porque a lacuna não a contém. Fato não tem backfill: valorada `P`,
a pergunta que o registro responderia fica sem resposta **para sempre**, e o custo só aparece quando
alguém precisa dela.

**Caso:** `LACUNA-NUC-037` — quem lê relatório de gestão (`REL`). `REL` é o único módulo que **não
produz fato nenhum** (`modulos/relatorios.md` §3, "Nenhum evento"), então `P` ali significa que
"este relatório é usado, e por quem" não é respondível em lugar algum, contra a promessa de
`RN-REL-001` ("relatório existe pela decisão que informa"). A assimetria que torna o buraco visível:
**exportar** documento fiscal registra quem pediu, o escopo e o volume (`RN-EMI-039`); **ler** o
agregado do mesmo período não registra nada.

**Como evitar:** toda lacuna de célula declara, antes da valoração, o que se perde de cada lado — o
custo de `R` (trilha por leitura, e quem lê essa trilha) e o custo de `P` (a pergunta que morre). A
cláusula que faz isso em `LACUNA-NUC-037` está em `matriz-operacao-papel-modulos.md` §9 e em
`matriz-celulas-a-valorar.md` §2, item (f); o **valor** continua sendo do humano, e o que mudou é
que ele não decide a captura por omissão.
