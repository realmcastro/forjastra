# SPR-35 — Fundação do cliente — fechar a escolha de arranjo (B ou D)

**Tipo:** Epic · **Estado ao migrar:** A fazer · **Prazo que constava:** 2026-10-05

---

## Objetivo

Produzir a **evidência medida** que fecha a última decisão irreversível do cliente, e só então liberar código de produto de cliente.

## A pergunta única

**A interface do terminal roda dentro do processo nativo (arranjo B) ou dentro de um navegador conversando com um processo nativo (arranjo D)?**

* **Arranjo B** — um código-base, núcleo compartilhado, cascas por alvo, camada de capacidade declarada como **contrato** (não como `if` espalhado).
* **Arranjo D** — uma interface web para todos os alvos + **serviço acompanhante nativo só no Windows**, que carrega a custódia (assina, imprime, guarda a fila, consome a faixa, drena com a janela fechada).
* Um terceiro arranjo — clientes separados por alvo — é o desfecho de **não decidir**, e custa três implementações das mesmas regras de convergência.

## O que já está decidido, e não se rediscute aqui

* **Cliente: React Native + Expo**, TypeScript estrito. Cobre iOS, Android e web.
* **O corte entre alvos é por CUSTÓDIA, não por formato de tela.** Isso é consequência de regra de produto já aprovada — a fila em repouso é ilegível fora da aplicação, e o ato de assinar documento fiscal acontece no ponto de emissão, sem rede. Quem implementa o front **produz a evidência**; o corte já está decidido pela regra.
* **A superfície sem custódia é grande** — dispositivo do cliente-final, display de leitura à distância, toda a retaguarda — e o navegador a serve bem.
* **A superfície com custódia não se rebaixa** para caber num navegador. "Confiamos na criptografia de disco do sistema" é rebaixar requisito de produto por conveniência de construção.

## O que ainda não está decidido, e é o que esta Epic responde

**Expo não cobre Windows desktop.** Verificado em 2026-08-26 em fonte primária: Windows é plataforma _out-of-tree_, atendida só por solução de userland, sem `prebuild` e sem geração nativa contínua. Logo a escolha de cliente, como está, cobre iOS, Android e web — e deixa descoberto **exatamente o alvo que decide**: a estação fixa em Windows, offline.

## Regra de sequência

**Nenhum código de produto de cliente sai antes de B ou D estar escolhido.** Escolher por omissão, começando a construir, cria fato consumado sobre a decisão mais irreversível do sistema.

## Referências

`docs/arquitetura/d-01-d-02-stack-opcoes.md` §1, §3.1, §3.2, §3.3 · `.claude/rules/ui.md` · `docs/design/grade-e-espacos.md` · `docs/produto/operacao-offline-e-sincronizacao.md` · `docs/produto/fila-local-conteudo-e-repouso.md` · `docs/produto/fiscal-custodia-e-trilha.md`
