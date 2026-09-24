# Pendências que travam as Fases 1 e 2 — inventário de 2026-09-23

> **O que é.** O conjunto fechado do critério 1 de `F-018` (passo A.1 de `T-0014`): toda lacuna, pergunta
> e decisão que impede modelar o núcleo (Fase 1) ou fechar venda e pagamento com idempotência e offline
> (Fase 2, `.claude/rules/processo.md` §4). Cada linha diz onde nasce, o que trava, a classe e, para a
> classe (a), a recomendação com o eixo em que ela escala.
>
> **O que não é.** Não decide nada. A decisão é das passadas A.2a, A.2b e A.2c; o aviso é de A.3.
>
> **Classe (a)** — decidível agora pelo thread, pelo critério de escalabilidade
> (`memory/processo/convention-decisao-delegada-com-aviso-no-modulo.md`). **Classe (b)** — a resposta
> depende de contador, advogado, adquirente, norma ou loja real; recebe aviso, nunca decisão.
>
> **Os endereços foram lidos em 2026-09-23, com outras instâncias editando `docs/produto/`.** Dois já
> andaram durante a leitura (`fatos-de-operacao.md` e `modulos/perifericos.md`). Quem for editar confere
> a linha pelo id da lacuna, não pelo número.

## 1. O que foi varrido

Seções de lacuna, na íntegra: `nucleo-venda.md` §6 · `nucleo-estabelecimento.md` §4 ·
`operacao-offline-e-sincronizacao.md` §8 · `fila-local-autoridade-e-identidade.md` §5 ·
`fila-local-conteudo-e-repouso.md` §5 · `offline-grandezas-e-orcamento.md` §3 · `papeis-e-permissoes.md`
§6 · `matriz-operacao-papel.md` §9 · `matriz-operacao-papel-modulos.md` §9 · `superficie-por-papel.md` §6
· `fatos-de-operacao.md` §7 · `glossario.md` §7 · `modulos/perifericos.md` §4 · `modulos/fiscal.md`
(Lacunas) · `backlog-lacunas-g01-g09.md` inteiro · `dois-varejos-auditoria-do-nucleo-2026-09-12.md` §4 e
§5 · `roadmap-de-modulos.md` §4, §5.3, §7 e §10.

Citações de lacuna no corpo, sem seção própria: `nucleo-caixa-e-turno.md` (`:79`, `:186`) ·
`nucleo-publicacao-e-texto.md` (`:45`–`:49`, `RN-NUC-013`) · `fatos-de-operacao-retencao-e-descarte.md`
(`RN-NUC-046`, `RN-NUC-049`) · `fronteira-do-nucleo.md` §2.

Fora de `docs/produto/`: `memory/plataforma/state-pendencias-abertas-2026-08-23.md` inteiro ·
`memory/plataforma/INDEX.md` · `docs/auditorias/2026-08-23-custo-de-agregacao-do-provedor-caminho-critico.md`
(`CST-07`) · `docs/backlog/INDEX.md` e os itens `SPR-34`, `SPR-37`, `SPR-43`, `SPR-52`, `F-018`, `F-021` ·
`tarefas/INDEX.md` e `T-0009` (plano) · `CLAUDE.md` §8.

Não varrido, e por quê: as seções de lacuna de `EMI` (`fiscal-emissao-*.md`, `fiscal-custodia-e-trilha.md`),
`MSA`, `COZ`, `PCF`, `ATI`, `REL`, `RES` e do escopo `provedor`. `EMI` está desligado por padrão no MVP
(`roadmap-de-modulos.md:159`) e só as três reservas dele entram na Fase 1, que estão aqui como `G-01`; os
outros são Fase 4 em diante ou escopo `provedor`, fora de `F-018`.

## 2. Classe (a) — o que trava a Fase 1

A ordem é a de `F-018` (Escopo, "Ordem dentro do item"): as quatro de `F-021` primeiro.

**A1. `LACUNA-GLO-001` = `NUC-001` = `OFF-006` — fuso.** Nasce em `glossario.md:395`,
`nucleo-venda.md:349`, `operacao-offline-e-sincronizacao.md:349`. Trava `F-021`, `SPR-36`, `SPR-37`
(aceite 5), `SPR-46`, `SPR-34` (invariante 5). Passada: A.2a.
Recomendação: o fuso do **estabelecimento** decide vigência, "hoje", turno e fechamento de cada unidade; a
leitura que soma unidades agrega pelo dia local de cada uma e declara isso. O cliente (tenant) não tem fuso
de negócio. Eixo: N estabelecimentos por cliente. Com o fuso do cliente, toda unidade fora dele fecha o
dia com venda do dia vizinho, e o único conserto seria partir o cliente em dois, o que acaba com a leitura
consolidada dele, porque ela não cruza schema. Custo da recomendada: alterar `glossario.md:33`
(`tenant_time_zone`), `fronteira-do-nucleo.md:57` e `.claude/rules/dados.md` §3 (este último é do thread);
`RN-FIS-008` e `modulos/fiscal.md:197` já usam o estabelecimento. Nenhum fato migra
(`convention-fato-nao-carrega-campo-de-calendario`). Caso de prova de `F-018` (critério 6): venda em B
(`America/Manaus`) às 23h30 de 2026-09-23, hora de Manaus, é 00h30 de 2026-09-24 em São Paulo; pertence a
2026-09-23 no fechamento de B e conta em 2026-09-23 na leitura A + B. Com o fuso do cliente em São Paulo,
cairia em 2026-09-24 e o fechamento de B do dia 23 sairia sem ela.

