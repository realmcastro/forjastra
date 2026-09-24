# SPR-41 — Gate de segurança do modelo da Fase 1 — isolamento de tenant

**Tipo:** Spike · **Estado ao migrar:** A fazer · **Prazo que constava:** 2026-10-09
**Agrupador:** SPR-34

---

## Contexto

Modelo da Fase 1 está pronto para auditoria **antes** de qualquer código de API tocá-lo. Auditoria encontra e prova, não corrige. Corretor vira despacho ao dono.

**Pergunta que a auditoria responde:**

> O isolamento de tenant é absoluto no modelo? Não existe caminho que um valor vaze entre clientes?

## O que testar

**1. Caminho de consulta entre schemas**

* Cenário: cada query feita contra o schema do cliente autenticado apenas
* Desfecho: existe JOIN entre schemas? Relatório consolidado que cruza dados?
* Método: ler todas as migrations e procurar referência cruzada entre schemas

**2. Resolução de schema**

* Cenário: schema vem de identidade autenticada, nunca de entrada do usuário
* Desfecho: schema entra por vínculo de conexão ou qualificação estática? Nunca por concatenação de string
* Limitador: `search_path` não é segurança; entrada do chamador não qualifica schema

**3. IDOR em recurso cruzado**

* Cenário: id de venda do cliente A é recebido por API; validação **contra o tenant** antes de uso?
* Desfecho: código confia no id recebido ou valida propriedade?

**4. Canais laterais**

* Cenário: cache, fila, log, arquivo temporário, exportação e relatório
* Desfecho: cada um carrega tenant no escopo da chave? Ou risco de colisão entre clientes?

## Entrega

* Matriz de achados com cada categoria (caminho, resolução, IDOR, canal)
* Path da migração ou do código onde o risco mora
* Classificação: CRÍTICO (vaza entre clientes) ou inferior

## Critério de conclusão

* Todas as quatro perguntas respondidas explicitamente
* Achado CRÍTICO não resolvido bloqueia avanço para Fase 2
* Achados ALTO/MÉDIO/BAIXO registrados em `docs/auditorias/`

## Fora de escopo

Autorização por papel, cifragem de trânsito, log de auditoria.

## Referências

`.claude/rules/seguranca.md` §1 · `.claude/rules/dados.md` §1

## Resultados esperados

Relatório de auditoria datado, com achados no formato: onde (path:linha), cenário concreto, por que é real, correção sugerida e agente dono.Responde explicitamente as cinco perguntas de isolamento: consulta cruzando schema; origem do tenant; tenant opcional caindo em default; id validado contra o tenant; e canais laterais — cache, fila, log, arquivo temporário, exportação e relatório.Só achado com cenário concreto entra como achado; o resto vai em nota. Severidade sem inflação. O que não deu para verificar é declarado, nunca aprovado por ausência de evidência.
