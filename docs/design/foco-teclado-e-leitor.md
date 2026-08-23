# Foco, teclado e leitor — núcleo (§6–§8)

Dono: agent `ui`. Escopo: **núcleo**, todo cliente, todo módulo, todo espaço.
Criado 2026-08-22 (T-0002, passo 4), como irmão de
[`estados-e-interacao.md`](estados-e-interacao.md) — o corte é por sujeito: lá, o que a superfície
**mostra**; aqui, como o operador **atravessa** a superfície. A numeração de seção é **global aos
dois** e não foi renumerada.

Entrada: `estados-e-interacao.md` (§1 fronteira, §2 canais, §3 vocabulário de estado, §4 autorização,
§5 rede, **§9 as leis desta camada, que valem para este arquivo também**, §10 lacunas).
Grade, zonas, alvo e densidade: `grade-e-espacos.md`. Tokens de foco: `tokens-forma-e-texto.md` §8.1.

Este arquivo não define mecanismo de captura de tecla, de gerência de foco nem de integração de
periférico — **D-02** está aberta e isso é framework. Ele define **ordem, movimento, destino e
recusa**, que são contrato independente de framework.

## 6. Foco: ordem, movimento e recuperação

`PN-05` **não recusa o toque** — exige que o caminho por teclado e leitor exista **inteiro**. O toque
continua caminho válido em E1, E2 e E3.

### 6.1 Ordem

Ordem visual = ordem de leitura = ordem de foco = ordem de atalho (`grade-e-espacos.md` lei 11). O
ordinal é **estável por papel**: dois papéis têm legitimamente layouts diferentes, porque o manifesto
é composto por papel (`estados-e-interacao.md` §4, caso A) — memória motora é de um operador, não
global. Dentro de um papel, o ordinal só muda com decisão registrada (`PN-06`).

### 6.2 Estado não muda a ordem de foco

- **Estado não interativo nunca entra na ordem de foco.** Se a faixa de conexão entrasse, cada
  pendência que chega mudaria o ordinal de todo o resto.
- **Ação originada de estado vive em slot reservado e permanente** em `zone.anchor-top`, com contagem
  de slots fixa e slot vazio que não colapsa (`grade-e-espacos.md` §6.3.1). Ela **nunca** é inserida em
  `zone.flow` nem em `zone.anchor-bottom`: inserir empurraria ação do caminho crítico, que é a
  regressão que `PN-06` recusa.
- **Estado que aparece sozinho não rouba foco.** O foco só se move por **ato do operador** ou porque o
  elemento focado deixou de existir.

### 6.3 Movimento e recuperação

1. **Foco inicial:** cada tela declara **um** alvo de foco inicial e **um** destino de leitura (§7).
   Sem declaração, o piso é o primeiro slot focável de `zone.flow` — **nunca** `zone.anchor-bottom`.
2. **Retorno de camada transitória:** o foco volta exatamente ao elemento que a abriu.
3. **Elemento focado desapareceu** (item removido, nó descartado, slot descartável removido por
   transbordo): o foco vai ao vizinho sobrevivente da **mesma região**; não havendo, à âncora declarada
   da região. **Nunca** ao início da tela — perder o lugar no meio de uma venda é retrabalho — e
   **nunca** a uma ação irreversível ou a `zone.anchor-bottom`: com um terminador de leitura a caminho,
   foco pousado em ação de valor é venda cancelada por acidente.
4. **Recuperação não reordena nada** e não cria slot.
5. **E4 não tem foco** (`grade-e-espacos.md` §7): sem interação, não há ordem a manter.

## 7. O leitor de código

O leitor é primeira classe, e a maior parte dos defeitos desta camada nasce de tratá-lo como um teclado
qualquer.

1. **Leitura tem destino declarado.** Ela é entregue ao destino de leitura da região ativa, **nunca** ao
   elemento focado — a não ser que ele seja o destino. Roteá-la para o elemento focado é o mesmo defeito
   de §6.3, item 3, por outro caminho.
2. **O destino de leitura não é perdido** por atualização de conteúdo da região: rajada de leituras em
   sequência não pode cair no vazio porque a região se atualizou entre duas leituras.
3. **Reconhecimento em `duration.000`**: a leitura **aparece**, não anima. O operador dispara leituras
   em sequência sem olhar, e animação de entrada vira dúvida sobre se pegou.
4. **O terminador de leitura nunca aciona** confirmação de ação irreversível nem ação de
   `zone.anchor-bottom` (`estados-e-interacao.md` §3.6, item 2). Qual tecla confirma, sendo distinta
   do terminador, é **S-05**.
5. **Leitura durante camada modal é recusada, contada e sinalizada dentro da camada** — nunca
   enfileirada e aplicada depois, nunca descartada em silêncio. Enfileirar lança item sem o operador
   saber quando; descartar em silêncio deixa item faltando na venda; recusar contando é o único desfecho
   em que ele **sabe** o que precisa reler. O sinal audível dessa recusa é **S-01**.
6. **Leitura que não resolve** vira `state.error` com próxima ação (releia, digite o código) — nunca
   silêncio, nunca só um som.
7. **Nenhuma leitura é interpretada como comando.** String vinda de leitor ou de rede não é código
   (`ui.md` §1).

## 8. Estado × espaço

Espaços em `grade-e-espacos.md` §4. Estado é o mesmo vocabulário nos quatro; o que muda é o que existe
ali.

| Estado | E1 estação | E2 em movimento | E3 pessoal do cliente-final | E4 leitura à distância |
|---|---|---|---|---|
| `empty` · `stale` · `pending` · `error` | sim | sim | sim | sim |
| `loading` | fora do crítico | fora do crítico | sim | **não** — resolve para `stale` |
| `confirming-irreversible` | sim | sim | **S-06** | **não** (sem interação) |
| `unavailable` (focável) | sim | sim | sim, focável onde há teclado | **não** |
| faixa de rede (`estados-e-interacao.md` §5) | sim | sim | sim, sem contagem de pendências do terminal | **sim, com instante** |

Notas que não são detalhe: em **E4** todo estado é lido a 2–3 m, sem foco e sem toque, com o piso de
texto daquele espaço — e a exibição de conteúdo velho **sem instante** é o pior defeito possível ali,
porque ninguém está perto para desconfiar. Em **E3** o usuário é não treinado e usa uma vez: `error`
sem próxima ação em linguagem comum é abandono do fluxo, e a contagem de pendências do terminal não
lhe diz nada — não vai para lá.
