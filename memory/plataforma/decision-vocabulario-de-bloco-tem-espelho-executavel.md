---
name: decision-vocabulario-de-bloco-tem-espelho-executavel
description: o vocabulário de ids de bloco passou a existir duas vezes — o documento manda no significado, packages/sdui manda na compilação; e enquanto o livro de ids publicados estiver vazio, renomear um id de bloco custa um sed, depois da primeira emissão é impossível
type: decision
escopo: plataforma
camada: sdui
data: 2026-09-12
relaciona: [[convention-prefixo-de-token-uma-especie]], [[state-packages-sdui-aberto-2026-09-12]]
tarefa: T-0012
---

O vocabulário fechado de papéis de bloco existe **em dois lugares, de propósito**:
`docs/design/vocabulario-e-eixos.md` §1–§3 é a autoridade sobre **significado**, e
`packages/sdui/src/vocabulary/` é a autoridade sobre **compilação** — `BLOCK_KINDS` é união de
literais, e id fora dela não compila (`packages/sdui/test/types.test.ts`).

Três peças que não são detalhe de implementação:

- **`checkVocabulary` não roda na importação e não lança.** Registro malformado é defeito de
  construção, e um processo que não sobe derruba o caixa; quem cobra é o teste, antes de o build
  existir.
- **O livro de ids publicados (`published.ts`) é `string`, não `BlockKind`.** Se fosse tipado
  contra o registro, a mesma edição que apaga um id apagaria a evidência de que ele existiu, e
  nada acusaria. Id publicado que some do registro é **erro**, não limpeza.
- **`block.` é um prefixo só**, com a exposição de rede declarada **por entrada**: seis papéis o
  manifesto emite (contrato), duas entradas de piso só o cliente usa (build).

**Por quê:** o custo de errar um id depende de quem atravessa a rede. Enquanto nenhum servidor
emitiu manifesto — e o livro vazio é a prova disso, não uma impressão — renomear custa um `sed`.
Depois da primeira emissão, o terminal que ninguém atualizou continua pedindo o nome antigo, e
renomear é retirar a tela dele sem aviso. A janela está aberta **agora** e fecha sozinha.

Foi sob essa janela que `block.line-collection` virou **`block.record-collection`** em 2026-09-12:
"linha" é aparência, e o próprio §1.2 usa esse par como argumento contra aparência no nome.

**Como aplicar:** antes de propor id novo ou rename, abra `published.ts`. Vazio? O rename é uma
edição e um `sed`, e é agora. Com linha? Id novo, o velho vira inerte, e a retirada é decisão
registrada que declara quem ainda emite e quem ainda entende.
