# F-010 — `PRV`: o provisionamento que falha no meio passa a produzir fato, no passo em que parou

**Tipo:** Comportamento fechado · **Estado:** a fazer · **Dono:** `produto` · **Território:**
`docs/produto/**` · **Cobre o achado** `2.10` da varredura do invariante 10

## Objetivo

`RN-PRV-013` diz, com estas palavras, que **falha também é fato**. A tabela de
`docs/produto/fatos-de-operacao-provedor.md` §3 define `tenant_provisioned` no instante "ao concluir o
provisionamento", e a decisão declarada na própria célula é "quanto tempo leva pôr um cliente em pé, e
**onde o provisionamento falha**".

Entre a regra e a tabela há um buraco, e ele é contradição interna: **o provisionamento que começou e
não concluiu não tem onde existir.** Migration tem cobertura — `migration_applied` é linha por
`(schema, versão)`, com desfecho, e falha é linha, não ausência. O **passo que contém a migration** não
tem. Provisionar é o conjunto de migrations **mais** módulos contratados, habilitação de emissão por UF
e por ambiente (`RN-EMI-012`), segredos por UF (`RN-EMI-007`) e as atribuições nomeadas do
estabelecimento (`RN-NUC-020`) — e a falha fora da migration é invisível.

Com um cliente por vez isso parece dispensável. Com N, é a diferença entre "demora muito" e "demora no
passo 4, que depende de terceiro".

## Escopo

- **Fato de passo de provisionamento**, com o passo, o instante e o desfecho — o mesmo mecanismo que
  `RN-PRV-013` já usa para migration, estendido ao passo que a contém.
- **A enumeração fechada dos passos**, que nasce junto com a regra: enumeração aplicada depois não
  estreita nada (`RN-NUC-043`).
- **Cláusula em `fatos-de-operacao-provedor.md` §3** resolvendo a contradição: `tenant_provisioned`
  continua marcando a conclusão, e o passo que não concluiu tem fato próprio, não ausência.
- **O denominador**: quantos provisionamentos foram tentados, contra quantos entraram em pé. Sem o
  fato do que começou, nenhuma taxa tem denominador.

## Fora de escopo

- **Mudar `tenant_provisioned`.** Ele continua sendo a conclusão, no instante da conclusão. O item
  acrescenta o que existe **antes** dele, não o redefine.
- **`migration_applied`.** Já resolvido, e é o precedente que o item copia — não o caso a consertar.
- **Retomar ou consertar provisionamento que falhou.** O executor já é retomável
  (`.claude/rules/migrations.md` §2); este item registra o que aconteceu, não muda o que acontece.
- **A superfície que lê isso.** `superficie-do-provedor.md` é Fase 3, e escrever tela agora é escrever o
  artefato que a Fase 3 descarta.
- **As 15 linhas candidatas do escopo `provedor`** em `matriz-celulas-a-valorar.md` §1 (eram 14 até a
  `A7` entrar, em 2026-09-23, com `RN-NUC-090`; a contagem mudou, o escopo não). A linha `A1`
  (provisionar · encerrar) continua em branco e continua negada por default (`RN-PRV-015`); este item
  não a valora e não depende dela — registrar o que o **processo** fez não é ato de papel nosso sobre
  cliente.

## Critério de aceite

1. Provisionamento de cliente novo falha no passo de habilitação de emissão por UF. Existe fato do
   passo, com o desfecho de falha e o instante; não existe `tenant_provisioned`. A ausência do segundo
   nunca é lida como "ainda em andamento" nem como "concluído".
2. O mesmo provisionamento é retomado e conclui. Existem os fatos dos passos, **inclusive o que
   falhou**, mais `tenant_provisioned`. A falha anterior não é apagada nem sobrescrita — é linha nova,
   não edição (`PN-07`).
3. Contar, sobre uma janela, provisionamentos tentados × concluídos × parados, e por qual passo pararam,
   devolve os três números. É a decisão escrita na própria célula de `fatos-de-operacao-provedor.md`
   §3, e hoje ela não é respondível.
4. Passo que depende de terceiro (autorizador, credencial) e passo nosso são distinguíveis na leitura.
   É a diferença entre "somos lentos" e "esperamos alguém", e ela muda o que se faz a respeito.
5. Falha ao registrar o fato do passo **não interrompe** o provisionamento nem muda o desfecho dele.

## Registra / Não registra

**Registra:**

- **Início e desfecho de cada passo do provisionamento**, com o passo enumerado e os dois instantes.
- **A falha, quando houver**, com o passo em que ela ocorreu — que é a única coisa que responde "onde o
  provisionamento quebra".
- **Que houve tentativa**, mesmo quando ela não chegou ao fim. Sem isso não há denominador.

**Não registra, e por quê:**

- **Nenhum dado de pessoa, em nenhum dos fatos.** Passo, instante e desfecho bastam. Provisionar é
  processo nosso sobre infraestrutura, e `fatos-de-operacao-provedor.md` §4 já enumera as seis coisas
  que os fatos nossos nunca carregam.
- **Valor de segredo de emissão**, nem parte dele, nem derivação. Já proibido pela §4, e é repetido aqui
  porque o passo de segredos por UF (`RN-EMI-007`) é justamente um dos que falham.
- **Conteúdo do erro devolvido por terceiro.** Texto de terceiro não vira campo de decisão
  (`RN-PRV-014` e a cláusula da forma, `PRV-16`): o fato nomeia **o passo** e **o desfecho**, não
  transcreve a resposta do autorizador.
- **Duração do passo como campo.** Marco, não duração (`RN-NUC-045`) — início e fim já são dois
  instantes.

## Depende de

**Nada em aberto — o item é executável hoje.** `RN-PRV-013` já existe e já diz que falha é fato;
`migration_applied` é o precedente do mecanismo, com desfecho por linha; `fatos-de-operacao-provedor.md`
§3 e §4 são a casa e o limite.

A única condição de ordem é interna: a enumeração de passos nasce junto com a regra, nunca depois
(`RN-NUC-043`).

## Gate obrigatório

**`produto`** — fronteira, e ela é a que este item mais arrisca errar: provisionar é **plataforma** como
mecanismo e **provedor** como operação (`fronteira-do-nucleo.md` §1). O fato mora no provedor, e o card
confirma que nada dele desce para módulo ou vertical, nem sobe para regra de venda.

Nenhum gate de `seguranca` nesta passada — é spec e não toca DDL nem endpoint. Ele entra na modelagem,
onde a pergunta é se o fato alcança algo de cliente.

## Referências

`docs/produto/captura-varredura-invariante-10-2026-09-11.md` §2.10 ·
`docs/produto/fatos-de-operacao-provedor.md` §3 (`tenant_provisioned`, `migration_applied`) · §4 (as
seis recusas) · `RN-PRV-013` · `RN-PRV-014` · `RN-PRV-016` · `RN-EMI-007` · `RN-EMI-012` ·
`RN-NUC-020` · `RN-NUC-043` · `RN-NUC-045` · `PN-07` · `PN-19` ·
`docs/produto/fronteira-do-nucleo.md` §1 · `.claude/rules/migrations.md` §2
