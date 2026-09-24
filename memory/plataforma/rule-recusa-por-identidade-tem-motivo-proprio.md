---
name: rule-recusa-por-identidade-tem-motivo-proprio
description: identidade não reconhecida no terminal produz fato com motivo `identity_unrecognized`, nunca `authority_absent`, e o fato nunca carrega a identificação apresentada; a reconciliação do conjunto vira marco próprio, e é o par recusa × idade do conjunto que fecha `LACUNA-OFF-016` por medida
type: business-rule
escopo: plataforma
camada: produto
data: 2026-09-11
relaciona: [[gotcha-motivo-enumerado-que-engole-dois-diagnosticos]], [[decision-ciclo-de-vida-do-pedido-sobe-como-fato-aditivo]], [[decision-d-03-sao-tres-eixos-nao-uma-decisao]]
tarefa: T-0010
---

`RN-NUC-056`, mais o nono motivo da lista fechada de recusa
(`docs/produto/fatos-de-operacao-dominios-fechados.md`).

**O enunciado:** operador legítimo impedido de trabalhar porque o terminal não reconhece a identidade
dele produz fato de recusa com motivo **`identity_unrecognized`**. Nunca `authority_absent`, que
diagnostica configuração de papel — `RN-OFF-033`(a) já dizia que identificar não é autorizar. O fato
**nunca carrega a identificação apresentada**, por `RN-OFF-033`(c).

**Por quê:** é o único número que fecha `LACUNA-OFF-016` (frequência de reconciliação e tamanho do
conjunto retido) **por medida** em vez de palpite. E o erro do palpite não aparece como métrica ruim:
aparece como "o caixa 3 não deixa a Fulana entrar", sem série nenhuma que sustente a conversa.

**O marco que faz o número significar alguma coisa:** `identity_set_reconciled`. Sem ele, "idade do
conjunto retido" seria afirmada e não derivada — e ele é declarado explicitamente como **marco**, não
como campo "última reconciliação" sobrescrito, que é o desfecho que apagaria a série.

**O que a regra declara que não responde**, em vez de fingir que responde: "operador legítimo com
conjunto defasado" e "nunca foi operador daquele estabelecimento" **não** são distinguíveis, porque o
fato não carrega a identificação. Inventar correlação para distingui-los exigiria registrar a
identificação apresentada, furando a confidencialidade em repouso para produzir um número.

**E restringe `D-03` sem escolhê-la:** mecanismo de prova de identidade que só torne a recusa contável
registrando a identificação apresentada **não satisfaz** a cláusula. Está escrito como custo à vista,
não como veto.

**Como aplicar:** ao criar qualquer causa nova de recusa, abra a lista fechada na mesma passada
([[gotcha-motivo-enumerado-que-engole-dois-diagnosticos]]). Por `RN-NUC-043`, enumerar depois não
separa o que já foi gravado.
