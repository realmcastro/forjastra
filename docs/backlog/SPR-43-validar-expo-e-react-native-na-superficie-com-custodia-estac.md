# SPR-43 — Validar Expo e React Native na superfície COM custódia — estação Windows offline e terminal do operador

**Tipo:** Spike · **Estado ao migrar:** A fazer · **Prazo que constava:** 2026-09-09
**Agrupador:** SPR-35

---

## Contexto

A estação fixa em Windows, operando offline, e o terminal móvel do operador são o alvo que **decide** a arquitetura do cliente — eles carregam custódia (assinar documento fiscal, imprimir com controle de falha, guardar fila ilegível em repouso, consumir faixa pré-alocada, drenar em segundo plano). Verificado em 2026-08-26, em fonte primária: Expo não cobre Windows desktop — é plataforma _out-of-tree_, atendida só por solução de userland, sem `prebuild` e sem geração nativa contínua. A tarefa desta issue não é reconfirmar isso: é medir o que cada saída custa.

Duas saídas em jogo:

```
alvo: estação Windows offline + terminal do operador
→ saída A: interface dentro do processo nativo (RN Windows fora do Expo, best-effort)
→ saída B: interface no navegador + serviço acompanhante nativo carregando a custódia
```

> Cada uma das seis exigências de custódia abaixo — qual saída atende, e com que evidência medida?

## O que testar

**1. Repouso ilegível**

* Cenário: dispositivo em mãos, aplicação fechada, outro programa ou outro usuário tenta ler o conteúdo da fila local.
* Desfecho esperado: conteúdo ilegível fora da aplicação; alteração no arquivo é detectável.
* Não atende: "confiamos na criptografia de disco do sistema" — é rebaixar o requisito, não atendê-lo.

**2. Assinar no ponto de emissão, sem rede**

* Cenário: emissão de documento fiscal com a rede desligada.
* Desfecho esperado: assinatura ocorre com capacidade escopada, com prazo, revogável imediatamente, contada por uso, com trilha por ato — nunca com credencial estacionada e exportável do dispositivo.

**3. Contingência em um passo só**

* Cenário: falha de autorização prévia durante a venda.
* Desfecho esperado: gerar, assinar e imprimir acontecem em sequência, sem essa autorização, com a transmissão ocorrendo depois. "Assino no servidor, imprimo no terminal" não é cenário válido — não há servidor alcançável.

**4. Impressão com falha sob controle**

* Cenário: periférico de impressão ausente ou com erro durante o fechamento da venda.
* Desfecho esperado: a venda degrada (por exemplo, reimpressão pendente) e não bloqueia. Alvo que só imprime pelo diálogo do sistema hospedeiro não atende.

**5. Faixa pré-alocada consumida offline**

* Cenário: dispositivo obtém a faixa com conexão, depois opera offline consumindo dela sem consultar ninguém; em seguida, o sistema operacional aciona limpeza de armazenamento (pressão de espaço, modo privado).
* Desfecho esperado: a faixa sobrevive à limpeza do hospedeiro. Armazenamento que o hospedeiro pode descartar não atende — descarte de faixa é número fiscal queimado.

**6. Drenagem em segundo plano**

* Cenário: a janela da aplicação perde o foco ou é minimizada durante a drenagem da fila.
* Desfecho esperado: a drenagem continua, cede prioridade ao caminho do caixa, e é interrompível sem perder o progresso já drenado. Alvo que só executa com janela em foco não atende.

## Entrega

* Para cada uma das seis exigências: qual saída (interface nativa ou acompanhante) atende, com evidência medida — não estimada.
* Registro por cenário testado, na rubrica:

```
Cenário:
Resultado:
Limitação encontrada:
Como foi reproduzido:
Fonte primária (URL):
Impacto:
```

* As duas perguntas que podem decidir isto sem precisar rodar as seis exigências inteiras, levadas ao humano assim que tiverem resposta: se o certificado exige dispositivo físico específico, e o que a biblioteca da impressora do fabricante realmente exige de sistema e linguagem.

## Critério de conclusão

Cada uma das seis exigências foi testada contra as duas saídas e documentada na rubrica, incluindo o que falhou. **Não é necessário que uma saída atenda às seis** — é necessário que as seis estejam registradas, com resultado, reprodução e impacto, para quem fechar `SPR-50` decidir com evidência e não com suposição.

## Fora de escopo

A superfície sem custódia (retaguarda, cliente-final, display de leitura à distância) — é `SPR-42`. A decisão de arranjo em si — é `SPR-50`.

## Referências

`docs/produto/fila-local-conteudo-e-repouso.md` · `docs/produto/fiscal-custodia-e-trilha.md` · `docs/produto/fiscal-emissao-contingencia.md` · `docs/produto/operacao-offline-e-sincronizacao.md` · `docs/produto/offline-grandezas-e-orcamento.md` · `docs/produto/modulos/perifericos-classes.md` · `docs/arquitetura/d-01-d-02-stack-opcoes.md` §1, §3.2, §3.3

## Resultados esperados

Um veredito por exigencia, cada um com uma das tres marcas: ATENDE (com prova executavel), NAO ATENDE (com fonte primaria), ou ATENDE COM CUSTO (com o custo nomeado: modulo nativo a escrever, dependencia de fabricante, processo separado a instalar e atualizar).As seis exigencias: repouso ilegivel fora da aplicacao com o dispositivo em maos e o app fechado; assinar sem rede no ponto de emissao; gerar, assinar e imprimir num so passo sem rede; imprimir com o desfecho de falha sob nosso controle; faixa pre-alocada que o hospedeiro nao pode descartar; e drenar em plano de fundo sem janela em foco.Fecha com uma recomendacao entre as duas saidas viaveis (React Native Windows fora do Expo, em suporte best-effort; ou servico acompanhante nativo com a interface no navegador), dizendo qual das seis exigencias decide o empate e por que. Nao decide sozinho: entrega a evidencia.
