---
name: gotcha-agregado-e-seguro-por-concentracao-nao-por-n
description: agregado não é anônimo por CONTAGEM de clientes e sim por DISTRIBUIÇÃO — com um cliente dominante o pico do agregado É a curva dele, e nenhum `N` conserta; a condição é contribuição máxima, medida antes de exibir, falhando fechado
type: gotcha
escopo: plataforma
camada: seguranca
data: 2026-08-23
relaciona: [[decision-agregado-de-periodo-fechado-nao-e-cache]], [[decision-d-06-sao-tres-residencias-nao-uma]], [[decision-tenancy-schema-por-cliente]]
tarefa: T-0004
---

**Sintoma: não há sintoma.** O artefato *parece* agregado — soma sobre todos os clientes, nenhum
identificador, nenhum número de ninguém. E ele revela a curva de um cliente inteiro.

**O fato, em dois graus do mesmo defeito:**

1. **`N` pequeno.** Não-decomponibilidade é propriedade de `N`, e `N` começa pequeno: com três clientes o
   agregado identifica cada um. Pior, é irreversível no instante da captura — agregado calculado hoje com
   `N` pequeno **não fica anônimo** em 2028. Vale inclusive para o ex-cliente que levou o dado dele e
   continua no nosso histórico.
2. **Concentração**, e este é o furo que `N` não cobre: com um cliente dominante, o pico do agregado **é** o
   pico dele, e fica legível até pelo papel de leitura **estreita**, sem cláusula nenhuma. `N` grande com um
   dominante é tão revelador quanto `N` = 1.

**Por quê passa despercebido:** "não contém número de outro cliente" e "não permite reconstruir a curva de
outro cliente" são testes **diferentes** — o primeiro mede o **conteúdo** do artefato, o segundo mede a
**forma**. Passar no primeiro não implica passar no segundo, e é o primeiro que qualquer um aplica.

**Como aplicar:** a condição é a **contribuição máxima** de um cliente na grandeza agregada (fração),
avaliada **antes** de exibir, na **mesma janela e resolução** do artefato, falhando fechado, e a recusa
**não nomeia** o dominante. O número não existe ainda (é pergunta ao humano, junto do `N` mínimo) — o que
significa que hoje **nenhum agregado é apresentável**, e isso é desfecho, não pendência. É o terceiro vetor
do mesmo vazamento por agregado: cliente→cliente, cliente→nós, agregado→dominante. Espere o quarto.
