# SPR-45 — Registro do vocabulário fechado de ids de bloco

**Tipo:** História · **Estado ao migrar:** A fazer · **Prazo que constava:** 2026-08-31
**Agrupador:** SPR-35

---

## Objetivo

Registrar o vocabulário fechado que o manifesto carrega: os ids de bloco que existem, o que cada um faz, e o registro de prefixos que impede colisão entre espécies. Custo de renomear um id depende de quem atravessa a rede: id que o manifesto carrega é contrato com terminal em versão antiga e não se renomeia depois de publicado; id que vive só no cliente é build, e renomear é barato **enquanto nada foi entregue**. É essa janela que torna esta issue urgente agora.

## Escopo

**Id nomeia função, e é imutável.** O id diz o que o bloco _faz_ — nunca como ele aparece nem onde. Id publicado não se renomeia: terminal em versão antiga continua pedindo o nome antigo, e renomear é retirar a tela dele sem aviso. Função mudou? Id novo, e o velho vira inerte — o mesmo ciclo do banco, pela mesma razão.

**Um prefixo, uma espécie.** O prefixo é a palavra que a prosa usa para aquela espécie de coisa, e duas espécies que a prosa distingue não dividem prefixo. O sufixo nunca é o discriminador: se para saber de que espécie um id é é preciso olhar o formato do sufixo, o prefixo está errado. Espécie nova não se acomoda em prefixo existente "porque é parecida".

**Prefixo novo entra no registro na mesma mudança do primeiro id que o usa.** Registro que corre atrás do código é registro que já mentiu.

Itens a entregar:

* Enumeração dos ids, com a função de cada um em uma frase.
* Registro de prefixos: qual espécie cada prefixo nomeia.
* Tipo que torna id fora do vocabulário um erro de compilação, no servidor e no cliente.
* Nota explícita de quais ids atravessam a rede (contrato) e quais são internos (build).

## Fora de escopo

Aparência e variante de cada bloco — a variante é escolhida no terminal, não no vocabulário (`SPR-47`).

## Critério de aceite

* Id fora do vocabulário não compila.
* Dois ids de espécies diferentes com o mesmo prefixo não compilam, ou o registro os recusa.
* Existe um teste que afirma: id publicado que desaparece do registro é erro, não limpeza.

## Referências

`docs/design/vocabulario-e-eixos.md` · `.claude/rules/ui.md` seção "Bloco, variante e eixo" · `.claude/rules/migrations.md` §4 (o ciclo, pela analogia)