**A2. `LACUNA-NUC-041` — moeda.** Nasce em `nucleo-estabelecimento.md:168`. Trava `F-021`, `SPR-40`.
Passada: A.2a.
Recomendação: moeda do **estabelecimento**, que é o que `RN-NUC-013` (`nucleo-publicacao-e-texto.md:49`)
e a linha 38 da matriz já dizem. Leitura que soma unidades de moedas diferentes apresenta por moeda, nunca
soma nem converte. Eixo: N estabelecimentos por cliente; com todas as unidades em real, degenera sem custo.
A moeda do cliente obrigaria quem abre uma unidade em outra moeda a virar dois clientes. Alterar
`glossario.md:35` e `fronteira-do-nucleo.md:57`. Acoplamento a avisar `T-0018`: a escala da menor unidade
depende da moeda, então representação em centavos fixos presume duas casas.

**A3. `LACUNA-NUC-042` — encerrar estabelecimento.** Nasce em `nucleo-estabelecimento.md:172`. Trava
`F-021`. Passada: A.2a.
Recomendação: a operação existe, como fato datado de mudança de estado (a unidade é entidade datada,
`business-rule-estabelecimento-e-entidade-datada-nunca-campo`). Só `owner`, com contato. Recusa enquanto
houver sessão de caixa aberta, fila de terminal não drenada nem transferida (linha 30), faixa não encerrada
(linha 31) ou obrigação documental pendente; no mesmo ato as habilitações dos terminais daquela unidade são
revogadas. O dado continua legível. Recomendo irreversível: reabrir desfaz as precondições que o
encerramento conferiu. Eixo: estabelecimentos ao longo dos anos; sem a operação, loja fechada segue com
terminal habilitado e aparece como ativa em toda leitura por unidade. Célula nova na matriz, no mesmo
despacho (`gotcha-regra-nova-que-nao-corrige-a-celula-nasce-inerte`).

**A4. `LACUNA-NUC-043` — estabelecimento muda de cliente.** Nasce em `nucleo-estabelecimento.md:178`.
Trava `F-021`. Passada: A.2a, depois de A3.
Recomendação: não muda; `RN-NUC-050` fica como está. A necessidade (venda da loja, reorganização
societária) é atendida por encerrar em A (A3), criar em B e exportar o histórico de A (`PN-10`). Recusado:
mover o estabelecimento com o histórico, que é o único caminho do sistema que atravessa o isolamento, e o
custo dele cresce com N clientes, porque cada travessia é um caso de vazamento a auditar. O gate de
`seguranca` de `F-018` vale se o thread escolher "sim"; na saída "não" não há caminho a auditar.

**A5. `G-01` — as três reservas da Opção B.** Nasce em `backlog-lacunas-g01-g09.md:146`. Trava
`SPR-37`, `SPR-34`. Passada: A.2a.
O "sim" já foi decidido (A seção 6 abaixo). O que resta: (i) o recorte, e recomendo item próprio antes de
`SPR-37` em vez de crescer `SPR-37` (é a segunda saída de `backlog-lacunas-g01-g09.md:155`); (ii) o
**grão** do congelado, e recomendo o mais fino já escrito, `item × tributo × base × regime × redutor`,
com os insumos que a regra leu (`roadmap-de-modulos.md:328-334`), porque o fino se agrega no grosso e o
inverso é irrecuperável (`RN-FIS-005`); (iii) a forma da numeração, que tem de sobreviver às duas
respostas de `LACUNA-OFF-002` (B4).

**A6. `G-02` = metade de `LACUNA-NUC-007`, com `LACUNA-NUC-032` e o achado `A-02` — turno.** Nasce em
`nucleo-venda.md:373`, `superficie-por-papel.md:360`, `dois-varejos-auditoria-do-nucleo-2026-09-12.md:142`.
Trava `SPR-37`. Passada: A.2a.
Recomendação: a sessão de caixa continua o eixo obrigatório de conferência; turno é agrupamento
**opcional**, declarado por estabelecimento, de sessões e de intervalo. Fechar turno não fecha sessão;
turno aberto na virada pertence ao dia local em que abriu. `NUC-032`: não existe "abrir o dia"; o dia é
derivado do fuso da unidade e o fechamento é o único marco. Eixo: N verticais; turno obrigatório impõe
cerimônia à loja de uma pessoa só, e turno ausente tira de quem troca de responsável no mesmo dia a
separação de quem é cada real. `fronteira-do-nucleo.md:115` passa a dizer "núcleo, opcional". A resposta
registrada do humano, "depende do cliente" (`nucleo-venda.md:380`), é a assinatura de configuração, e a
recomendada a acomoda.

