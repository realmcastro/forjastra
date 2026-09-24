# A delegação por dono de objeto, §7.5.6

> Parte de `db/papeis-e-credencial.md`, e continua a numeração dela. Da §7.5 à §7.5.2, em
> `db/verificacao-do-papel.md`; da §7.5.3 à §7.5.5, em `db/universo-e-declaracao.md`. Mora em arquivo
> próprio pelo teto de 400 linhas dos outros dois.
> Nasceu em 2026-09-23, do `SUB-09` da terceira auditoria da credencial na subida
> (`docs/auditorias/2026-09-23-conferencia-da-credencial-na-subida-terceira.md`), com o critério
> ampliado no mesmo dia pela medição do `backend`.
> Autor: `arquiteto-dados` · T-0009.

**O que esta seção responde, em uma frase:** nenhum objeto de schema protegido roda com o privilégio
do dono sobre coisa que não é dele. Protegido é `platform` e todo `t_*`.

## O mecanismo

As perguntas da §7.5 à §7.5.5 perguntam **quem alcança** um schema: ACL, membro de papel, papel
predefinido, dono. Há um quinto caminho, e ele não passa por papel nenhum. O executor é dono de todo
schema de cliente (§7.3), e um objeto criado por ele no schema de `acme` roda com o privilégio dele:

```
papel de acme (USAGE só em t_acme)
→ usa um objeto em t_acme
→ o objeto roda como o dono (o executor)
→ o dono alcança t_globex
```

Medido pelo `seguranca` em 2026-09-23, PostgreSQL 16.15, executor não-superusuário, quatro formas:
regra de reescrita (`DO ALSO INSERT INTO t_globex.orders`: a venda de `acme` conclui **e** grava em
`globex`), view materializada, função `SECURITY DEFINER` e view sem `security_invoker`. Nas quatro,
`has_schema_privilege(app_t_acme, t_globex, …)` continua `f`, então nenhuma pergunta de alcance vê
nada. Nas duas primeiras, a saída do `verify` ficava **idêntica** à base.

## O que o `verify` passou a fazer

**1. A impressão de estrutura ganhou duas linhas** (`PROVISION-E-VERIFY.md` §13.3): `materializada`,
com o corpo por `md5` como a `visao`, e `regra`, com `ev_enabled` cru e o corpo por `md5`, exceto a
`_RETURN`, que é a própria view. Nenhuma forma permitida do crivo cria uma ou outra
(`RECUSAS.md` §11.2), então no banco íntegro elas não existem, e a referência do `platform` não mudou.

**2. A pergunta `delegação por dono de objeto`, que veta**, com duas afirmações de conjunto vazio:

- **nenhum objeto de schema protegido depende de objeto de outro schema, qualquer que seja**, lido em
  `pg_depend`;
- **nenhuma rotina de schema protegido é `SECURITY DEFINER`**, lida por existência.

Linha `delegação por dono de objeto:`, evento `object_owner_delegation`, saída `3`. A consulta mora em
`db/migrator/src/protected-dependency.ts`. **O critério é o mesmo da pergunta `delegation` da subida de
`apps/api`** (`apps/api/src/db/credential-query.ts`), e isso é o contrato: dois critérios para o mesmo
estado são dois lados da parede para desencontrar.

## Por que cada escolha

**Por que o conjunto esperado é vazio.** O crivo recusa qualificador de outro schema nas duas streams
(`RECUSAS.md` §11.3) e recusa `SECURITY DEFINER` (§11.5), e o executor fixa o `search_path` no alvo.
Migration nossa não produz dependência que atravessa nem rotina que roda como o dono. Não há exceção a
desculpar, e é por isso que não há exclusão na consulta.

**Por que o destino é qualquer schema, e não só os protegidos.** Medido pelo `backend` em 2026-09-23:
com o destino restrito a `t_*` e `platform`, uma view de `acme` sobre uma view num schema `ext`, que lê
`t_globex`, entregava a venda do outro cliente pelo salto, e um gatilho de `acme` chamando rotina de
`ext` gravava em `t_globex`. Nenhuma ponta atravessava entre protegidos. O schema `ext` também é
acusado pela §7.5.3, mas é a pergunta daqui que nomeia o objeto de `acme` que o usa. O catálogo do
sistema não pede exclusão: dependência sobre objeto embutido não vira linha em `pg_depend`.

**Por que a view com `security_invoker` não é desculpada.** Quem a criou desliga a opção com um
`ALTER VIEW`, então ela é propriedade que o dono do objeto emite, e propriedade assim só acusa
(§7.5.4).

**Por que `SECURITY DEFINER` vai por existência.** Corpo em PL/pgSQL e corpo `sql` entre cifrões não
deixam linha em `pg_depend` sobre o que leem; só `BEGIN ATOMIC` deixa. O corpo é opaco e o dono alcança
tudo, então a pergunta é se a rotina existe.

**Por que o schema de cada objeto sai do catálogo dele, e não de `pg_identify_object`.** Medido em
2026-09-23: ela devolve `schema` nulo para regra, gatilho e default de coluna, três das formas que
atravessam. A consulta junta cada catálogo pela coluna de namespace dele, e regra, gatilho, default e
política herdam o schema da tabela. É uma junção por catálogo, e não uma subconsulta por linha de
`pg_depend`, porque a tabela cresce com os objetos de todos os clientes.

## O que ela não vê, declarado

- **Rotina comum em PL/pgSQL lendo outro schema.** Não deixa dependência e não é `SECURITY DEFINER`.
  Ela roda com o privilégio de quem chama, então o alcance dela é o do papel do cliente, que as outras
  perguntas cobrem. Criada à mão, ela ainda aparece como `sobra: funcao` na comparação de estrutura.
- **Catálogo sem coluna de namespace mapeada** (extensão, servidor estrangeiro, gatilho de evento).
  Não é objeto de schema, e extensão instalada em schema nosso já aparece na comparação de estrutura,
  porque as rotinas dela são `sobra: funcao`.
- **O que o superusuário faz**, aqui como em todo o resto.

## Custo

Medido em 2026-09-23, PostgreSQL 16.15, com 300 clientes provisionados por uma stream de cliente de
medição (três tabelas, duas chaves estrangeiras, dois índices, fora do repositório): 13 249 linhas em
`pg_depend`, a consulta de dependência em 77 a 80 ms (`EXPLAIN ANALYZE`, três execuções), o `verify`
inteiro em cerca de 4,0 s, e **nenhuma** linha de delegação no banco íntegro. A consulta é linear no
número de linhas de `pg_depend`; o `backend` mediu a equivalente com 602 clientes e 111 mil linhas em
cerca de 330 ms. O `verify` roda fora do caminho do caixa, e é `performance` quem diz se a faixa de
milhares de clientes pede outra forma.
