---
name: decision-forja-e-pdv-modular
description: A Forja é um PDV de nova geração — núcleo de venda + módulos ativados por cliente. Restaurante é a primeira vertical atendida, nunca sinônimo do produto; termo de ramo no núcleo é defeito.
type: decision
escopo: plataforma
camada: produto
data: 2026-08-22
relaciona: [[decision-tenancy-schema-por-cliente]], [[state-fase-0-arquitetura-ia]]
---

O produto é um **ponto de venda modular e multi-cliente**: núcleo de venda (catálogo, pedido,
pagamento, caixa, fiscal, operador) mais módulos ativados conforme o interesse de cada cliente.
Restaurante liga mesa/comanda, delivery e estoque; posto liga bomba e frota; varejo liga etiqueta e
fiscal. Mesmo núcleo, mesmo repositório.

A pasta do projeto nasceu chamada `restaurante` e foi renomeada para `forja` **no dia 0**,
justamente por isso.

**Por quê:** o nome do primeiro cliente vaza para nome de tabela, de módulo, de componente e de
rota. Depois não sai sem migration e sem quebrar a operação de quem já está em produção. O custo de
corrigir framing no dia 0 é uma pasta renomeada; no mês 6 é um ciclo expand/contract em N clientes.

**Como aplicar:** o núcleo fala venda, item, pedido, pagamento, operador, turno, cliente-final,
catálogo. `mesa`, `comanda`, `bomba`, `frota`, `delivery` são de módulo ou vertical. Teste antes de
pôr algo no núcleo: um posto, uma padaria e uma loja de roupa precisam **todos** disto? Se não,
não é núcleo. Nunca `if (cliente === 'restaurante')` — diferença vira capacidade, configuração ou
módulo.

**Corolário sobre a ordem de construção (2026-08-23, T-0001):** a vertical por onde se constrói é
**corpo de prova**, não pré-requisito de nada. Três consequências auditáveis: módulo puxado por ela
nasce **cross-vertical**; ordem de construção **não** vira ordem de venda; e nada no núcleo pode
depender de um módulo do MVP existir. Nenhuma vertical é pré-requisito de outra.