**A7. `LACUNA-NUC-003` — grão da referência humana da venda.** Nasce em `nucleo-venda.md:357`. Trava
`SPR-37`. Passada: A.2a, com entrada de `arquiteto-dados`.
Recomendação: referência curta derivada da faixa do terminal, única no estabelecimento, sem reinício
diário e sem densidade. Não é identidade (`D-04`) nem número de documento (A5, B4). Recusado: sequência
densa diária por estabelecimento, que exige alocação central com contato e falha com N terminais offline
(`RN-OFF-006`).

**A8. `A-04`, com `LACUNA-NUC-015` — loja de uma pessoa só.** Nasce em
`dois-varejos-auditoria-do-nucleo-2026-09-12.md:188` e `matriz-operacao-papel.md:370`. Trava a linha 7 da
matriz e a fronteira `:124`. Passada: A.2a, com a consulta a `seguranca` do plano.
Recomendação: uma pessoa com `owner` opera tudo pelo próprio papel; separação de funções é opção do
cliente, nunca exigência; operação sensível continua registrada. Para `NUC-015` recomendo a terceira saída
(o `owner` não tem teto de desconto, com `R` e trilha), porque a segunda (outro `owner` autoriza) não existe
na loja de uma pessoa e a primeira congela o `owner` no primeiro número publicado, já que ampliar o próprio
limite é vedado (`RN-NUC-023`). É a mesma pergunta que o plano leva a `seguranca`, e vai nela.

**A9. Catálogo: `G-03`, `G-04`, `G-05`, `G-07`, `A-01`, `A-05`.** Nascem em
`backlog-lacunas-g01-g09.md:81`, `:125`, `:100`, `:207` e em `dois-varejos-auditoria-do-nucleo-2026-09-12.md:106`,
`:202`. Travam `SPR-31`, `SPR-32`, `SPR-33`, `SPR-26`, `SPR-27`. Passada: A.2b.
- `G-03`: agrupamento **operacional** opcional no núcleo, para achar item no caixa; apresentação ao
  cliente-final é de `PUB`; nomes distintos no glossário. Degenera em zero grupos na loja que lê etiqueta.
- `G-04`: variação, com um eixo ou vários, é `GRD`; o item do núcleo fica atômico, e a fronteira difusa
  entre "um eixo" e "dois" some. Custo: com `GRD` fora do MVP, tamanho de bebida é item por combinação até
  `GRD` entrar, e pôr `GRD` no MVP é escopo comercial, do humano.
