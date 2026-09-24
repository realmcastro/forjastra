---
name: decision-ciclo-de-vida-do-pedido-sobe-como-fato-aditivo
description: LACUNA-NUC-038 fechada em 2026-09-11 pela saída B — o pedido continua local ao terminal e fora da fila de venda, mas o **fato sobre** o pedido sobe como aditivo classe 1; `RN-NUC-052` a `055`, e o "nada sobe" de `RN-NUC-003` infeliz (c) foi revogado com marca datada
type: decision
escopo: plataforma
camada: produto
data: 2026-09-11
relaciona: [[decision-capturar-e-o-padrao-nao-capturar-exige-justificativa]], [[gotcha-zero-venda-nao-se-distingue-de-terminal-morto]], [[rule-recusa-por-identidade-tem-motivo-proprio]]
tarefa: T-0010
---

Primeira aplicação do invariante 10, e a mais cara que estava em aberto.

**A decisão:** os quatro fatos de ciclo de vida do pedido passam a existir — pedido aberto, linha
retirada que continua existindo, retirada, pedido morto (`RN-NUC-052` a `RN-NUC-055`, em
`docs/produto/fatos-de-operacao-ciclo-de-vida-do-pedido.md`). **O pedido continua não subindo**: o que
sobe é fato aditivo próprio, classe 1 de `RN-OFF-004`, nascido no terminal no instante de
`RN-OFF-019`. A distinção que sustenta tudo é entre **o pedido** e **o fato sobre o pedido**.

**Revogado:** a cláusula "nada sobe" de `RN-NUC-003` infeliz (c), `nucleo-venda.md:157`, com marca
datada no arquivo dono. "Pedido morto não é venda" fica de pé.

**Por quê:** sem esses fatos, "a loja não vendeu às 15h" e "o terminal morreu no terceiro item às
15h" produziam a **mesma série**, e a hipótese offline ficava infalsificável
([[gotcha-zero-venda-nao-se-distingue-de-terminal-morto]]). Caíam junto o denominador de qualquer taxa
de conversão (para sempre, em qualquer janela), a cesta abandonada, o passo da desistência, o par
lançar↔retirar e o defeito da nossa própria superfície visto em N clientes.

**Recusada a saída `A` (só contagem)**, e o motivo derruba a intuição de que ela era a barata: um
contador por terminal é **agregado no lugar do fato**, que `RN-NUC-041` proíbe, e a exceção exigiria
custo **medido** ou dado pessoal — não existe nenhum dos dois. `A` entregava menos e custava uma
exceção escrita.

**Não precisa de identificação de cliente-final**, e isso foi verificado, não presumido: conversão,
cesta abandonada, passo da desistência e defeito nosso são respondíveis por pedido, terminal, faixa do
dia e modo de atendimento. A cesta abandonada é lista de **itens**, não de nomes. "Quem desistiu
voltou depois?" é pergunta de `CLF`, opt-in, e ficou fora.

**Timing, que é parte da decisão:** foi tomada **antes do primeiro terminal em operação**. Nessa
janela o custo era retrabalho de modelo, com a Fase 1 sendo escrita agora; depois do primeiro
terminal passaria a custar série que nunca existiria, e aprovar em qualquer data produziria série que
começa naquela data.

**Como aplicar:** o modelo do núcleo de venda **não fecha sem esses fatos** — acrescentá-los depois é
expand/contract em N schemas. O grão ainda depende de `D-06`. E `fatos-de-operacao-ciclo-de-vida-do-pedido.md`
§3 é o **exemplar** da seção `Registra / Não registra`: 6 itens na primeira lista, 7 na segunda, cada
um com motivo.
