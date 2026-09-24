# Varredura do invariante 10 — terceira passada: os 14 arquivos sem `RN`

> **Irmão de `captura-varredura-invariante-10-2026-09-11.md`, não substituto dele.** A §1 (como a lista
> é ordenada), a §3 (ausências decididas e certas) e a §6 (fora de escopo) daquele arquivo continuam
> valendo inteiras e **não** são reenunciadas aqui. Este arquivo mora em casa própria por uma razão
> mecânica: a varredura está em 427 linhas contra teto de 400 (`00-nucleo.md` §8), e acrescentar a ela
> era piorar um defeito já declarado.
>
> **A numeração da §2 é contínua entre os dois.** Os achados abaixo são **2.13** e **2.14**; 2.1 a 2.12
> moram no arquivo original e nenhum número se reaproveita.
>
> **O que esta passada fechou:** os 14 arquivos **sem `RN`** que a §5 nomeava como não verificados. A
> lista de não verificados **deixou de existir** — `docs/produto/**` está lido por inteiro para efeito
> do invariante 10, e a §1 abaixo diz exatamente com que profundidade cada um foi lido.

---

## 1. A pergunta muda de forma em arquivo sem `RN`

Desfecho de operação vive dentro de regra numerada, então arquivo sem `RN` não esconde desfecho que não
captura. Ele esconde outra coisa, e a pergunta desta passada foi esta: **o arquivo recusa, restringe ou
enumera alguma coisa de um jeito que fecha uma captura sem ninguém ter perguntado?** Três formas
concretas, e foram elas que guiaram a leitura:

- **recusa de capacidade que arrasta a captura junto** — recusar o mecanismo é legítimo
  (`00-nucleo.md` §12); recusar junto o **fato** que aquele mecanismo produzia é perda silenciosa;
- **enumeração fechada sem entrada para o caso infeliz** — lista de motivo, estado ou desfecho sem o
  ramo "não deu certo";
- **prosa que repete mal a `RN` e, ao repetir, estreita** — o arquivo não governa, mas é o que alguém
  lê primeiro.

**Cobertura, por arquivo e com a profundidade declarada.** Lidos **por inteiro**:
`catalogo-de-capacidades.md` (o de maior risco declarado, item a item nas 10 entradas, nas 4
candidatas, nas 9 de horizonte e nas 7 recusadas) · `postura-nova-geracao.md` (os 20 `PN`, campo por
campo) · `fronteira-do-nucleo.md` · `postura-auditoria-pn.md` · `receitas-por-vertical.md` ·
`roadmap-de-modulos.md` · `matriz-celulas-a-valorar.md` · `catalogo-de-modulos.md` (as ~30 entradas,
com atenção ao campo `Sensível`) · `dois-varejos-corpo-de-prova-2026-09-11.md` ·
`backlog-lacunas-g01-g09.md` · `backlog-edicoes-correcoes-2026-08-26.md` ·
`revisao-backlog-spr-2026-08-26.md`.

Lido **de forma dirigida**, e o critério está dito porque a diferença importa: `backlog-edicoes-a-aplicar.md`
(1351 linhas) — estrutura inteira por heading, mais busca dirigida por recusa e por captura
(`não registra`, `sem registro`, `não grava`, `não captura`, `não produz fato`, `descartado`,
`não é necessário`, `sem trilha`, `sem autor`, `EXCLUIR`) e leitura das ocorrências. **Idem**
`revisao-backlog-spr-conferencia-2026-08-26.md`, §1 a §6 lidas, com a mesma busca.

