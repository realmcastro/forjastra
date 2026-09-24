# SPR-51 — Prova medida da drenagem que não compete com o caixa

**Tipo:** Spike · **Estado ao migrar:** A fazer · **Prazo que constava:** 2026-10-29
**Agrupador:** SPR-34

---

## Contexto

A escolha de linguagem resolve dois problemas grandes: compilador, uma só linguagem nos dois lados. Em troca, assume um risco: a drenagem de pendências é execução fora do laço principal, não vem de graça. É factvel. Mas "factvel" é afirmação, e afirmação sem medida não vale.

**Pergunta que a prova responde:**

> O risco de não haver execução fora do laço é real ou a arquitetura ativa aguenta?

## O que testar

**1. Caminho crítico do caixa com a fila no teto e drenando**

* Cenário: terminal real (hardware modesto), internet instável, fila de pendências em 1000+ itens
* Desfecho: latência percebida de adicionar item é ≤ 150ms? Fechar pagamento ≤ 1s?
* Medida: `EXPLAIN ANALYZE` se banco, cronô de evento se frontend
* Mócks locais fornecendo respostas lentas, perdidas, incompletas

**2. Prioridade cedível**

* Cenário: operador no caixa; fila drenando no background
* Desfecho: caminho crítico **recua** quando queue ativa? Medido, não afirmado

**3. Interrupção na fronteira de agregado**

* Cenário: drenagem no meio, usuário interrompe; retoma depois
* Desfecho: não perde progresso, não duplica efeito

**4. Contagem de pendências**

* Cenário: tela mostra contador (ou indicação de que drenagem está ativa)
* Desfecho: contador é **estado mantido**, não consulta de BD a cada render
* Impacto: com fila grande, BD consultado a cada frame é caro

## Entrega

* Gráfico: latência do caminho crítico vs. tamanho da fila (terminal modesto)
* Evidência: prioridade cede quando fila ativa (log de execução ou trace)
* Anotação: como retoma depois de interrupção, com reprodutor de falha
* Rubrica por cenário:

    * Cenário: fila 0..1000 itens, cache cheio
    * Resultado: latência medida (ms)
    * Limitação: hardware X, rede Y
    * Como reproduzir: stack/arquivo
    * Impacto: aprova ou redireciona estratégia
    

## Critério de conclusão

* Todo cenário foi testado e documentado (não precisa passar; precisa ser medido)
* Falha é registrada com limite, sem esconder
* Pós-prova: decisão se continua com a arquitetura ou **antes de programar**, redireciona

## Fora de escopo

Optimização já conhecida, cache proativo, mudança de stack.

## Referências

`docs/produto/offline-grandezas-e-orcamento.md` · `docs/produto/operacao-offline-e-sincronizacao.md` · `.claude/rules/performance.md` §2 e §3 · `memory/plataforma/decision-stack-node-typescript-estrito.md`

## Resultados esperados

Numero medido, nao estimativa: o tempo do caminho critico do caixa com a fila de pendencias no teto e drenando ao mesmo tempo, comparado com o mesmo caminho sem drenagem. Medido em hardware modesto, nao na maquina de quem desenvolve.Mais tres provas: a drenagem cede prioridade quando o caminho critico entra; ela e interrompivel na fronteira de agregado sem perder progresso; e a contagem de pendencias e estado mantido, nao consulta feita na hora de apresentar.Se o orcamento estourar, o desfecho e o numero mais a causa e a correcao proposta. Se nao der para medir, o desfecho e dizer o que precisaria rodar e por que nao rodou. Estimativa entra rotulada como estimativa, com a conta a vista.
