---
name: convention-retencao-tem-tres-relogios
description: retenção tem três relógios — obrigação (legal) · prova (o que a cláusula prometeu) · discricionário (custo medido decide) —, e juntar prova em discricionário permite encurtar por custo a única evidência de que o nosso acesso foi legítimo
type: convention
escopo: plataforma
camada: dados
data: 2026-08-23
relaciona: [[convention-gravar-a-propria-trilha-nao-e-mutacao]], [[decision-d-06-sao-tres-residencias-nao-uma]]
tarefa: T-0004
---

O brief pedia dois relógios (obrigação × escolha nossa). São **três**, e a separação do terceiro é o
entregável:

1. **Obrigação** — venda, pagamento, movimento de caixa, desfecho de documento fiscal e **mudança de
   módulo ativo** (é base de cobrança, logo é fato financeiro). Append-only, sem soft delete, prazo legal.
2. **Prova (a trilha)** — as nossas leituras, os nossos atos, as tentativas recusadas, as concessões. O
   prazo é o que a **cláusula de contrato** prometeu, não o que nos convém.
3. **Discricionário** — recusa, conectividade, tentativa de periférico, tentativa de sincronização,
   latência. É aqui, e **só** aqui, que custo medido é argumento legítimo.

**Por quê:** a trilha é a única prova de que o nosso acesso foi legítimo, e é prova potencialmente **contra
nós**. No relógio discricionário ela é encurtada por custo sem violar regra nenhuma — e o encurtamento não
tem sintoma: ninguém percebe a falta de um registro que não existe mais. É por isso que ela não pertence ao
relógio 3, mesmo tendo volume de relógio 3.

**O custo de retenção, em forma (nenhum número medido):** volume cresce como `O(fatos/dia × janela)` por
schema, e o total como isso `× O(schemas)`, com teto no **pior** cliente e nunca na média. Mais três custos
que ninguém orça: **janela de migration** (quanto mais retido, mais caro cada mudança de estrutura em N
schemas, num sistema onde o caixa não pode parar), **tempo de restauração** (que em PDV se mede em caixa
parado) e **superfície** — cada classe retida é superfície de auditoria e de incidente. Retenção não é só
custo, é **passivo**.

**A cláusula que amarra o outro lado:** retenção de uma classe é **≥ a janela mais longa de leitura
publicada** sobre ela. Retenção e teto de janela de relatório são o **mesmo número visto de dois lados**;
fechá-los separadamente produz relatório especificado sobre período cujo fato já foi descartado — e série
truncada por retenção chega ao leitor com a cara de "vendeu menos".

**Como aplicar:** ao propor retenção, diga primeiro **em que relógio** a classe está. Se a resposta for
"depende do custo", confirme que não é o relógio 2 antes de continuar.
