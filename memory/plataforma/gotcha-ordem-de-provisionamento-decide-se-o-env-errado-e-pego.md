---
name: gotcha-ordem-de-provisionamento-decide-se-o-env-errado-e-pego
description: configuração errada **depois** de o cliente nascer é pega pela verificação, mas com diagnóstico invertido (o papel legítimo aparece como intruso); errada **desde o nascimento** do cliente passava por tudo com sucesso e a verificação respondendo conforme
type: gotcha
escopo: plataforma
camada: dados
data: 2026-09-11
relaciona: [[convention-precondicao-de-ato-humano-se-confere-na-borda]], [[convention-enumerar-quem-alcanca-vence-conferir-o-esperado]]
tarefa: T-0009
---

**Sintoma, quando existe:** a verificação acusa que um papel "alcança o schema indevidamente" e nomeia
**o papel legítimo**. **Sintoma, quando não existe:** nenhum — tudo responde sucesso.

Um arquivo de ambiente apontando para o papel errado produz **dois defeitos diferentes**, e qual
deles depende da **ordem** entre a troca e o provisionamento do cliente:

- **Trocado depois do cliente nascer:** a verificação de alcance para com erro, porque o papel
  legítimo passa a ser "um terceiro que alcança o schema" do ponto de vista do parâmetro novo. Acusa,
  mas manda investigar quem não fez nada.
- **Errado desde o nascimento do cliente:** passa por tudo. Medido, sem a correção — o
  provisionamento sai com **sucesso**, os papéis dos clientes ficam concedidos ao papel errado, e a
  verificação responde **conforme**, sem uma linha sequer.

**Por quê o segundo caso escapa:** a verificação de alcance exclui o nome vindo do ambiente **por
construção** — ele é o parâmetro dela, o sujeito legítimo esperado. Quando o parâmetro está errado, a
pergunta inteira está errada, e ela não tem como saber. É o limite de qualquer controle
parametrizado: ele valida o mundo contra o parâmetro, nunca o parâmetro contra o mundo.

**E o caso do ambiente já errado é o comum**, não o exótico: é o de um arquivo copiado para uma
máquina nova.

**Como aplicar:** todo controle que recebe a identidade do sujeito legítimo por configuração precisa
de uma conferência **do próprio parâmetro contra o catálogo**, na borda, antes da primeira escrita —
não basta validar o resto contra ele
([[convention-precondicao-de-ato-humano-se-confere-na-borda]]). E, ao ver diagnóstico que nomeia algo
legítimo como intruso, suspeite do parâmetro antes de suspeitar do estado.
