# Núcleo de venda — o que a venda concluída congela: rateio e as reservas da obrigação documental

> **Irmão de `nucleo-venda.md`, com o mesmo peso normativo.** Partido em 2026-09-23 (T-0014, `F-018`),
> quando `nucleo-venda.md` tinha 395 linhas, no eixo **o que a venda faz × o que ela congela ao
> concluir**. Aqui ficam `RN-NUC-064` (rateio), `RN-NUC-067` (modo de arredondar a linha, desde
> 2026-09-23, passo A.2b) e `RN-NUC-065` (as três reservas da Opção B). Numeração
> contínua e imutável com os outros três arquivos do núcleo (`glossario.md` §4.2), e as lacunas de todos
> continuam em `nucleo-venda.md` §6.
>
> Vale aqui tudo o que o cabeçalho de `nucleo-venda.md` declara: escopo núcleo, nenhum termo de ramo,
> nada de tabela, coluna, endpoint ou formato. Toda regra é `### RN-NUC-nnn`, pelo contrato de busca.
> **Os números abaixo são casos de prova**, não prazo, teto nem tolerância. Nenhuma regra fiscal é
> afirmada: o que é de `FIS` e de `EMI` é remetido a eles.

## 1. Valor da linha: rateio e arredondamento

### RN-NUC-064 — Valor aplicado à venda inteira é repartido entre as linhas uma vez, na conclusão, pelo maior resto, e a parcela de cada linha fica congelada

**Enunciado** desconto e acréscimo aplicados à **venda inteira** (`RN-NUC-006`, `RN-NUC-007`) são
repartidos entre as linhas **uma vez, na conclusão** (`RN-NUC-003`), e a parcela de cada linha fica
congelada nela. A repartição é exata na menor unidade da moeda do estabelecimento (`RN-NUC-058`; o
centavo, em real): a soma das parcelas é o valor aplicado, sem sobra e sem falta. O método é fixo e igual
para todo cliente:

```
valor aplicado V; linhas L1..Ln, cada uma já em menor unidade; soma S
→ parcela bruta da linha i: V × Li / S
→ cada linha recebe a parte inteira da sua parcela bruta
→ as unidades que faltam para somar V vão, uma a uma, às linhas de maior resto
→ empate de resto: a linha lançada primeiro recebe primeiro
```

Linha de valor zero recebe zero. Correção posterior — devolução parcial, cancelamento, estorno
(`RN-NUC-008`) — usa a parcela congelada da linha e **nunca** reparte de novo. A base por linha que `FIS`
usa parte dessa parcela; o arredondamento do tributo é de `FIS` e está indisponível
(`nucleo-venda.md` §6, `LACUNA-NUC-004`).

**Escala** o eixo é linhas por venda e correções por venda. Repartir de novo a cada correção faz o
centavo mudar de linha conforme o que já foi devolvido, e a soma das devoluções deixa de fechar com o
que foi pago: um centavo por venda, vezes o volume, no fechamento do contador. Congelado na conclusão, o
custo é uma parcela por linha, uma vez.

**Motivo** é a metade de `G-09` que é regra nossa, e não do contador. Três mecanismos recusados:
**arredondar cada parcela** — a soma passa ou falta um centavo, e o desconto registrado difere do
concedido; **sobra inteira na última linha** — soma certa, mas o viés cai todo numa linha, e devolvê-la
devolve um centavo a mais ou a menos que as outras; **repartir na correção** — o motivo acima. O maior
resto é o único dos quatro em que cada parcela fica a menos de uma unidade da proporção exata **e** a
soma fecha; o desempate por ordem de lançamento faz duas execuções da mesma venda darem o mesmo
resultado, que é o que permite ao terminal sem contato chegar à parcela que o servidor chegaria.

**Aceite**
1. Três linhas de R$ 10,00, desconto de venda de R$ 10,00. Brutas 3,333…; inteiras 3,33 × 3 = 9,99;
   sobra 0,01 com restos iguais, e vai à primeira lançada → **3,34 · 3,33 · 3,33**. Devolver cada linha
   devolve 6,66 · 6,67 · 6,67, e a soma das três devoluções é 20,00, o que foi pago.
2. Linhas de R$ 5,00 · 3,00 · 2,00, desconto de 0,99. Brutas 0,495 · 0,297 · 0,198; inteiras 0,49 ·
   0,29 · 0,19 = 0,97; sobram dois centavos, restos de 0,5 · 0,7 · 0,8 centavo → terceira e segunda
   recebem → **0,49 · 0,30 · 0,20**.
3. Reenviar a conclusão da mesma venda (`RN-OFF-013`) dá as mesmas parcelas.
4. Devolver a linha 2 da venda do caso 1 um mês depois devolve 6,67, sem recomputar nada.

