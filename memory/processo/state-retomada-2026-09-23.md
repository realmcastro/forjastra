---
name: state-retomada-2026-09-23
description: onde o trabalho parou em 2026-09-23 — nenhum agente em voo por pedido do humano; três fichas fechadas (T-0016, T-0018 e o item F-007), decisões delegadas tomadas (fuso, moeda, turno, rateio, dinheiro, código lido, residência da trilha, D-03 recomendado C), e a fila exata do que cada próxima passada faz
type: state
escopo: processo
camada: processo
data: 2026-09-23
relaciona: [[convention-decisao-delegada-com-aviso-no-modulo]], [[state-execucao-solo-2026-09-11]]
supera: [[state-retomada-2026-09-12]]
---

Em 2026-09-23 o humano delegou as decisões pendentes pelo critério de escalabilidade
([[convention-decisao-delegada-com-aviso-no-modulo]]) e, no fim do dia, pediu **"dont despatch no one
more agent"**. Nada está em voo. Retomar exige nova ordem dele para despachar.

## Fechou em 2026-09-23

| Ficha | Item | O que passou a existir |
|---|---|---|
| `T-0016` | `F-007` | `LACUNA-PER-6` = `RN-NUC-063`; código lido só como GTIN global ([[decision-codigo-lido-entra-so-como-gtin-global]]) |
| `T-0018` | `SPR-40` | dinheiro e quantidade ([[decision-dinheiro-e-quantidade]]); `packages/contracts/` aberto para o ponto fixo |

## Aberto, com o que falta (tudo sem despacho)

- **`T-0009`** (banco): recorte 1 feito. Falta o recorte 2 (`PAP-28`) e o gate do recorte 1. Insumo
  medido: o executor precisa do ADMIN sobre `forja_app` para `provision`.
- **`T-0013`** (credencial na subida): quarta rodada feita (oito perguntas). Falta a quarta auditoria, a
  medida de `performance` do custo linear da delegação, e alinhar o gate de `apps/api` ao de `db/migrator`
  (teste inventado para arquivo vazio; arquivo que usa o banco fora da lista ou do glob).
- **`T-0014`** (`F-018`, lacunas): A.1, A.2a e A.3 leva 1 feitos, com `RN-NUC-057`…`062`, `064`…`066`.
  Faltam A.2b (catálogo e aviso de `GRD`), A.2c (Fase 2 e `LACUNA-NUC-003`), A.3 leva 2, a reescrita do
  aviso de `LACUNA-NUC-004` (decidido: o `owner` publica o modo de arredondar e a loja vende) e a consulta
  de `seguranca` sobre `RN-NUC-066` e `060`.
- **`T-0015`** (`D-03`): B.1 e B.2 feitos, **recomendação C** (sujeito local ao cliente). Faltam a consulta
  B.2', o gate B.3 e a pergunta ao `produto` sobre a entrada do ato que resolve o cliente-alvo da pessoa
  nossa. Não fecha sem o gate.
- **`T-0017`** (`F-016`): varredura feita, `F-022`…`F-029` criados, conferência por conjunto rodada pelo
  thread. Falta a segunda passada das conferências adiadas.
- **`T-0019`** (`D-06`(ii)): residência decidida
  ([[decision-d-06-ii-trilha-no-platform-com-projecao-no-cliente]]). Falta o desenho de `TRL-01`
  (direção: papel `prv_t_X`) e `TRL-02`, e a reauditoria.
- **Ainda sem ficha:** `F-020` (`D-05`), `F-021` (estabelecimento e terminal, a próxima peça do banco),
  `SPR-37` e depois `SPR-31`/`32`/`33`, com o plano completo na ficha `T-0014`.

## Edições de produto em fila (arquivo por arquivo)

