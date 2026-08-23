---
name: decision-emissao-fiscal-propria
description: a Forja monta, assina e transmite o documento fiscal — não é consumidora de provedor nem middleware de terceiro; daí decorrem custódia de credencial do cliente, contingência como parte do produto, e acompanhar vigência de regra como obrigação nossa
type: decision
escopo: plataforma
camada: produto
data: 2026-08-22
relaciona: [[decision-d-05-catalogo-de-regra-fiscal-sem-casa]]
tarefa: T-0001
---

Decisão do humano em 2026-08-22: **emissão própria**. Provedor autorizado de terceiro (PAA) foi
documentado como alternativa e **não** adotado. Caso base de UF: **Ceará**; **os dois** regimes
(regular e Simples); documento de mercadoria e de serviço no escopo, com NFS-e concluída **fora** do
MVP 1. Alcance: **emissão agora, apuração no horizonte** (sem data). Custódia da credencial do
cliente: **nós guardamos**, com a capacidade alternativa também especificada.

**Por quê / o que isso compra e o que custa:** compra o controle do caminho crítico do caixa — o
documento não depende da disponibilidade de um terceiro no momento da venda, e a contingência é nossa
para desenhar. Custa quatro obrigações permanentes que não existiriam com PAA: (1) **custódia de
credencial** de terceiro, com todo o peso de segurança que isso traz; (2) **assinar no ponto de
emissão, sem rede** — que é o requisito que mata "um binário para os três alvos"
([[reference-dossies-de-decisao-de-arquitetura]]); (3) **fila de transmissão e contingência como parte
do produto**, com máquina de estado e não `retry`; (4) **acompanhar vigência de regra fiscal** como
obrigação nossa, para sempre, inclusive a transição IBS/CBS.

**Como aplicar:** toda spec, contrato e modelo de `FIS`/`EMI` assume estas quatro obrigações como
dadas. Voltar atrás não é troca de biblioteca: é troca de produto. Pesquisa fiscal, com URL oficial
por afirmação, em `docs/arquitetura/fiscal/`.
