---
name: gotcha-23505-sem-read-back-acusa-reenvio-legitimo
description: sendo a chave primária a identidade de idempotência, a violação de unicidade é a **colisão** de RN-OFF-013, nunca o reenvio legítimo — rota que deixa o erro subir sem ler de volta o desfecho já gravado transforma uma venda que deu certo em defeito crítico escalado ao operador
type: gotcha
escopo: plataforma
camada: backend
data: 2026-09-11
relaciona: [[decision-d-04-chave-timestamps-exclusao]], [[gotcha-chave-unica-globalmente-parece-endereco]]
tarefa: T-0011
---

**Sintoma:** o operador fecha uma venda, a rede engasga, o terminal reenvia, e a tela acusa erro
grave numa venda que **já está gravada e correta**. O caixa para para resolver um problema que não
existe.

`D-04` fez da identidade cunhada no terminal a **própria chave primária**, o que é a escolha certa e
elimina a janela de duas colunas únicas. A consequência que não é óbvia: a violação de unicidade
passa a ter **dois significados completamente diferentes**, e o banco devolve o mesmo código para os
dois.

- **Reenvio legítimo** — o terminal manda de novo a mesma operação porque a resposta se perdeu. É o
  caso **comum**, é o que `RN-OFF-013` foi desenhada para tornar seguro, e o desfecho correto é
  devolver **o mesmo resultado**.
- **Colisão** — duas operações distintas cunharam a mesma identidade. É o caminho **infeliz** de
  `RN-OFF-013`, é raro, e é defeito real.

Traduzir a violação direto para erro de colisão trata o caso comum como se fosse o raro.

**A trava:** toda rota que move dinheiro ou estoque **lê de volta o desfecho já gravado** antes de
deixar a violação subir. Se o que está gravado corresponde à operação recebida, a resposta é o
resultado original, e nada de anormal aconteceu. Só quando o gravado **diverge** do recebido existe
colisão.

**Por quê é fácil errar:** a tradução de erro do banco para erro da API é escrita uma vez, na
fundação, longe de qualquer rota — e ali a violação de unicidade parece inequivocamente um conflito.
O significado só aparece na rota, que é escrita depois e por outra pessoa.

**Como aplicar:** `backend.md` §3 exige que repetição devolva o **mesmo** resultado. O mecanismo é
este read-back, e ele é parte da rota, nunca da camada de erro. Nenhuma rota de dinheiro ou estoque
fecha revisão sem teste que reenvia a mesma operação e verifica que a segunda resposta é igual à
primeira.
