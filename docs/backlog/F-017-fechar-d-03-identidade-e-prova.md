# F-017 — Fechar `D-03`: onde mora o sujeito, como ele prova quem é, e de onde chega o tenant

**Tipo:** Comportamento fechado (decisão) · **Estado:** a fazer · **Dono:** thread principal (decide e
registra); `backend` atualiza o desenho; `seguranca` audita · **Território do desenho:**
`docs/arquitetura/d-03-identidade-opcoes.md` e arquivo irmão, se precisar

> **Origem.** Pedido do humano em 2026-09-23: "sobre as decisões, você faz o que for melhor para a
> escalabilidade [...] A gente vai fazer a base e bem feita". A regra de trabalho que saiu disso está em
> `memory/processo/convention-decisao-delegada-com-aviso-no-modulo.md`, e ela nomeia `D-03` pelo nome:
> a decisão deixa de esperar o humano e passa a ser tomada pelo thread, com o recusado e o motivo
> registrados. Decisão registrada não é presunção; é isso que mantém o invariante 9 de pé.

## Objetivo

Registrar `D-03` como **FECHADA** nos três eixos que o dossiê separou, com o gate de `seguranca` cumprido
sobre o desenho **antes** do registro:

```
dossiê de 2026-08-23 (E1 residência · E2 prova · E3 chegada do tenant)
→ releitura contra D-01 (Fastify + Kysely) e D-02 (arranjo D), que fecharam depois dele
→ escolha por eixo, com recusado e motivo
→ auditoria de seguranca sobre o desenho escolhido
→ registro decision em memory/plataforma/ + linha do CLAUDE.md §8 virando FECHADA → [[slug]]
```

Hoje `D-03` trava todo ponto em que a identidade é **provada** (`.claude/rules/backend.md`, abertura; a
fundação de `F-002` assumiu identidade já provada e declarou a fronteira). Nenhuma rota de negócio nasce
sem isso, e `F-021` não sabe que forma dar ao terminal enquanto E3 não fechar.

## Escopo

- **E1, residência do sujeito.** A pergunta única do dossiê (§8, `:344-354`): o humano que opera em mais
  de um cliente (tenant) é caso de **borda** ou de **venda**? Borda leva a C; venda leva a B, com o
  isolamento passando a depender de verificação, assumido por escrito. O critério agora é escalabilidade,
  e a palavra sozinha justifica as duas: C escala **N clientes com isolamento por construção**, B escala
  **uma pessoa em N clientes com revogação num ato só** (`:339-342`). O registro diz qual das duas
  escalas a base otimiza, e o que a outra passa a custar.
- **E2, mecanismo de prova**, agora que `D-01` fechou e o dossiê deixou de ter motivo para ficar em
  contrato puro (`:7-10`). Inclui `LACUNA-IDE-005` (segundo fator: existe, para quais papéis, e como se
  comporta sem contato, onde por R-5 nada renova). **Fechada em 2026-09-23 → `RN-NUC-091`**
  (`docs/produto/papeis-e-permissoes.md` §5.1): piso por classe de ato, conferido só com contato.
- **E3, chegada do tenant**, confirmando o que o dossiê dá por quase decidido (§2.1) contra a restrição
  que ele já perdeu: para papel de escopo `provedor`, o cliente-alvo **não** chega no pedido
  (`RN-PRV-004` b, registrada em `memory/plataforma/decision-d-03-sao-tres-eixos-nao-uma-decisao.md`).
- **O que muda com o arranjo D.** "Terminal como portador do tenant" (C, `:326-327`) passa a significar
  o acompanhante nativo, que é quem tem custódia (`memory/plataforma/decision-d-02-arranjo-d.md`). A
  retaguarda em navegador, sem acompanhante, é a superfície que só C atende com caminho lícito de
  primeira chegada (`:331-334`). O registro diz como cada uma das duas superfícies chega ao tenant.
- **`LACUNA-IDE-002`** (quem cria o primeiro `owner` de um cliente novo, junto de `LACUNA-NUC-011`) e a
  pergunta 2 do dossiê (provedor de identidade do próprio cliente). Cada uma sai decidida ou com o aviso
  de indisponibilidade no formato de `F-018`. **`LACUNA-IDE-002` fechada em 2026-09-23 → `RN-NUC-090`**
  (`docs/produto/papeis-atribuicao-e-delegacao.md` §5): o primeiro `owner` nasce no ato que provisiona,
  só com zero `owner`, e a recuperação de cliente sem `owner` utilizável saiu com o aviso de
  indisponibilidade.

## Fora de escopo

- **Implementação em `apps/api/**`.** Hook de prova, verificador, sessão. Nasce em item próprio depois
  deste, e é `backend`.
- **Os números**: validade da autoridade retida (`LACUNA-OFF-011`), prazo de `provider_support`
  (`LACUNA-NUC-010`), reconciliação do conjunto de identificação (`LACUNA-OFF-016`). O dossiê já avalia
  as opções sem eles (`:315-317`); a decisão também não precisa deles. Eles estão no conjunto de `F-018`.
- **O canal local entre navegador e acompanhante.** Quem autoriza aquela página a falar com aquele
  acompanhante é superfície nova de `D-02`, com gate próprio antes de qualquer código de fila. Toca E2,
  e o registro de `D-03` diz se a prova do operador atravessa esse canal; o desenho do canal é
  `backend` com `seguranca`.
