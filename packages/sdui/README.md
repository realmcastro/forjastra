# `packages/sdui` — vocabulário de bloco e análise do manifesto

Lógica pura do lado do cliente: o **universo fechado de ids** que o manifesto pode carregar
(`SPR-45`) e o **analisador tolerante** que transforma manifesto em árvore renderizável sem
nunca derrubar a tela (`SPR-44`). Sem render, sem componente, sem tema — isso é `apps/web`, e
não nasce aqui.

`docs/design/vocabulario-e-eixos.md` e `docs/design/tolerancia-de-versao.md` continuam sendo a
autoridade sobre **significado**. Este pacote é a autoridade sobre **compilação**.

## Rodar

```
npm install
npm run typecheck
npm test
```

`test/types.test.ts` quase não tem `assert`: as garantias dele são de compilação, e cada
`@ts-expect-error` falha o `tsc` no dia em que o erro que ele espera parar de acontecer.

## O que está provado, e por quais entradas

Os manifestos hostis estão nomeados um a um em `test/fixtures.ts`, porque o servidor que emite
manifesto ainda não existe. Nenhum deles é "simular a API".

| Entrada | Desfecho afirmado |
|---|---|
| manifesto válido | árvore inteira, ordenada por zona e ordinal |
| JSON malformado · resposta truncada no meio do nó | o analisador **não lança**; resposta inaproveitável |
| tipo desconhecido entre tipos válidos | os desconhecidos somem, **o do meio renderiza** |
| versão futura (campo que hoje não existe) | campo ignorado, nó sobrevive, nada é promovido a conhecido |
| papel conhecido com props erradas | nó descartado, irmão continua |
| props com `__proto__` | nó descartado, protótipo intocado |
| nó válido entre dois inválidos | dois descartes, um nó de pé |
| profundidade absurda · referência circular | subárvore cortada e nomeada, ancestral sobrevive |
| id desconhecido na zona de ação crítica | slot vira piso e **nenhuma ação é oferecida** |
| papel de piso emitido pelo servidor | recusado: degradação é decisão do cliente |
| resposta que nunca chega | cache com o instante declarado; sem cache, piso embutido |

Resposta inaproveitável **não é cacheada** (`resolveScreen`), e o cache guarda o corpo **como
chegou**, não a árvore analisada: cliente novo reinterpreta manifesto velho.

## As lacunas que este pacote não fecha

- **V-02 — nome dos campos do nó.** É contrato de `backend`. Os nomes provisórios vivem em
  `src/manifest/wire.ts`, em um lugar só, e um teste os fixa. Fechar V-02 é editar esse
  arquivo. O campo de **criticidade** deliberadamente não tem nome aqui: o analisador não
  precisa dele, porque a zona já diz o que ele precisa saber.
- **V-03 — o cliente anuncia a versão de vocabulário que entende?** Enquanto não anunciar, ele
  falha fechado: id desconhecido é descartado, nunca aproximado.
- **V-04 — estreia de id em caminho crítico.** O analisador já faz a parte dele (o slot vira
  piso, a ação não acontece). A política de quando o servidor pode emitir id novo é de
  `backend` + humano.
- **V-05 — o piso embutido vende?** Hoje `EMBEDDED_FLOOR` só carrega
  `block.connection-status`, porque `PN-15` proíbe o terminal ficar mudo. Informar de menos é
  recuperável; vender errado não.
- **Prop tipada por papel é Fase 3.** `PropsByKind` já existe com uma linha por papel, e hoje
  toda linha é o canal estrutural (escalar ou lista de escalares). Estreitar uma linha depois é
  edição local.

## O que não se afrouxa

`BLOCK_KINDS` é fechado: acrescentar papel é **mudar código do cliente, de propósito**. Id
publicado é imutável — o livro em `src/vocabulary/published.ts` é append-only, e id que some
dele é erro, não limpeza. Enquanto o livro estiver vazio, renomear ainda custa um `sed`; depois
da primeira emissão, custa a tela de um terminal que ninguém atualizou.
