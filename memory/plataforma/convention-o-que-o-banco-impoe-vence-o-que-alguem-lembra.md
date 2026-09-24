---
name: convention-o-que-o-banco-impoe-vence-o-que-alguem-lembra
description: entre uma defesa que o banco ou o compilador impõe e uma que depende de alguém escrever certo, escolha a imposta mesmo quando ela custa mais — três defeitos de isolamento desta base foram fechados assim, e o sintoma de estar no lado errado é a mesma defesa cair em rodadas sucessivas por casos diferentes
type: convention
escopo: plataforma
camada: seguranca
data: 2026-09-11
relaciona: [[decision-tenancy-schema-por-cliente]], [[gotcha-search-path-serve-o-executor-e-vaza-no-pool]], [[decision-d-04-chave-timestamps-exclusao]]
tarefa: T-0009, T-0011
---

Padrão observado três vezes no mesmo dia, em três camadas diferentes, e nas três a versão **imposta**
venceu depois que a versão **lembrada** falhou:

1. **Registro de clientes.** A linha era declarada imutável em `COMMENT`. Dois comandos com a
   credencial do executor reapontaram um cliente para o schema de outro e leram o dado de lá.
   Fechou com **gatilho no banco**.
2. **Borda do servidor.** Em vez de "lembre de passar o tenant", o resolvedor recebe **só** o sujeito
   autenticado (`body`, `query`, cabeçalho e path fora **por assinatura**) e a raiz do query builder
   **não é exportada** — o handle só existe já preso ao schema. "Função de dados com tenant
   opcional" deixou de ser algo a evitar: não há como escrever.
3. **Crivo de migration.** Uma lista textual do que é permitido caiu **três rodadas seguidas**, por
   casos diferentes: forma de comando, grafia de identificador, escopo de execução dentro de corpo de
   função. Cada correção fechou o caso medido e nenhuma fechou a classe.

**O sintoma de estar no lado errado**, e é o mais útil deste registro: a **mesma** defesa cair em
rodadas sucessivas por casos que não se parecem. Um furo é descuido. Três furos de naturezas
diferentes indicam que o mecanismo está sendo pedido para decidir algo que ele não tem como saber —
no caso do crivo, uma propriedade **semântica** decidida por leitura **textual**, sem parser.

**Por quê a versão imposta ganha mesmo custando mais:** ela falha para **todos** os caminhos, inclusive
os que ninguém imaginou, e continua valendo quando quem a escreveu já saiu do projeto. A versão
lembrada protege contra o erro honesto, que é o caso comum, e é por isso que ela parece suficiente por
muito tempo.

**Como aplicar:** ao propor defesa de isolamento, pergunte **quem a aplica** — o banco, o compilador,
ou uma pessoa escrevendo certo. Se for a terceira, ela é a **primeira** camada, nunca a única, e o
relatório diz qual é a segunda. Camada textual continua valendo: ela falha **cedo**, antes de qualquer
conexão, com mensagem que nomeia o defeito. O erro é tratá-la como a defesa, não como o aviso.