- **Formato do identificador do sujeito.** É `D-04`, fechada: `uuid` ordenado no tempo (`:318-320`).
- **Valor de célula de matriz.** `D-03` decide quem é o sujeito e como ele prova; o que cada papel pode
  continua sendo da matriz (`memory/plataforma/decision-celula-e-autoridade-unica-sobre-autorizacao.md`).

## Critério de aceite

1. **Os quinze requisitos do dossiê (§1, `:41-57`) aparecem numa tabela contra a opção escolhida**, cada
   um com "cumpre" e a frase de como, ou com "não cumpre" e o que a base perde. Nenhum fica sem linha.
2. **Cinco casos, cada um com o desfecho escrito no registro:**
   - operador de um estabelecimento com terminal habilitado a vender, sem rede desde a abertura, abre
     sessão de caixa e conclui venda em espécie (R-7, R-13, `RN-OFF-032`): diz qual peça identifica o
     operador sem contato e onde ela está retida;
   - dono entra pela retaguarda em navegador, sem acompanhante e sem terminal cadastrado: diz como o
     tenant é resolvido **sem** vir de path, `query`, `body` ou header livre (R-1);
   - `provider_support` com concessão no cliente X tenta alcançar o cliente Y: recusa, e diz por que a
     recusa é propriedade da construção ou de uma verificação nomeada (R-8);
   - a mesma pessoa com papel em dois clientes: diz se ela tem dois acessos ou um, e o que isso custa na
     revogação;
   - terminal furtado e mantido offline: diz o que a pessoa que o furtou consegue com o meio de
     identificação retido, e até quando (R-15, `RN-OFF-033`).
3. **O gate de `seguranca` rodou sobre o desenho** e o relatório está em `docs/auditorias/`. Achado
   `CRÍTICO` ou `ALTO` aberto impede o registro de FECHADA.
4. **Registro `decision` em `memory/plataforma/`** com `supera: [[decision-d-03-sao-tres-eixos-nao-uma-decisao]]`,
   o recusado de cada eixo com o motivo, e a linha `D-03` do `CLAUDE.md` §8 virando `FECHADA → [[slug]]`
   na mesma passada.

**Caminho infeliz.** A auditoria acha `ALTO` no desenho: `D-03` segue ABERTA, o registro diz qual eixo
caiu e por quê, e o eixo que passou fica registrado como fechado. Fechar os três de uma vez com achado
aberto é o defeito que este aceite existe para impedir.

## Registra / Não registra

**Registra, e a decisão não pode tirar:**

- A recusa por identidade com motivo próprio, `identity_unrecognized`
  (`memory/plataforma/rule-recusa-por-identidade-tem-motivo-proprio.md`). Qualquer mecanismo de E2 tem
  de produzir esse fato na recusa.
- Em que o ato se sustentou: atribuição, concessão, ou identificação retida mais habilitação do terminal
  (`memory/plataforma/business-rule-registro-de-ato-nomeia-em-que-o-ato-se-sustentou.md`). O mecanismo
  escolhido diz como cada uma das três fontes chega ao registro.

**Não registra, e por quê:**

- **O meio de identificação e o material de prova**, em fato, log ou erro. Credencial nunca
  (`.claude/rules/seguranca.md` §3). O fato diz que houve identificação e por qual fonte, nunca com quê.
- **Ainda sem resposta: a tentativa de identificação que não chega a uma operação** (digitação
  abortada, meio apresentado e recusado antes de qualquer ato). O registro de `D-03` decide se ela vira
  fato, ouvido o gate de `seguranca` sobre ser sinal de ataque. Está aqui para a pergunta não se perder;
  este item não a declara capturada nem descartada.

## Depende de

**Nada em aberto, e o item é executável hoje.** O dossiê está em disco
(`docs/arquitetura/d-03-identidade-opcoes.md`, 2026-08-23); `D-01` e `D-02` fecharam em 2026-09-11; as
duas travas de `produto` que o dossiê citava caíram em 2026-08-23 (`:356-359`); a restrição do terceiro
eixo está registrada. O que falta é o gate, e ele faz parte deste item, não o precede.

## Gate obrigatório

**`seguranca`** sobre o desenho, antes do registro: autorização, escopo de tenant, e o que o terminal
furtado entrega. O dossiê diz a razão com todas as letras: escolher `D-03` antes dessa auditoria "é
aplicar arquitetura de identidade sem auditoria de identidade" (`:358-359`).

## Referências

`docs/arquitetura/d-03-identidade-opcoes.md` §1 · §2.1 · §2.2 · §3 · §7 · §8 · `LACUNAS` ·
`memory/plataforma/decision-d-03-sao-tres-eixos-nao-uma-decisao.md` ·
`memory/plataforma/decision-d-02-arranjo-d.md` · `memory/plataforma/decision-d-01-fastify-e-kysely.md` ·
`memory/processo/convention-decisao-delegada-com-aviso-no-modulo.md` ·
`docs/produto/fila-local-autoridade-e-identidade.md:123` (`RN-OFF-032`) ·
`docs/produto/papeis-e-permissoes.md:281` (`LACUNA-NUC-011`) · `.claude/rules/backend.md` (abertura, §1) ·
`docs/backlog/F-002-fundacao-do-servidor.md` · `docs/backlog/F-021-modelar-estabelecimento-e-terminal-habilitado.md`
