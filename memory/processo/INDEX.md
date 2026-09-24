# Memória — Processo (como trabalhamos com IA e ferramenta)

## Convenções

- [CLAUDE.md é só panorama, com teto duro](convention-claude-md-e-so-panorama.md) — regra detalhada mora em `.claude/rules/`, lida sob demanda; arquivo sempre-carregado tem custo por mensagem · camada:processo

- [Corrigir dentro da linha quando o arquivo está no teto](convention-corrigir-dentro-da-linha-quando-o-arquivo-esta-no-teto.md) — arquivo em 400 citado por `path:linha` de território alheio não se parte: partir cria referência pendurada que o dono não pode consertar · camada:processo

- [Propriedade acusa, nunca desculpa](convention-propriedade-acusa-nunca-desculpa.md) — critério de exclusão que o beneficiário emite é o furo; desculpar exige identidade registrada pelo ato · camada:seguranca

- [Exclusão se prova com o excluído hostil](convention-exclusao-se-prova-com-o-excluido-hostil.md) — o legítimo no pior estado permitido, mais mutação no dist matando caso; suíte verde não prova · camada:seguranca

- [`node --test` inventa teste para arquivo vazio](gotcha-node-test-inventa-teste-para-arquivo-vazio.md) — arquivo esvaziado conta como exercido; o relator por arquivo descarta o teste com o nome do caminho · camada:processo

- [Número de RN colide entre instâncias paralelas](gotcha-numero-de-rn-colide-entre-instancias-paralelas.md) — arquivo disjunto não protege contador global; reservar faixa de RN no plano · camada:processo

- [Decisão delegada, com aviso no módulo](convention-decisao-delegada-com-aviso-no-modulo.md) — desde 2026-09-23 o thread decide o pendente pela escalabilidade e registra; dependência de terceiro vira aviso no módulo, não trava · camada:processo

- [Bloqueio nomeia o default silencioso](convention-bloqueio-nomeia-o-default-silencioso.md) — "falta decidir" não move ninguém; o bloqueio diz a pergunta, quem responde, a data em que morde e o que passa a valer se ninguém falar · camada:processo

- [Escrita em registro append-only](convention-escrita-em-registro-append-only.md) — a ordem de publicação é conteúdo (não cite fato que ainda não existe), e substituição destrutiva vem depois do comentário de preservação com quatro partes, a quarta sendo o destino de cada critério que sai · camada:processo

- [Prazo é o ideal mais 30%](convention-prazo-e-ideal-mais-trinta-por-cento.md) — data limite no Jira = `ceil(ideal × 1,3)` em dias úteis, encadeado por pessoa; folga mora no prazo · camada:processo

- [Varredura de captura: infeliz primeiro, e âncora em `RN` não basta](convention-varredura-de-captura-infeliz-primeiro-e-ancora-rn-nao-basta.md) — 11 dos 12 achados saíram de bloco `**Infeliz**`; e a cobertura tem dois buracos: `plataforma` nunca terá `RN`, e profundidade declarada vazia para o arquivo conta como coberto sem leitura · camada:produto

- [Achado agrupa por fluxo, nunca por mecanismo](convention-achado-agrupa-por-fluxo-nunca-por-mecanismo.md) — item cabe num contrato de módulo só; agrupar dois achados porque alteram a mesma regra economiza uma edição para quem escreve e entrega dois donos para quem executa · camada:produto

## Armadilhas

- [Endereço de relatório envelhece na própria sessão](gotcha-endereco-de-relatorio-envelhece-na-propria-sessao.md) — endereço errado com substância certa (2026-08-23) e endereço certo com substância **morta**, publicada como afirmação falsa em comentário append-only (2026-08-26); confira a substância, e confira a lista de pendências **contra o alvo** · camada:processo

- [O título não é o card](gotcha-o-titulo-nao-e-o-card.md) — revisar backlog por título erra nos dois sentidos: o corpo de `SPR-36` decidia uma lacuna do humano com o título limpo, e `SPR-18`/`SPR-30` tinham título já corrigido sobre corpo contradizendo-o · camada:processo
- [Julgar o próprio texto não pega erro de escopo ou de fato](gotcha-julgar-o-proprio-texto-nao-pega-erro-de-escopo-ou-de-fato.md) — amostragem independente achou 5 defeitos que a passada de escrita não viu (todos corrigidos), um deles com o modelo padrão, não só com o mais barato; a verificação de terceiro não é dispensável por causa da qualidade do modelo · camada:processo
- [A correção muda a pergunta e conserva uma fronteira dela](gotcha-a-correcao-muda-a-pergunta-e-conserva-uma-fronteira-dela.md) — três reincidências no mesmo dia pela mesma raiz; e teste montado da lista do achado prova **o achado**, nunca a classe — o que fecha é o caso que ataca o conserto · camada:processo

## Decisões

_(decisão sobre processo que vale para a plataforma inteira mora em `plataforma/`; aqui só o que é sobre ferramenta/fluxo)_

- [O backlog no repositório é o registro público da tarefa](decision-backlog-e-o-registro-publico-da-tarefa.md) — item em `docs/backlog/` antes do plano, ficha segue `T-000n` com campo `backlog:`, e espelhamento acabou junto com o Jira em 2026-09-11: plano, relatório e fechamento moram na ficha uma vez só · camada:processo

- [Produto é o dono do backlog](decision-produto-e-o-dono-do-backlog.md) — dono do conteúdo de `docs/backlog/**` e o único agent que escreve lá; a armadilha que sobrou é outra: mudança de `tools:` em agent pode não valer na sessão corrente · camada:processo
- [Commit é ato do humano, não do processo](decision-commit-e-ato-do-humano-nao-do-processo.md) — o agent `commiter` tem o padrão de branch/commit/PR, revisado em 2026-09-23: comita e dá push direto em `main`, sem PR, despachado pelo thread quando um bloco está pronto; nunca em plano · camada:processo

## Estado

- [Execução solo desde 2026-09-11](state-execucao-solo-2026-09-11.md) — os colegas saíram; o calendário do board foi feito para três pessoas, então card vencido não é atraso, e a ordem volta a ser por dependência; o alvo declarado é MVP sólido, rico em informação e multi-dispositivo · camada:processo
- [Retomada de 2026-09-23](state-retomada-2026-09-23.md) — nada em voo por pedido do humano; decisões delegadas tomadas; fila exata de próximas passadas e o que só a permissão dele destrava · camada:processo