**O que os quatro arquivos de backlog são, e por isso não governam nada:** registro de revisão de card,
de 2026-08-26, já **aplicado** — os cards em `docs/backlog/**` carregam o texto corrigido. Prova pontual:
`SPR-30` era o caso mais perigoso da lista (a descrição antiga dizia *"não é necessário apresentar
histórico detalhado da alteração no MVP"*), e em `docs/backlog/SPR-30-*.md:12` essa frase aparece hoje
**citada como mecanismo recusado**, com o motivo escrito ao lado. Nenhum card vivo fecha captura.

## 2. Os dois achados

### 2.13 O formulário de capacidade não pergunta o que a capacidade passa a registrar

**Onde:** `catalogo-de-capacidades.md` §1, a tabela de **14 campos obrigatórios** — e a regra que a
acompanha, "falta qualquer um → a entrada vai para §7".
**Não é capturado:** nada, ainda. O que falta é a **pergunta**: nenhum dos 14 campos pergunta o que a
capacidade passa a registrar, nem o que ela deliberadamente não registra. O campo 13 (`pessoa`) cobre o
**limite 1** do invariante — dado novo de pessoa —, que é a restrição, nunca o padrão.
**Perde-se:** a chance de decidir captura quando ela custa uma frase. A decisão não some: quando a
capacidade virar `RN`, `.claude/rules/produto.md` obriga as duas listas. Ela fica **cara e tardia** —
tomada por quem escreve a regra, meses depois de quem escreveu a necessidade.

**A prova de que o furo é real está dentro do próprio arquivo, e não foi de propósito.** `CAP-REL-001`
é a única das 10 entradas que fala de fato irrecuperável, e fala **por acidente**, em dois campos cuja
finalidade é outra: `EXIGE` nomeia "o **registro da antecipação antes do período**, que hoje não existe",
e `CUSTO QUE CRIA` diz que ele é "a única parte irrecuperável". Quem escreveu aquela entrada enxergou o
problema; o formulário não pediu, então as outras nove não o enxergaram.

**Espécie:** ausência **acidental**, e é a mais barata de consertar das doze — o arquivo é de
2026-08-22/23, anterior ao invariante 10.
**Encaminhamento:** card de baixa prioridade, dono `produto`, na faixa de 2.7. O que o card decide, e
não é meu: se o campo entra como 15º obrigatório (retro-preenchimento das 10 entradas, num arquivo a 9
linhas do teto) ou como cláusula de promoção — a entrada só é agendável depois de responder as duas
listas. A segunda saída é mais barata e cobre o caso que importa, que é a capacidade **agendada**.

### 2.14 Nó de manifesto descartado pelo terminal não produz fato — e o descarte é a promessa de `PN-12`

**Onde:** `postura-nova-geracao.md:228` (`PN-12`, `Como se prova`): *"servir a um terminal desatualizado
uma composição de tela com bloco novo — a tela abre, **o bloco desconhecido é ignorado**, a venda
fecha"*. Mesmo desfecho em `CLAUDE.md` §7.5 e em `.claude/rules/ui.md` §1.
**Não é capturado:** que um terminal descartou um nó — qual id, em que versão do cliente, quantas vezes.
Busca em `docs/produto/**` por descarte confirma que o que existe é outra coisa: `RN-NUC-046` e
`fatos-de-operacao-retencao-e-descarte.md` tratam do **fato descartado por retenção de recurso local**,
com a contagem de descarte virando fato próprio. O nó de manifesto não tem nada.
**Perde-se para sempre:** se a estreia de um bloco **chegou** ao parque de terminais. A degradação de
`PN-12` é silenciosa por desenho — é isso que a torna boa —, e degradação silenciosa é indistinguível de
funcionamento. `ui.md` já escreveu o sintoma: *"o sintoma chega como 'o caixa 3 não tem o botão'"*, e a
mesma regra exige que estreia de id em caminho crítico seja decisão registrada. Registrada contra o quê,
não existe.

**Este é o achado que só o recorte desta passada podia produzir, e vale dizer por quê:** composição de
tela por manifesto é **plataforma** (`fronteira-do-nucleo.md:59`), que `roadmap-de-modulos.md:154` põe
fora do território de `produto`. Logo ela não tem `RN` e nunca teria — o recorte "arquivo que carrega
`RN`" da segunda passada não a alcançava por construção, não por descuido.

**Espécie:** ausência **acidental**.
**Limite 1:** o fato não carrega nada de pessoa — terminal, versão, id descartado e instante bastam.
**Encaminhamento:** card, dono `produto`. Há casa e há precedente: fato de plataforma já mora na família
do provedor (`fatos-de-operacao-provedor.md` §3, linhas `migration_applied` e `tenant_provisioned`), e a
decisão que o fato informa — "a estreia chegou?" — é **nossa**, não do comerciante. Duas travas que são
do card: `RN-PRV-017` (d) limita o que se agrega sobre todos os clientes, e o grão (por ocorrência ou
contagem por terminal e versão) decide se o fato é série ou binário.

## 3. Acréscimos à lista de ausências decididas e certas

Continuação da §3 do arquivo original — o material que **não** precisa de trabalho. Os quatro primeiros
são declarações de recusa de captura com motivo escrito; o quinto é o padrão que os outros deveriam
imitar.

- `catalogo-de-modulos.md`, entrada `ADQ`, campo `Sensível` — *"número completo, CVV e trilha **não
  existem neste fluxo**"*. É o limite 2 do invariante, escrito num módulo que ainda não tem spec: a
  única declaração que `ADQ` tem hoje é a certa.
- `catalogo-de-capacidades.md` §9, `R-04` e `R-05` — montar histórico de cliente-final sem `CLF` é
  "retenção de dado de pessoa por efeito colateral, o oposto de decisão de produto"; reconhecer pessoa
  por característica física é fora da alçada de agent, com `D-03` aberta. Duas recusas de **captura**,
  com motivo, e as duas estão certas.
- `fronteira-do-nucleo.md:85` — identificação **opcional** do cliente-final é núcleo porque o documento
  a exige; **guardar histórico não**. Mesma decisão de `R-04`, dita no arquivo que decide fronteira.
- `postura-nova-geracao.md`, `PN-15`, `Como se prova` — nenhum dado sensível (cartão, documento de
  pessoa, credencial) aparece no canal de estado e pendências do terminal. Restrição de canal, decidida.
- `postura-nova-geracao.md`, `PN-17` — **o exemplar do padrão certo, e é por isso que ele está aqui.**
  Ele recusa o mecanismo (mensagem técnica na tela do caixa) e **move** o detalhe em vez de eliminá-lo:
  *"o detalhe técnico não é recusado: muda de lugar, vai para o registro interno"*, e o campo `MELHOR EM`
  fecha com *"sem perder informação"*. Recusa de mecanismo que nomeia o que a captura ganha é exatamente
  o que 2.13 quer que o formulário de capacidade passe a pedir.
- `revisao-backlog-spr-2026-08-26.md` §5.2, aplicada em `backlog-edicoes-correcoes-2026-08-26.md` §4 —
  consolidar dois lançamentos iguais numa linha foi recusado **porque apaga autor e instante**, e a
  necessidade (comanda legível no pico) volta como agregação de **apresentação** sobre fatos que
  permanecem separados. A recusa preservou a captura e disse em que frase.

## 4. O que esta passada não fez

- **Nenhuma `RN` nova**, pela mesma razão da segunda passada: não houve decisão do humano nesta sessão,
  e achado vira card.
- **Nenhuma alteração em `catalogo-de-capacidades.md`.** 2.13 é card, e a escolha entre campo 15 e
  cláusula de promoção é dele — acrescentar o campo aqui obrigaria a retro-preencher 10 entradas num
  arquivo a 9 linhas do teto, sem decisão que o sustente.
- **Nada sobre onde o fato de 2.14 repousa, nem sobre o grão dele** — `D-06`, `LACUNA-NUC-040`,
  `arquiteto-dados` e `performance`. Esta passada nomeia o que falta registrar, nunca a forma nem o preço.
- **`G-03`, `G-04`, `G-05`, `LACUNA-NUC-041`, `042`, `043`** — continuam do humano, e nada aqui as toca.

## 5. Referências

`captura-varredura-invariante-10-2026-09-11.md` §1, §2, §3, §5, §6 · `CLAUDE.md` §7.5 e §7.10 ·
`.claude/rules/produto.md` ("Capturar é o padrão") · `.claude/rules/ui.md` §1 ·
`catalogo-de-capacidades.md` §1 · §9 · `postura-nova-geracao.md:228` · `PN-15` · `PN-17` ·
`fronteira-do-nucleo.md:59` · `:85` · `roadmap-de-modulos.md:154` · `catalogo-de-modulos.md` (`ADQ`) ·
`fatos-de-operacao-provedor.md` §3 · `fatos-de-operacao-retencao-e-descarte.md` (`RN-NUC-046`) ·
`docs/backlog/SPR-30-corrigir-item-ja-enviado-por-lancamento-novo-sem-editar-o-or.md:12`
