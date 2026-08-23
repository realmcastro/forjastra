---
name: gotcha-regra-nova-que-nao-corrige-a-celula-nasce-inerte
description: regra que muda o desfecho de uma célula da matriz e não corrige a célula nasce sem efeito — a célula vence a prosa inclusive na RN dona (RN-NUC-039), então a regra fica inerte exatamente nas operações que existe para liberar
type: gotcha
escopo: plataforma
camada: produto
data: 2026-08-23
relaciona: [[decision-celula-e-autoridade-unica-sobre-autorizacao]], [[business-rule-ato-ordinario-versus-operacao-sensivel]]
tarefa: T-0003
---

**Sintoma:** uma `RN` afirma em prosa que uma operação **não** depende de X, e a coluna da matriz
daquela operação continua dizendo X. Nada acusa: os dois arquivos estão internamente coerentes, e
cada um passa a própria revisão.

Foi o achado `AUT-14` (`docs/auditorias/2026-08-23-autorizacao-papeis-e-superficie-2-reverificacao.md`):
`RN-OFF-032` declarou que o ato ordinário de venda não se sustenta em autoridade retida de pessoa, e
as dez linhas do ato ordinário seguiram com `retida` na coluna `Offline`. Por `RN-NUC-039` a célula
vence a prosa **inclusive contra a regra dona** — logo `RN-OFF-032` era prosa perdendo para a coluna,
e o implementador que segue a célula volta a parar o balcão ao vencer a validade, contra `PN-01`.
Não havia terceira leitura: seguir a célula viola `PN-01`, seguir a prosa viola `RN-NUC-039`.

**Por quê:** as **duas** correções eram corretas, saíram da **mesma rodada**, em **arquivos
diferentes**, e se anularam. Nenhum dos dois agents tinha como ver, porque cada um só via o seu lado.
É a falha específica do trabalho paralelo por território: o defeito não está em nenhum dos dois
entregáveis, está no par.

**Como aplicar:**
- Quem escreve regra que muda o desfecho de uma célula **entrega a célula no mesmo despacho**. Regra
  que só vale se alguém preferir a prosa à célula não vale.
- Reauditar a **correção** é obrigatório, não zelo — e a consulta pede explicitamente "caminho
  **aberto** pelo conserto", que é a frase que fez `AUT-14` aparecer. Sem ela, o auditor confere os
  achados antigos e não olha o par novo.
- O conserto se prova por **busca**, do mesmo jeito que o defeito foi encontrado: o conjunto de
  linhas com o valor novo tem de ser exatamente o que a prosa enumera.