- `G-05`: adicional é **multiconjunto** (degenera em conjunto com quantidade 1; o inverso proíbe "bacon
  duplo") e é capacidade de módulo que compõe valor publicando artefato versionado, pelo contrato já escrito
  em `nucleo-publicacao-e-texto.md:77-80`. O teste dos três negócios não passa no núcleo
  (`backlog-lacunas-g01-g09.md:109`).
- `G-07`: sem marca de disponibilidade no núcleo; tirar item de venda é publicar versão de catálogo sem ele
  (`RN-NUC-014`); disponibilidade real é de `EST`. Cada estado a mais no núcleo se replica em N terminais
  offline. Entra no conjunto apesar de `F-018` (Fora de escopo) porque decide se a lista fechada de
  `RN-NUC-013` ganha membro (`nucleo-publicacao-e-texto.md:29-33`).
- `A-01`: lista de preço por estabelecimento e vigência; canal é do módulo que o cria (as quatro partes
  estão em `dois-varejos-auditoria-do-nucleo-2026-09-12.md:122-136`).
- `A-05`: observação livre fica no núcleo (`RN-NUC-016`); instrução que muda valor é adicional (`G-05`).

## 3. Classe (a) — o que trava a Fase 2

**A10. `LACUNA-NUC-002` — item de preço aberto.** `nucleo-venda.md:354`. Passada: A.2a, e A.2b para o
artefato. Recomendação: existe, como propriedade do item publicado, com teto por papel publicado e recusa
acima dele. Sem ele, o operador cria um item-coringa com preço falso, e a trilha perde o que foi vendido.
O teto é membro novo da lista fechada de `RN-NUC-013`, logo altera essa regra.

**A11. Metade de `LACUNA-NUC-006`, e `LACUNA-NUC-035` — forma do domínio de meios.**
`nucleo-venda.md:369`, `matriz-operacao-papel.md:381`. Passada: A.2a (`005`) e A.2b (`013`).
Recomendação: o núcleo fecha a forma: espécie (`RN-NUC-004`) e meio que exige resultado de terceiro
(`RN-NUC-005`), com a marca de exigência como atributo publicado. Os meios concretos são linhas de domínio,
inseríveis sem migration (`.claude/rules/dados.md` §3). `NUC-035` fecha no estado atual: a marca é do
`owner`, não delegável, até `ADQ`/`PGO`/`PRZ` terem spec. A outra metade de `006` é B3.

**A12. `LACUNA-NUC-016` — abrir sessão em nome de outro.** `matriz-operacao-papel.md:375`, linha 11.
Trava `SPR-37`. Passada: A.2a. Recomendação: `manager` e `owner` com `R`; responde pelo fundo quem abriu,
até o operador assumido conferir a abertura, e essa conferência é fato. Eixo: N sessões por dia em loja
que abre antes de o operador chegar.

**A13. Linha ausente na matriz — habilitar terminal a vender (`RN-OFF-032` i).** Achado da onda 0,
confirmado em 2026-09-23: nenhuma das três matrizes tem operação de cadastrar ou habilitar terminal
(`grep habilit` em `matriz-*.md` devolve módulo, emissão por UF, modos de atendimento, meio de pagamento,
a leitura de inventário do escopo `provedor` e prosa do contrato citando `RN-OFF-032`). Pelo default de
`RN-NUC-026`, habilitar é negado a todos, e sem terminal habilitado **nenhum** ato ordinário acontece.
Trava `F-021` e toda a Fase 2. Passada: A.2a (`matriz-operacao-papel.md`).
Recomendação: linha nova "Cadastrar terminal e habilitá-lo a vender por um estabelecimento; revogar a
habilitação", `manager` e `owner` com `R`, demais `N`, `Offline` recusa (a habilitação nasce com contato).
Renovar não é ato de papel: acontece no contato do terminal habilitado e não revogado (`RN-OFF-032` i).
`F-021` devolve duas perguntas que caem aqui: reabilitar terminal declarado comprometido (`F-021:78-80`) e
mover terminal entre estabelecimentos (`F-021:46-47`). Recomendo as duas como cadastro novo (esta linha)
mais descomissionar (linha 30), sem operação própria: o fato de comprometimento fica intacto e a
habilitação nova tem outro terminal como sujeito.

**A14. Números do offline, todos configuração por cliente com vigência (`RN-OFF-028`).** Recomendação comum:
cada um ganha default, piso e teto que a configuração não atravessa, e a série que o revisa. Nenhum valor
abaixo foi medido.
- `LACUNA-OFF-004` (`operacao-offline-e-sincronizacao.md:347`) — teto de vendas pendentes; a exceção de
  `RN-OFF-025` existe (está escrita). Proposta: teto limitado pelo recurso local e pela faixa restante.
- `LACUNA-OFF-011` = `NUC-008` (`fila-local-autoridade-e-identidade.md:306`) — papel retido. Proposta: da
  ordem de uma sessão de caixa; desde `RN-OFF-032` ele só custa o alcance sensível.
- `LACUNA-OFF-014` (`fila-local-conteudo-e-repouso.md:199`) — janela de reimpressão sem rede, com
  `seguranca`. Proposta: a do fechamento do dia, que é quando a venda recente deixa de ser recente.
- `LACUNA-OFF-016` (`fila-local-autoridade-e-identidade.md:317`) — reconciliação do conjunto de
  identificação. Proposta: a cada contato, o que faz a janela do operador desligado ser a duração da queda,
  limitada por `OFF-017`, sem relógio próprio. O tamanho máximo sai de medida.
- `LACUNA-OFF-017` (`fila-local-autoridade-e-identidade.md:325`) — habilitação a vender, com `seguranca`.
  Proposta: dias sem contato, com aviso de pelo menos um ciclo de fechamento de antecedência. Relação a
  manter: `OFF-011` < `OFF-017`.
- `LACUNA-NUC-014` (`papeis-e-permissoes.md:290`) e `LACUNA-NUC-033` (`superficie-por-papel.md:364`) —
  antecedências de aviso. Relação: aviso de `033` antes do fim de `OFF-011`.
- `LACUNA-NUC-034` (`papeis-e-permissoes.md:293`) — teto de delegação.
- `LACUNA-NUC-039` (`fatos-de-operacao.md`, `RN-NUC-046`) — teto de diagnóstico retido; o default
  conservador já está escrito (`fatos-de-operacao-retencao-e-descarte.md:79-81`), falta a grandeza como
  fração do recurso local.
- **Espaçamento de retentativa de operação recusada** — sem id; `CST-07`
  (`docs/auditorias/2026-08-23-custo-de-agregacao-do-provedor-caminho-critico.md:140-158`). Dono: `produto`
  para a grandeza, declarado agora. Recomendação: a cardinalidade de `operation_refused` não depende do
  ritmo de retentativa; recusa idêntica repetida (mesma operação, motivo, operador e terminal) vira um fato
  com contagem e primeiro e último instante, como a contagem de descarte de `RN-NUC-046`. Eixo: terminais ×
  duração da queda; com um fato por tentativa, um terminal em `D2` produz fatos na proporção do inverso do
  espaçamento, independente de venda.
- `LACUNA-NUC-040` (relógio discricionário) com `LACUNA-REL-001` — na mesma passada (`RN-NUC-049`).
  Proposta: retenção ≥ a janela semestral que o humano pediu. O relógio de obrigação é B7; o de prova é
  `F-019`.

**A15. `G-08` — busca de catálogo.** `backlog-lacunas-g01-g09.md:228`. Trava `SPR-17`. Passada: A.2c.
Recomendação: leitura local sobre o catálogo publicado retido, integral offline; buscável é o que o
catálogo publica (código e descrição). Recusado: operação de servidor, que some quando o link cai no único
caminho que não aceita regressão. Pede gate de `performance`. Entra no conjunto apesar de `F-018` (Fora de
escopo): operação não classificada é recusada pelo default de `RN-OFF-008`, então sem decisão a busca do
caixa nasce recusada (`backlog-lacunas-g01-g09.md:238-239`).

## 4. Classe (b) — o aviso, na forma de `F-018`

O `Enquanto isso` de cada um cita a regra ou o default que já produz o desfecho. Onde o arquivo é de
núcleo, ele está com A.2a ou A.2b, não com A.3 (seção 8).

**B1. `G-09` = `LACUNA-NUC-004` — precisão e arredondamento.** `nucleo-venda.md:362`,
`nucleo-publicacao-e-texto.md:46`. Trava `SPR-40` (metade de política), `SPR-28`, `SPR-29`. A parte de
mecanismo é (a) e vai para A.2a antes do aviso: a regra de composição é artefato publicado pelo `owner`
(linha 38, `nucleo-publicacao-e-texto.md:62`), versionado e congelado no fato; o produto enumera os modos e
não escolhe; o rateio garante soma exata na menor unidade. Versionada, uma resposta do contador que
contrarie a escolha do cliente vira versão nova para fatos novos, e nenhum fato migra.
> **Indisponível — arredondamento proposto pelo produto.** Não funciona: o produto não sugere nem afirma
> qual arredondamento e qual ordem de precisão a norma exige na composição do valor. Falta: a regra
> aplicável, confirmada. Responde: humano, com o contador. Enquanto isso: vale o que o `owner` publicar
> para o estabelecimento (linha 38, `RN-NUC-013`); sem publicação, a composição que precisa arredondar
> falha fechado (`RN-NUC-013`, infeliz a). Desde: 2026-09-23.

Onde: `nucleo-publicacao-e-texto.md` (linha `:46` do conjunto) e `nucleo-venda.md` §6.

**B2. `LACUNA-NUC-005` — correção aditiva antes da autorização.** `nucleo-venda.md:366`. Trava venda
offline na Fase 2. Aviso: o exemplo de `F-018` (`docs/backlog/F-018-...md:40-43`), sem mudança. Onde:
`nucleo-venda.md` (`RN-NUC-008` e §6). Conferir antes: com `EMI` desligado não há autorização de documento
na Forja, e a redação de `RN-NUC-008` precisa dizer o que vale nesse perfil.

**B3. Metade de `LACUNA-NUC-006` — quais meios exigem terceiro, e captura offline pré-autorizada.**
> **Indisponível — pagamento por meio que exige terceiro, sem contato.** Não funciona: registrar pagamento
> de cartão ou de outro meio que exige autorização de terceiro com o terminal sem contato, inclusive
> captura pré-autorizada. Falta: o que o adquirente admite, e quais meios exigem autorização. Responde:
> humano, com o adquirente. Enquanto isso: recusa sem contato (`matriz-operacao-papel.md` linha 5,
> `RN-NUC-005`); meio sem a marca de exigência publicada é recusado (`RN-NUC-013`, infeliz a). Desde:
> 2026-09-23.

Onde: `nucleo-venda.md` (`RN-NUC-005` e §6). `ADQ`, `PGO` e `PRZ` não têm spec onde pôr o lado do módulo.

**B4. `LACUNA-OFF-002` — faixa de numeração fiscal por terminal.** `operacao-offline-e-sincronizacao.md:345`.
Trava a forma da reserva de numeração (A5).
> **Indisponível — numeração fiscal pré-alocada por terminal.** Não funciona: emitir documento fiscal sem
> contato consumindo faixa de número alocada a um terminal. Falta: confirmação de que a faixa por terminal é
> admissível e se exige série por ponto de emissão. Responde: humano, com o contador. Enquanto isso: `EMI`
> fica desligado por padrão (`roadmap-de-modulos.md:159`), e a reserva da Fase 1 é por estabelecimento e
> série, sem presumir série por terminal (`roadmap-de-modulos.md:258-259`). Desde: 2026-09-23.

Onde: `operacao-offline-e-sincronizacao.md` §8 e `fiscal-emissao-contingencia.md` (numeração, `RN-EMI-022`).
**Aplicado em parte, 2026-09-23:** `fiscal-emissao-contingencia.md:138`. Falta `operacao-offline-e-sincronizacao.md` §8.

**B5. `LACUNA-PER-2` — quantidade medida.** `modulos/perifericos.md` §4. Trava `SPR-40` na escala.
> **Indisponível — conformidade da quantidade medida com a norma do instrumento.** Não funciona: afirmar
> tolerância, arredondamento e casas exigidos para o que se cobra por medida, e verificar exigência sobre o
> instrumento. Falta: a norma aplicável, confirmada. Responde: humano. Enquanto isso: a leitura entra como
> leitura, com unidade e origem declaradas, e `PER` não converte nem arredonda (`RN-PER-018`); sem
> instrumento, a quantidade é informada e marcada (`RN-PER-019`). Desde: 2026-09-23.

Onde: `modulos/perifericos-classes.md` (`RN-PER-018`) e `modulos/perifericos.md` §4, depois de `T-0016`.
**Aplicado, 2026-09-23:** topo de `RN-PER-018` em `modulos/perifericos-classes.md` e linha de
`LACUNA-PER-2` em `modulos/perifericos.md` §4.

**B6. `LACUNA-FIS-002` — tributo contido no preço ou acrescido.** `modulos/fiscal.md:380`. Entra no
conjunto porque decide o total que o cliente-final paga (`modulos/fiscal.md:384-385`), que é desfecho da
venda.
> **Indisponível — tributo composto no total da venda.** Não funciona: saber se o IBS/CBS está contido no
> preço praticado ou é acrescido a ele no fechamento. Falta: a regra de composição do preço ao consumidor.
> Responde: humano, com o contador. Enquanto isso: `FIS` não entra no modelo da Fase 1 enquanto `D-05`
> estiver aberta (`roadmap-de-modulos.md:317-319`), e a venda conclui como com `FIS` desligado, sem
> tributo composto e com comprovante não fiscal (`modulos/fiscal.md:202-203`). Desde: 2026-09-23.

Onde: `modulos/fiscal.md` (Lacunas).
**Aplicado, 2026-09-23:** `modulos/fiscal.md:80` (topo da §2, `FIS`), com ponteiro na linha de `LACUNA-FIS-002` (`:385`).

**B7. `LACUNA-NUC-040`, relógio de obrigação — guarda de fato fiscal e financeiro.**
> **Indisponível — descarte de fato fiscal e financeiro por prazo.** Não funciona: descartar venda,
> pagamento, movimento de caixa ou documento ao fim de um prazo. Falta: o prazo legal de guarda. Responde:
> humano, com o contador. Enquanto isso: nada dessas classes se descarta (append-only,
> `.claude/rules/dados.md` §4; `RN-NUC-049` d). Desde: 2026-09-23.

Onde: `fatos-de-operacao-retencao-e-descarte.md` (`RN-NUC-049`).
**Aplicado, 2026-09-23:** `fatos-de-operacao-retencao-e-descarte.md:89` (topo de `RN-NUC-049`).

## 5. Já decidido, e o registro ainda não sabe

| O quê | Onde fechou | Onde ainda aparece aberto |
|---|---|---|
| `D-01` fechada: Fastify e Kysely, 2026-09-11 | `CLAUDE.md` §8 | `memory/plataforma/INDEX.md:90` ("ORM e framework HTTP seguem abertos") · `state-pendencias` §3.8 · `SPR-52` inteiro · `SPR-34:15` · `roadmap-de-modulos.md:154` |
| `D-02` fechada: arranjo D, 2026-09-11 | `CLAUDE.md` §8 | `state-pendencias` §3.8, que aponta para `[[state-d-02-arranjo-b-ou-d]]`, registro já removido · `SPR-35` (título), `SPR-42`, `SPR-43` |
| `D-04` fechada, 2026-09-11 | `CLAUDE.md` §8 | `state-pendencias` §3.2 · `operacao-offline-e-sincronizacao.md:346` (`OFF-003` diz "`D-04` está ABERTA") · `roadmap-de-modulos.md:154` · `SPR-39` "a fazer" |
| `LACUNA-NUC-038` fechada, saída B, 2026-09-11 | `fatos-de-operacao.md` §7 | `state-pendencias` §3.1 e a lista dos cinco de maior alavanca |
| `LACUNA-GLO-002` fechada por `RN-NUC-048`, 2026-08-23 (`service_mode`) | `glossario.md:396` | `roadmap-de-modulos.md:155`, `:171`, `:389` · `matriz-operacao-papel-modulos.md:250-251` (`NUC-024`) |
| `LACUNA-PER-6` virou `RN-NUC-063`, 2026-09-23 (nasceu como `057` e foi renumerada: `057` é a regra de fuso) | `fatos-de-operacao-dominios-fechados.md:137` | nenhum: `F-018:70`, `:79` e `:166` já a dão por fechada |
| `G-01`, a pergunta "a Fase 1 modela?": sim, condição da Opção B | `roadmap-de-modulos.md:264-266` (T-0005) | `backlog-lacunas-g01-g09.md:146` · `state-pendencias` §0 item 6 |
| `LACUNA-OFF-007`, metade de papel: `queue_owner` (linha 22) | `papeis-e-permissoes.md:290-292` | `operacao-offline-e-sincronizacao.md:350`; o que resta é `NUC-014` |
| `LACUNA-OFF-012` desbloqueada: `D-01` e `D-02` fecharam | `CLAUDE.md` §8 | `fila-local-conteudo-e-repouso.md:197` ("ABERTAS"); segue com `arquiteto-dados`/`backend` e gate de `seguranca` |
| Epic `SPR-35` em paralelo com a Fase 1 | `CLAUDE.md` §2 (execução solo) | `state-pendencias` §0.2 |

## 6. Fora do conjunto, com o motivo

- **As perguntas à loja real**: `Q-A`, `Q-B`, `Q-C` (`dois-varejos-auditoria-do-nucleo-2026-09-12.md:235-244`)
  e as três de `state-pendencias` §0.3 (polpa por peso ou embalagem; roupa por etiqueta ou lista; ajuste
  cobrado). As recomendações A6, A8 e A9 sobrevivem a qualquer resposta: elas calibram, não decidem coluna.
- **`Q-D` e `A-03` — `service_mode` no núcleo** (`dois-varejos...:245`). Classe (b), sem aviso: nada fica
  indisponível. `RN-NUC-048` modela o modo como domínio fechado, e se ele descer para módulo o custo é
  coluna morta, não migração de dado (`.claude/rules/migrations.md` §4). Fica como risco em
  `fronteira-do-nucleo.md:86`.
- **`LACUNA-NUC-036`** (`nucleo-venda.md:385`) — localizar venda de outra unidade. Negada por default, e
  cabe depois sem migração, porque todo fato já nomeia a unidade (`RN-NUC-050`).
- **`LACUNA-OFF-009`**, **`LACUNA-NUC-012`** e as lacunas de `EMI` — só mordem com `EMI` ligado.
- **`LACUNA-OFF-003`** (mecanismo de faixa) e **`OFF-008`** (residência da fila) — mecanismo, de
  `arquiteto-dados` e `backend`; nenhuma decisão de produto pendente.
- **`LACUNA-OFF-005`** e **`OFF-013`** — números de fila e de plataforma, de `performance` com medida
  (`SPR-51` é a prova de `OFF-013`).
- **`LACUNA-OFF-015`**, **`NUC-009`**, **`NUC-010`**, **`NUC-011`** e as `LACUNA-IDE-*` — `F-017` (`D-03`).
- **`LACUNA-NUC-013`**, **`NUC-017`**, **`NUC-029`** — negam por default e não decidem coluna nem desfecho
  de venda; entram na Fase 2 quando houver rota de papéis.
- **`LACUNA-NUC-018`** a **`028`**, **`NUC-037`** (`F-009`), **`NUC-023`** (escopo `provedor`) e as de
  `MSA`, `COZ`, `PCF`, `ATI`, `REL`, `RES` — Fase 4 em diante ou `provedor`.
- **`LACUNA-PER-1`**, **`PER-3`**, **`PER-4`**, **`PER-5`** — do módulo; nenhuma decide coluna do núcleo.
  `PER-3` só morde com `EMI` ligado (a via de retenção é da contingência).
- **`D-05`** (`F-020`), **`D-06`**(ii) e o prazo da trilha após o cliente sair (`F-019`), terminal-alvo
  (`performance`), `state-pendencias` §1, §2, §3.10, §3.11 fora dos números de A14, e §4 — escopo
  `provedor` ou de outro item.
- **`LACUNA-FIS-001`**, **`003`** a **`012`** — só `EMI` ou regime; `D-05` já trava `FIS` inteiro.

## 7. Itens ausentes e itens desatualizados

**Fase 1 sem item** (o que `SPR-37`, `SPR-31`–`33` e `F-021` não cobrem):
- as três reservas da Opção B (A5), se o thread aceitar o recorte recomendado;
- a família de fatos de operação (`RN-NUC-041` a `049`, `052` a `057`), incluída a de recusa, que `CST-07`
  diz ser a tabela mais volumosa da fase;
- o conjunto publicado de `RN-NUC-013` fora do catálogo: lista de preço com vigência, limite por papel,
  meios de pagamento, configuração do estabelecimento, exceção pré-autorizada, e a versão congelada no fato;
- papéis, atribuição, delegação e trilha de auditoria (`RN-NUC-017` a `025`, `029`), depois de `F-017`;
- faixa pré-alocada (`RN-OFF-006`), que `F-021` põe fora de escopo (`F-021:49`).

**Fase 2 sem item nenhum**: rota de pedido e venda com idempotência (`RN-NUC-001`–`003`, `RN-OFF-013`) ·
pagamento (`RN-NUC-004`, `005`) · sessão de caixa, sangria, gaveta e fechamento do dia (`RN-NUC-009`–`012`,
`030`, `031`, `037`) · correção por fato novo (`RN-NUC-008`) · publicação ao terminal (`RN-NUC-014`, `015`) ·
fila, drenagem e sincronização (`RN-OFF-*`; `SPR-51` só prova a drenagem) · habilitação do terminal e
identificação do operador sem contato (`RN-OFF-032`, `033`), cujo modelo é `F-021` e o contrato não tem
item · o canal local entre página e acompanhante (`D-02`). O resíduo `SEC-06`..`SEC-11` de `T-0011`, "antes
da primeira rota de negócio", precisa entrar como gate de qualquer um desses.

**Desatualizados:**
- `SPR-52` — pergunta respondida por `D-01` em 2026-09-11. Recomendo recorte, com as quatro partes em
  `backlog-recortes.md` e o humano autorizando.
- `SPR-35` (título), `SPR-42`, `SPR-43` — alimentavam `D-02`, fechada; `SPR-50` já está concluído.
- `SPR-34` — `:15` diz ORM e HTTP abertos; o invariante 5 fixa "o fuso é dado do cliente".
- `SPR-36`, `SPR-37`, `SPR-46` — fixam fuso do cliente; `SPR-37` pede turno como período e não traz as
  reservas nem a família de fatos. `SPR-36` e `SPR-37` são de A.2a.
- `SPR-36`, `SPR-38`, `SPR-39` e `SPR-41` estão em execução dentro de `T-0009` (plano, `:26`) e o
  `docs/backlog/INDEX.md` os mostra "A fazer". A ficha cobre cinco itens, contra o par um para um de
  `.claude/rules/backlog.md` §4.
- `F-018` — a tabela lista `LACUNA-PER-6` como aberta e não traz `NUC-016`, `OFF-011`, `OFF-014`,
  `OFF-017` nem o espaçamento de `CST-07`, que estão aqui.

## 8. Divergências entre o plano de `T-0014` e o item

- **Pendência (a) sem passada no plano:** `NUC-002`, `NUC-003`, `NUC-006` (forma), `NUC-015`, `NUC-016`,
  `NUC-032`, `NUC-035`, a linha de habilitar terminal (A13) → A.2a, pelos arquivos; `OFF-004`, `OFF-011`,
  `OFF-014`, `NUC-014`, `NUC-033`, `NUC-034` → A.2c (`NUC-014` e `034` moram em `papeis-e-permissoes.md`,
  que é de A.2a).
- **O plano põe no conjunto o que `F-018` exclui:** `G-07` (A.2b) e `G-08` (A.2c) entram pelo motivo com
  `path:linha` dado em A9 e A15; `PER-1` (A.2c) não tem esse motivo e recomendo tirá-lo.
- **`G-09`:** o plano trata o rateio como (a) e `F-018` põe `G-09` inteiro com o contador. A separação de
  B1 concilia: mecanismo e invariante de soma são (a); a regra que a norma exige é (b).
- **A.3 não tem os arquivos dos avisos de núcleo:** B1, B2 e B3 moram em `nucleo-venda.md` e
  `nucleo-publicacao-e-texto.md`, que são de A.2a e A.2b. E A.3 lista `pedido-cliente-final.md`,
  `atendimento-ia.md` e `operacao-do-provedor.md`, onde este conjunto não tem pendência.

## Referências

`docs/backlog/F-018-decidir-as-lacunas-que-travam-as-fases-1-e-2.md` ·
`tarefas/T-0014-decidir-lacunas-das-fases-1-e-2.md` (Plano) ·
`memory/plataforma/state-pendencias-abertas-2026-08-23.md` ·
`memory/processo/convention-decisao-delegada-com-aviso-no-modulo.md` ·
`docs/produto/backlog-lacunas-g01-g09.md` · `docs/produto/dois-varejos-auditoria-do-nucleo-2026-09-12.md` ·
`docs/produto/roadmap-de-modulos.md` §5.3, §7 ·
`docs/auditorias/2026-08-23-custo-de-agregacao-do-provedor-caminho-critico.md` (`CST-07`)
