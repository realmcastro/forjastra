---
name: decision-d-03-opcao-c-sujeito-local-ao-cliente
description: D-03 fechada em 2026-09-23 pela opção C: o sujeito de cliente mora no schema do cliente e é provado sob app_t_x; o platform guarda só índice de encaminhamento opaco (alça → cliente); rede é um cliente; portador de terminal emitido por habilitação e nunca revinculado; população nossa só no console
type: decision
escopo: plataforma
camada: backend
data: 2026-09-23
relaciona: [[decision-papel-de-aplicacao-assumido-por-transacao]], [[decision-d-06-ii-trilha-no-platform-com-projecao-no-cliente]], [[gotcha-portador-de-terminal-revinculado-leva-a-fila-para-outro-cliente]]
supera: [[decision-d-03-sao-tres-eixos-nao-uma-decisao]]
tarefa: T-0015
---

Decidido pelo thread, por delegação do humano, sobre `docs/arquitetura/d-03-identidade-decisao-2026-09-23.md`,
com o gate `docs/auditorias/2026-09-23-d-03-decisao.md` e a consulta B.2' na ficha:

- **E1, residência do sujeito:** local ao cliente. O verificador fica em `t_x` e é lido sob `app_t_x`, pelo
  mesmo privilégio que isola a venda. Rede com N estabelecimentos é **um** cliente; pessoa de cliente em
  vários clientes é borda (contador, franquia fora do MVP).
- **E3, chegada do tenant:** um índice de encaminhamento no `platform` (alça opaca → cliente, nunca e-mail
  nem telefone, sem nome, verificador nem papel, sem FK para `t_*`). Vigência por linha de encerramento,
  terminal, com `UNIQUE (alça)`: a mesma alça nunca volta apontando para outro cliente.
- **E2, mecanismo de prova:** não escolhido aqui (biblioteca de hash e formato de token ficam fora).

**Três cláusulas do gate, que são parte da decisão:**
1. **`IDN-01`:** o portador do terminal é emitido por habilitação em **um** cliente e nunca é revinculado.
   O cliente de um fato é o do portador que o produziu. Aparelho que já foi de outro cliente só é habilitado
   depois de drenar ou de ter a fila declarada na origem, e o que ele retém é tratado como comprometido.
2. **`IDN-08`:** duas credenciais da mesma pessoa no mesmo cliente são **um** sujeito, nunca dois.
3. **`IDN-04`:** a população nossa é lida só pelo console do provedor (outra aplicação), nunca pela borda
   de `apps/api`.

A credencial da borda é própria (não papel assumido), com declaração em tabela própria, desenhada junto
com o grupo do `PAP-28` e o gravador de `D-05`. O fato de recusa r2 **não carrega nada** sobre a origem.

**Por quê:** em B, o vazamento de identidade entre clientes concluiria com sucesso; em C, falha pelo mesmo
privilégio que já isola a venda. O custo de reversão de B (mapa global de pessoas) é o mais alto.

**Como aplicar:** `IDN-02`, `03`, `05`, `06` e `07` são requisito escrito da implementação da Fase 2: pool
e concorrência próprios para a entrada anônima, piso fixo de tempo na resposta com o fato gravado fora do
caminho dela, limite de alça de escopo por sessão, recuperação do primeiro `owner`, e segundo fator nas
linhas 40 e 21 da matriz. A entrada do ato de resolução existe desde 2026-09-23 em `RN-PRV-004` (d): três origens fechadas, fila
atribuída por ato explícito, um escopo vigente por pessoa nossa.