**Infeliz** (a) o valor de uma linha não cai exato na menor unidade → não chega a esta regra: ela começa
depois que cada linha tem valor exato, e compor esse valor é `RN-NUC-067`. (b)
desconto de venda maior que a soma das linhas → recusado, porque valor devido negativo não existe, e a
recusa diz isso. (c) linha retirada antes da conclusão → não participa; a repartição olha só as linhas
que existem na conclusão.

**Offline** integral em D1, D2 e D3; classe 1 — aritmética determinística sobre valor já composto.
**Registra** a parcela de cada linha, congelada. **Não registra** parcela bruta nem resto: derivam das
parcelas e das linhas congeladas, e guardá-los convidaria a repartir de novo.

### RN-NUC-067 — Valor de linha que não cai exato na menor unidade é arredondado uma vez, pelo modo que o estabelecimento publicou; sem modo publicado, essa linha não é lançada

Nasceu em 2026-09-23 (T-0014, passo A.2b), por decisão do thread sobre o risco que o passo A.2a deixou:
com o arredondamento inteiro esperando o contador, combustível por litro e item vendido por peso não
vendiam.

**Enunciado** o **modo de arredondamento** é membro da configuração publicada do estabelecimento
(`RN-NUC-013`, linha 38 da matriz), com versão e vigência, escolhido de uma lista fechada. O produto
enumera os modos e **não escolhe** nenhum:

| Modo | Resto abaixo da menor unidade | 0,350 kg × R$ 29,90 = 10,465 | 23,456 L × R$ 6,299 = 147,749344 |
|---|---|---|---|
| `half_up` | metade ou mais afasta do zero; menos que metade cai | 10,47 | 147,75 |
| `half_even` | metade exata vai ao vizinho par; fora da metade, como `half_up` | 10,46 | 147,75 |
| `down` | cai sempre (trunca na direção do zero) | 10,46 | 147,74 |
| `up` | qualquer resto afasta do zero | 10,47 | 147,75 |

O modo alcança todo valor de linha que **o núcleo** compõe e que cai fora da menor unidade da moeda do
estabelecimento (`RN-NUC-058`): quantidade × preço (`RN-NUC-002`), e desconto ou acréscimo de linha cujo
valor resulta de proporção (`RN-NUC-006`). A ordem é uma só: quantidade nas casas declaradas da unidade
(`glossario.md` §1.2) vezes o preço como publicado, produto exato, **um** arredondamento, e o valor
arredondado é o que a linha guarda. Valor já arredondado nunca é arredondado de novo. Fora do alcance: o
rateio, que tem método próprio e exato (`RN-NUC-064`); a parte que um módulo compõe (`RN-NUC-070`), que
segue o artefato dele; e o tributo, que é de `FIS`.
**Precondição** modo publicado com vigência que cobre o instante do lançamento, **só** para a linha que
precisa arredondar. Linha de valor exato (2 un × R$ 5,00) não depende do modo.
**Escala** o eixo é estabelecimentos por cliente e verticais. Cada unidade publica um valor, e o fato não
ganha nada além da versão da configuração que ele já congela. Recusados: **modo fixo para todo cliente**,
que obrigaria o produto a escolher a resposta que é do contador, e escolha errada vira fato errado em N
clientes, sem backfill; **modo do cliente (tenant)**, pelo argumento do fuso (`RN-NUC-057`): unidades do
mesmo cliente podem estar sob regras diferentes; **modo por item**, sem caso conhecido que o peça, e
acrescentá-lo depois é expandir, não migrar; **recusar a linha até o contador responder**, que paralisava
duas verticais-alvo por uma pergunta que só restringe o caso com `FIS` ou `EMI`.
**Offline** integral em D1, D2 e D3; classe 1: aplica configuração retida.
**Infeliz** (a) linha que precisa arredondar e o modo não está publicado → a linha não é lançada, a venda
continua, e a mensagem diz que falta o modo de arredondamento do estabelecimento
(`published_artifact_missing`, `RN-NUC-013`, infeliz (a)); nunca "modo padrão". (b) o `owner` troca o modo
→ versão nova com vigência; linha lançada antes continua com o modo com que foi composta (`RN-NUC-002`,
`RN-NUC-015`). (c) com `FIS` ou `EMI` ligado a norma pede outro modo → o produto não afirma qual é (aviso
em `nucleo-venda.md` §6, `LACUNA-NUC-004`); a correção é versão nova para fatos novos, e nenhum fato migra.
**Aceite**
1. Com cada modo publicado, as duas linhas da tabela dão o valor da coluna, e a venda congela a versão
   da configuração que tinha o modo.
2. Sem modo publicado, na mesma venda: a linha de 0,350 kg é recusada com a falta nomeada; a de 2 un ×
   R$ 5,00 entra com 10,00; nenhuma linha recebeu valor presumido.
3. O `owner` publica `down` com vigência a partir do dia seguinte: a venda de hoje continua com 10,47
   (`half_up`), a de amanhã sai com 10,46, e nenhuma venda anterior muda.
