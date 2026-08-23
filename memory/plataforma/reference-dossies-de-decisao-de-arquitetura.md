---
name: reference-dossies-de-decisao-de-arquitetura
description: os dossiês que instruem D-01/D-02 (stack e frontend) e D-03 (identidade) estão em docs/arquitetura/ — eles não escolhem, eliminam opções com path:linha e nomeiam o critério
type: reference
escopo: plataforma
camada: backend
data: 2026-08-23
relaciona: [[decision-d-03-sao-tres-eixos-nao-uma-decisao]]
tarefa: T-0003
---

- `docs/arquitetura/d-01-d-02-stack-opcoes.md` — 15 requisitos com `path:linha` que eliminam opções.
  **"Um binário para os três alvos" não sobrevive**: morre em `RN-OFF-021` (fila ilegível em repouso) e
  em `RN-EMI-033`/`027` (assinar no ponto de emissão, sem rede). O corte viável é por **custódia**, não
  por formato de tela — a classe **sem** custódia (dispositivo do cliente-final, display de leitura à
  distância, **toda a retaguarda**) é grande e o navegador a serve bem. Escolha real entre arranjo
  **B** (código-base único, cascas por alvo com capacidade declarada) e **D** (web única + acompanhante
  nativo só no Windows). Recomendação de servidor: **Go**, com o risco nomeado — sem exaustividade
  verificada pelo compilador num produto feito de listas fechadas, e duas linguagens com a regra de
  convergência em dois lugares.
- `docs/arquitetura/d-03-identidade-opcoes.md` — ver [[decision-d-03-sao-tres-eixos-nao-uma-decisao]].
- `docs/arquitetura/fiscal/` — três dossiês de pesquisa fiscal (IBS/CBS, emissão própria, base de
  cálculo e gorjeta), cada afirmação com URL oficial. É a fonte quando aparecer pergunta de fisco:
  não improvise por analogia.

Nenhum dos dois fecha decisão. `CLAUDE.md` §8 continua sendo o lugar onde o estado da decisão é lido.
