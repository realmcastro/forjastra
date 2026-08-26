---
name: state-d-02-arranjo-b-ou-d
description: D-02 está aberta numa pergunta única — a interface do terminal roda dentro do processo nativo (arranjo B) ou num navegador falando com um processo nativo (D); a escolha de Expo cobre iOS/Android/web e deixa descoberto o Windows offline, que é o alvo que decide
type: state
escopo: plataforma
camada: backend
data: 2026-08-26
relaciona: [[decision-stack-node-typescript-estrito]], [[reference-dossies-de-decisao-de-arquitetura]]
---

D-01 fechou na linguagem em 2026-08-26 ([[decision-stack-node-typescript-estrito]]). **D-02 não.** O
que segue é exatamente o que falta.

## A pergunta única, e ela é do dossiê §3.3

**A interface do terminal roda dentro do processo nativo (arranjo B) ou dentro de um navegador
conversando com um processo nativo (arranjo D)?** `C` é o desfecho de não decidir.

## O que a escolha de cliente já feita cobre — e o que ela deixa descoberto

O humano trouxe **React Native + Expo** para o cliente (móvel e web). Isso cobre iOS, Android e web.

O dossiê §3.2 diz, com todas as letras, que **o alvo que decide D-02 é a estação fixa em Windows,
offline (E1)**: ela precisa assinar sem rede, imprimir com desfecho de falha sob nosso controle,
persistir de forma ilegível em repouso, não descartar fato, e drenar em plano de fundo sem janela em
foco. Seis exigências, **nenhuma de interface**.

**Expo não cobre Windows desktop.** Verificado em 2026-08-26 em fonte primária: Windows é plataforma
*out-of-tree*, atendida só por solução de userland (`expo-desktop`), sem `prebuild` e sem CNG.

Logo:

- **Arranjo B** — Expo **não** é o veículo para E1: seria React Native Windows fora do Expo, em
  suporte best-effort.
- **Arranjo D** — Expo Web serve a interface de E1, E3, E4 e retaguarda; o acompanhante nativo carrega
  `R-01`…`R-06` e `R-08`, e **pode ser Node**, o que encaixa na linguagem já fechada com muito menos
  atrito.

## O que decide, e não é preferência

Duas das 7 `PERGUNTAS: para humano` do dossiê **decidem D-02 sozinhas**: se o certificado for **A3**
(dispositivo físico), o arranjo D vira obrigatório para aqueles clientes; e biblioteca de impressora
de fabricante costuma vir para **um** sistema e **uma** linguagem, que é a restrição mais dura
possível aqui.

**O alvo web não é decisão de quem implementa o front.** O corte é por **custódia** (dossiê §3.1) e é
consequência de `RN-OFF-021` e `RN-EMI-033`/`027`, que já são regra aprovada: a superfície **sem**
custódia (dispositivo do cliente-final, display de leitura à distância, toda a retaguarda) é grande e
o navegador a serve bem; a superfície **com** custódia não se rebaixa para caber num navegador. Quem
implementa o front **produz a evidência**; o corte já está decidido pela regra.

## Próximo passo declarado

**Validar Expo contra o que foi proposto** é a primeira tarefa da frente de front — evidência
medida contra `R-01`…`R-12`, alvo por alvo, antes de qualquer código de cliente. Nada disso bloqueia
a **Fase 1**: o modelo de dados entrega DDL puro e versionado, agnóstico de linguagem e de ORM.