4. Em D2, com a configuração retida, o aceite 1 dá o mesmo resultado.
**Registra** o valor arredondado da linha; o modo vem da versão de configuração que a venda já congela.
**Não registra** o valor antes de arredondar nem o resto: derivam de quantidade, preço e modo congelados,
e guardá-los convidaria a recompor a linha.

## 2. As reservas da obrigação documental

### RN-NUC-065 — Toda venda nasce com a âncora da obrigação documental, congelada no grão da linha e separada do número documental, com qualquer módulo ligado ou desligado

**Enunciado** as três reservas da Opção B (`roadmap-de-modulos.md` §5.3) são estrutura do núcleo desde a
primeira venda de qualquer cliente, com `FIS` e `EMI` ligados ou não:
1. **Âncora.** Toda venda concluída carrega a referência e o estado da sua obrigação documental
   (`fronteira-do-nucleo.md` §6), e esse estado **nunca é ausência**: com `FIS` desligado, declara que o
   produto não avaliou a obrigação; com `FIS` ligado e `EMI` desligado, que ela é cumprida fora do
   produto (`modulos/fiscal.md` §3.1, Desligado); com `EMI`, é o estado dele (`RN-EMI-018`). Quais estados
   existem é de `FIS` e `EMI`.
2. **Grão.** O que a venda congela, congela **por linha** — item, quantidade, preço aplicado, versões
   dos artefatos, parcela de rateio (`RN-NUC-064`) —, nunca só pelo total. É nessa linha que `FIS`
   pendura o congelado dele (`RN-FIS-004`, por tributo, base, regime e redutor).
3. **Numeração.** O número documental é outra coisa que a referência humana da venda (`RN-NUC-003`):
   pertence ao espaço que `EMI` aloca por emitente e série (`RN-EMI-022`, `RN-EMI-023`), e com `EMI`
   desligado nenhum número é consumido. O lugar dele existe no modelo desde a Fase 1, vazio até `EMI`
   existir para aquele cliente.

**Escala** o eixo é clientes que ligam `EMI` depois de já vender, e a idade do histórico de cada um. Sem
as reservas, cada um é migração de dado fiscal no schema dele, sobre fatos que não se reescrevem; com
elas, ligar `EMI` é começar a preencher um lugar que já existia.

**Motivo** fecha `G-01`. O humano escolheu a Opção B em 2026-08-24 (T-0005) com a condição escrita de que
ligar `EMI` depois não exigisse migração (`roadmap-de-modulos.md` §5.3, §5.4). O default da pauta era
"não", por omissão (`backlog-lacunas-g01-g09.md` §6); esta regra troca a omissão por decisão.

**Aceite**
1. Cliente que vende dois anos com `FIS` e `EMI` desligados: toda venda tem âncora com estado
   declarado, e nenhuma tem estado ausente.
2. Ele liga `FIS` e `EMI`: nenhuma venda anterior muda, nenhuma coluna obrigatória precisa ser
   preenchida em fato já gravado, e nenhum número documental é dado a venda anterior à ativação; a
   primeira venda depois recebe número do espaço de `EMI` sem colidir com referência humana.
3. Venda de três linhas tem três linhas congeladas, cada uma com as próprias versões e parcela.
4. Pela forma, antes de `EMI` existir: o modelo de `SPR-37` mostra onde cada uma das três mora, e a
   resposta não é "numa migração futura".

**Infeliz** a obrigação de uma venda antiga precisa ser cumprida depois de ligar `EMI` → se isso existe é
de `EMI` e do contador; o núcleo garante só que a venda sabe, pela âncora, que a obrigação dela foi
declarada fora do produto, e não finge o contrário.

**Offline** integral: a âncora nasce com a venda, no terminal, com o estado que ele conhece, e falha de
emissão nunca impede a venda (`RN-EMI-001`). **Registra** as três, em toda venda. **Não registra** número
documental em venda sem `EMI`: o lugar fica vazio, e o vazio está explicado pela âncora.

## Referências

`docs/produto/nucleo-venda.md` (`RN-NUC-002`, `RN-NUC-003`, `RN-NUC-006`) · §6 (`LACUNA-NUC-004`) ·
`docs/produto/nucleo-publicacao-e-texto.md` (`RN-NUC-013`, `RN-NUC-070`) ·
`docs/produto/nucleo-estabelecimento.md` (`RN-NUC-058`) · `docs/produto/roadmap-de-modulos.md:227-280`
(§5.3, §5.4) · `:321-345` (§7.2, §7.3) · `docs/produto/backlog-lacunas-g01-g09.md` §1, §6 ·
`docs/produto/modulos/fiscal.md:268` (§3.1) · `docs/produto/fiscal-regimes-e-vigencia.md:91`
(`RN-FIS-004`) · `docs/produto/fiscal-emissao-contingencia.md:136` (`RN-EMI-022`) · `:153` (`RN-EMI-023`) ·
`docs/backlog/SPR-40-fechar-tipo-unidade-e-escala-de-dinheiro-e-de-quantidade.md`
