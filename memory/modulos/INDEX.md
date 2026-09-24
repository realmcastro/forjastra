# Memória — Módulos (regra do módulo, agnóstica de cliente)

Um subdiretório por módulo, cada um com seu `INDEX.md`. Leia **só** o do módulo da sua tarefa.

| Módulo | Índice | Estado |
|---|---|---|
| `FIS` — tributação | [fis/INDEX.md](fis/INDEX.md) | spec escrita; **não modelável** enquanto `D-05` estiver aberta |
| `EMI` — emissão de documento fiscal | [emi/INDEX.md](emi/INDEX.md) | spec escrita; emissão própria decidida |
| `PER` — periféricos | [per/INDEX.md](per/INDEX.md) | `LACUNA-PER-6` fechada em 2026-09-23 → `RN-NUC-063`; código lido só como GTIN global |
| `GRD` — grade de variação | [grd/INDEX.md](grd/INDEX.md) | **cross-vertical**, não é módulo de moda; a fronteira do eixo único é `G-04`, aberta |

**Ao criar um módulo:** `mkdir memory/modulos/<modulo>` + `INDEX.md` com as seções `Regras de
negócio` / `Decisões` / `Armadilhas`, e adicione a linha nesta tabela. O nome do módulo é o do
glossário de `produto` — nunca um apelido novo.

O que mora aqui: regra que vale para **todo** cliente que tem o módulo. O que aquele cliente muda
naquele módulo mora em `clientes/<cliente>/modulos/<modulo>/`.
