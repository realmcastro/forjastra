---
name: convention-celula-candidata-e-especie-diferente-de-celula-valorada
description: linha candidata com valor EM BRANCO não é `?` — `?` é valor, nega por decisão-ausente e CONTA na contagem da matriz; branco é a linha que ainda não foi admitida, e somar a folha de candidatas à contagem produz número falso sem sintoma
type: convention
escopo: plataforma
camada: produto
data: 2026-08-23
relaciona: [[decision-celula-e-autoridade-unica-sobre-autorizacao]], [[gotcha-regra-nova-que-nao-corrige-a-celula-nasce-inerte]]
tarefa: T-0004
---

Quando um escopo novo precisa de autorização, nasce uma **folha de valoração**: as linhas candidatas, com o
valor de célula em branco, num arquivo **fora** da família cujas células são autoridade. Duas espécies, e
confundi-las mente de duas formas.

- **`?` é um valor.** Tem significado próprio ("ninguém decidiu"), nega por default e **conta** na contagem
  consolidada da matriz.
- **Branco é a ausência da linha.** A operação não existe em matriz nenhuma, logo é negada a todos por
  omissão. O desfecho é o mesmo antes e depois da folha — **negado**. O que a folha muda é que a pergunta
  passa a ter forma, dono e um lugar só.

**Por quê:** somar as células da folha às da matriz produz um número falso **sem nenhum sintoma** — a
contagem de indecisão é citada em vários arquivos como medida de quanto falta decidir, e ela deixa de bater
sem que nada acuse. No sentido inverso, ler branco como `?` faz alguém concluir que a linha "já foi
decidida como indecisa", quando ela nem foi admitida.

**Duas disciplinas que vêm com a folha:** (1) **nome fora da família** de arquivo cujas células são
autoridade — nomeá-la como irmã convida a próxima leitura a tratar candidato como concessão; (2) as linhas
são por **espécie de objeto**, nunca por superfície: item novo na tela não deve exigir célula nova, e se
exigir, ou a linha estava fina demais, ou o item é de outra espécie.

**Como aplicar:** ao valorar, a folha **migra ou se converte** na mesma passada — o que não se faz é deixar
as duas cópias vivas. E quem citar contagem de células diz de qual das duas espécies está falando.
