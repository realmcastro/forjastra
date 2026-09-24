# Tolerância de versão do manifesto — núcleo (§4)

Dono: agent `ui`. Escopo: **núcleo**, todo cliente (tenant), todo módulo, todo espaço.
Criado 2026-08-22 (T-0002, passo 5), como irmão de
[`vocabulario-e-eixos.md`](vocabulario-e-eixos.md). O corte é por **sujeito**: lá, o que o manifesto
**diz** (nome, eixo, papel) — que é contrato compartilhado com `backend`; aqui, o que o cliente
**faz quando não entende** o que recebeu, que é resiliência do lado do cliente. A numeração de
seção é **global aos dois** e não foi renumerada: citação a `vocabulario-e-eixos.md §4` resolve aqui.

Entrada: `vocabulario-e-eixos.md` (§1.4 id imutável, §2.3 o que todo bloco declara, §3.2 os papéis,
§3.4 as duas entradas de piso, **§5 as leis, que valem para este arquivo também**, §6 lacunas),
`grade-e-espacos.md` (§5.1 bloco fora da faixa, §5.2 transbordo, §6.3 as garantias de `PN-06`),
`estados-e-interacao.md` (§3.1, §3.4, §5), `docs/arquitetura/d-01-d-02-stack-opcoes.md` (§3.4).

Este arquivo define **comportamento**, e o comportamento é contrato. O mecanismo existe desde
2026-09-12 (T-0012) em `packages/sdui/src/manifest/`: `parse.ts` (análise tolerante), `dispatch.ts`
(despacho tipado com piso garantido) e `screen.ts` (a escada rede → cache → piso). Divergiu do que
está escrito aqui? O defeito é do código.

## 4. Tolerância de versão

### 4.1 O manifesto é entrada não confiável

- **Parse tolerante que nunca lança**, com guardas nomeadas por tipo. Nó inválido é **descartado**;
  os **irmãos sobrevivem**; tela sem nenhum nó válido cai no piso embutido. Tela nunca vazia.
- **Vocabulário fechado.** `kind` ou `source` desconhecido cai no piso
  (`vocabulario-e-eixos.md` §3.4), **nunca** em erro de tela. Não existe correspondência por
  prefixo, por semelhança nem por aproximação: id desconhecido é desconhecido.
- **String da rede não é código.** O cliente não interpreta expressão, template, marcação nem
  consulta vinda do manifesto, e leitura de código de barras também nunca é comando
  (`foco-teclado-e-leitor.md` §7.7).
- **O manifesto não transporta regra nem valor calculado** (`backend.md` §4, `ui.md` §4). Recebeu
  cálculo no manifesto? É defeito do manifesto, não capacidade nova do cliente.
- **Descarte é registrado internamente e não vira estado visível** ao operador, exceto pelo slot não
  colapsável que mostra `block.fallback` (`vocabulario-e-eixos.md` §3.4): erro técnico não fala com
  o operador (`estados-e-interacao.md` §3.4).

### 4.2 Despacho tipado — e por que o mapa genérico é proibido

**Proibido** mapa `kind → Component` com tipo genérico (`ui.md` §1, `R-11` do dossiê de
arquitetura). O mapa genérico apaga a checagem de props: o compilador para de reclamar exatamente
onde o dado vem da rede, que é o único lugar onde a checagem valia algo. O despacho é **tipado**, e
componente resolvido dinamicamente tem **fallback garantido** — não "provável".

Consequência de vocabulário: **acrescentar papel é mudar código do cliente, de propósito.** Se
acrescentar bloco fosse mudar só dado, o vocabulário não seria fechado.

### 4.3 Descarte, e a exceção assimétrica da zona crítica

1. Em `zone.flow`, nó descartado **não renderiza**; irmãos sobrevivem.
2. Em zona de **contagem de slots fixa** (`zone.anchor-top`, `zone.anchor-bottom`), o slot **não
   colapsa** — colapsar moveria tudo depois dele (`PN-06`). O slot mostra `block.fallback`.
3. **Bloco conhecido fora da faixa de densidade** na zona de ação crítica: descarte **proibido**
   (`grade-e-espacos.md` §5.1). Cai na **renderização de piso do papel** — a ação com rótulo de
   texto no alvo mínimo do espaço. Omitir uma ação de cobrança é venda perdida; renderizá-la sem
   enfeite não é. Por isso todo papel declara sua renderização de piso (`vocabulario-e-eixos.md` §2.3, campo 5).
4. **Id desconhecido na zona de ação crítica é o único caso sem saída boa**, e é preciso dizer isso
   em voz alta: o terminal não sabe o que aquela ação faz, então não pode renderizá-la de piso. O
   slot mostra `block.fallback` e **aquela ação não acontece neste terminal**. Consequência que é do
   servidor, não do cliente: capacidade de caminho crítico **não** se publica em id novo antes de os
   terminais entenderem o id (**V-04**).
5. **Nunca** encolher alvo, reduzir rótulo de ação, reordenar slot ou quebrar a zona de ação para
   caber (`grade-e-espacos.md` lei 9).

### 4.4 Degradação e cache

- Ordem, sem pular etapa: **rede → cache local → piso embutido**.
- **Resposta inaproveitável não é cacheada** — senão o defeito congela naquele terminal e a
  degradação passa a servir dado quebrado para sempre.
- Conteúdo que não veio da rede é `state.stale` e **declara o instante** (lei 13 de
  `estados-e-interacao.md` §9). Vazio por degradação é `stale` com zero linhas, nunca `empty`.
- O manifesto é **snapshot** resolvido antes do render (`backend.md` §4), não estado vivo: ele não
  se reescreve no meio de uma venda, e reconexão não recompõe a tela por baixo do operador
  (`estados-e-interacao.md` §5, regra 6).

### 4.5 O catálogo é embarcado — e isto é independente de D-02

`CLAUDE.md` §7.4 e `d-01-d-02-stack-opcoes.md` §3.4: o catálogo de componentes é **embarcado no
cliente**, então **bloco novo exige deploy do cliente**. O dossiê já mediu a consequência nos quatro
arranjos possíveis de cliente e concluiu o que importa aqui: **a tolerância de versão é requisito nos
quatro** — "um binário só" economiza operação, não economiza o requisito. Logo esta seção não espera
**D-02**.

As duas direções, e as duas existem ao mesmo tempo:

| Direção | Como acontece | O que o cliente faz |
|---|---|---|
| **id novo → cliente antigo** | servidor atualizado, terminal ainda não (atualização de terminal depende de janela de parada do cliente) | descarta o nó, irmãos sobrevivem, slot fixo mostra `block.fallback` (§4.3) |
| **id antigo → cliente novo** | manifesto **cacheado** no terminal, servido depois de o terminal atualizar; ou servidor que ainda não publicou | continua entendendo o id enquanto ele puder estar em cache (`vocabulario-e-eixos.md` §1.4). Deixar de entender transforma o cache em tela degradada com a rede fora |

Duas regras de conduta que saem daí:

- **O servidor nunca supõe que o cliente é da última versão** (`backend.md` §4). Não existe manifesto
  "para a versão atual".
- **O cliente nunca supõe que o manifesto é da última versão.** Ele não completa campo ausente por
  inferência, não adivinha o papel de um id parecido e não promove um nó desconhecido a conhecido.
  Falha fechado.