## Depois do A.2a (dono atual: nucleo-venda, papeis-e-permissoes, matriz-operacao-papel, glossario, fronteira)
- nucleo-venda.md:113 (RN-NUC-002 infeliz cita RN-NUC-057) — de C.1
- papeis-e-permissoes.md: RN do primeiro owner no provisionamento (B.1 §2) e segundo fator por classe de ato (B.1 §3)
- conferir que "habilitar terminal a vender" entrou na matriz (estava no brief do A.2a)
## Livres agora / A.2b
- nucleo-publicacao-e-texto.md:136 (RN-NUC-015 cita published_artifact_version_received) e :89 (RN-NUC-013 infeliz a cita RN-NUC-057) — de C.1; conflita com A.2b (RN-NUC-013)
- README.md:99 índice de regras sem RN-NUC-057
- captura-varredura-invariante-10-2026-09-11.md §2.12 encaminhado para RN-NUC-057
- F-018 :70 :79 PER-6 aparece aberta
- matriz do escopo provedor: linha "provisionar e atribuir o primeiro owner" (B.1)
- A.3 leva 2: B4 operacao-offline §8, B5 perifericos-classes RN-PER-018 e perifericos §4
- avisos D-06 §9 em fatos-de-operacao-provedor.md (RN-PRV-011) junto com decisão T-0019
- aviso GRD em catalogo-de-modulos.md (A.2b)
- revisar B6 ao fechar D-05
- item: partir fiscal-emissao-contingencia.md (409) e modulos/fiscal.md (442)
- d-01-d-02-stack-opcoes.md:31,:51 citam fiscal-emissao-contingencia.md:217 → :223
- T-0017 segunda passada das conferências adiadas (RN-NUC-043/045, nucleo-venda, nucleo-caixa-e-turno, 37 citações de superficie-por-papel-momentos)
- backlog-recortes.md: justificar fusão F-022→F-012 e F-028→F-007 (autorizada pelo thread)
- tolerancia-de-versao.md:34 "registrado internamente" → é devolvido, não registrado (ui)
- reescrever aviso LACUNA-NUC-004 em nucleo-venda §6: modo publicado pelo owner vende; contador só no fiscal
- refs velhas "PER-6 = RN-NUC-057" → 063: F-007:147, pendencias:302 (conferir depois do C.3)
- A.2a PERGUNTAS 3: fatos-de-operacao.md:102-126, nucleo-publicacao-e-texto.md:49, matriz-operacao-papel-contrato.md:49 (RN-NUC-066), operacao-offline :147 :239 :351 :360, backlog-lacunas-g01-g09, F-021, SPR-46, SPR-28, SPR-29
- .claude/rules/dados.md §3 e ui.md §3: fuso e moeda do estabelecimento (permissão)
- db/convencoes.md:21 e comentário 0001 — na próxima migration
- LACUNA-NUC-003 → A.2c
- nucleo-venda.md cabeçalho "D-01 a D-04 ABERTAS" falso
- matriz-operacao-papel-modulos.md §8 contagem 195→210
- descomissionar terminal sem fila não tem linha

## Travado por permissão, e só o humano destrava

- Commit e push direto em `main`: autorizado por ele, **negado pelo classificador**. Nada de 2026-09-11 em
  diante está commitado. Os dois `.env.example` ficam fora, porque ninguém consegue lê-los.
- Edição de `.claude/**`: negada. Precisam dela `git.md` §2 (push direto), `dados.md` §3 (dinheiro, fuso e
  moeda do estabelecimento) e `ui.md` §3 (fuso e moeda).
- `docker rm` dos quatro `forja-t9-*` parados: negado.

## Não refazer

- Trocar predicado de exclusão por outro predicado de exclusão. Foi tentado oito vezes na camada de
  papel, e em todas o buraco seguinte abriu uma casa ao lado
  ([[convention-propriedade-acusa-nunca-desculpa]]).
- Despachar instâncias paralelas de `produto` sem reservar antes a faixa de números de `RN`
  ([[gotcha-numero-de-rn-colide-entre-instancias-paralelas]]).
- Aceitar suíte verde como prova. O que prova é mutar o predicado numa cópia do `dist` e ver um caso
  nomeado morrer ([[convention-exclusao-se-prova-com-o-excluido-hostil]]).
