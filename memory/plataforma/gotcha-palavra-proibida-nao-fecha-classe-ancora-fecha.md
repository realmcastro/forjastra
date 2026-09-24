---
name: gotcha-palavra-proibida-nao-fecha-classe-ancora-fecha
description: quatro rodadas de auditoria, quatro grafias novas da mesma classe — o que fechou não foi a lista aprender mais um nome, foi a forma declarar onde o comando termina; o sintoma de estar acrescentando nome em vez de fechar classe é "achamos mais uma"
type: gotcha
escopo: plataforma
camada: seguranca
data: 2026-09-11
relaciona: [[convention-o-que-o-banco-impoe-vence-o-que-alguem-lembra]], [[decision-tenancy-schema-por-cliente]]
tarefa: T-0009
---

**Sintoma:** a cada auditoria, "achamos mais uma". Cada correção fecha o caso medido, passa na
revisão seguinte, e o próximo auditor acha outra grafia da mesma coisa.

**A série, num dia só, sobre o mesmo controle:**

1. forma de comando não prevista;
2. identificador **citado** (`"t_x".`) e **maiúsculo** (`T_X.`), que a comparação em minúscula não
   via;
3. `SET LOCAL search_path` dentro de corpo de função, com o padrão exigindo as duas palavras coladas;
4. `set_config('search_path', …)` — **sem a palavra proibida**, sem ponto qualificador, com o nome do
   schema como literal. Este foi medido **antes** de virar achado, corrigindo o anterior.

Quatro, e o quinto existe. Ninguém sabe o nome dele, que é exatamente o problema.

**Por quê lista de palavra proibida não fecha:** ela enumera o que alguém já imaginou. A linguagem
tem mais formas de expressar a mesma intenção do que a lista tem entradas, e cada correção ensina o
próximo caso a evitar a palavra recém-acrescentada. O trabalho cresce sem nunca terminar.

**O que fechou:** a forma declarar **onde o comando termina** — cabeça fechada, cauda fechada,
interior declarado, casamento ancorado no fim. O que sobra depois da cauda é recusa **sem que a lista
saiba o que era**. Com a âncora morreram de uma vez `DROP COLUMN` em segunda ação, `DISABLE TRIGGER`,
`OWNER TO`, `LANGUAGE c`, `SECURITY DEFINER`, `COST` e `SET search_path` como atributo de função —
nenhum deles escrito em lugar nenhum.

**A armadilha dentro da armadilha:** a spec **já dizia** "uma ação por comando" desde a primeira
versão, e foi justamente por essa frase que o segundo furo passou. **Prosa declarando o limite não é
o limite.** `$` no fim do padrão é.

**Como aplicar:** ao escrever qualquer crivo, liste o que é **permitido** e ancore o fim, em vez de
listar o que é proibido. Quando a lista de proibições crescer numa segunda rodada, pare de
acrescentar: o mecanismo está errado. E lembre do limite disto — o crivo é leitura de texto, então
onde o texto deixa de ser a linguagem que ele entende (corpo de função em outra linguagem), nenhuma
âncora alcança, e a defesa tem que ser de outra natureza
([[convention-o-que-o-banco-impoe-vence-o-que-alguem-lembra]]).
