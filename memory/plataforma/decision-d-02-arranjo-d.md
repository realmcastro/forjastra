---
name: decision-d-02-arranjo-d
description: D-02 fechada em 2026-09-11 no arranjo D — a interface roda em navegador (Expo Web) e um acompanhante nativo em Node carrega custódia, fila offline, assinatura e impressora; fecha porque manter Linux desktop possível elimina o arranjo B por construção, e porque o acompanhante em Node não introduz segunda linguagem
type: decision
escopo: plataforma
camada: backend
data: 2026-09-11
relaciona: [[decision-stack-node-typescript-estrito]], [[reference-dossies-de-decisao-de-arquitetura]], [[state-execucao-solo-2026-09-11]]
supera: [[state-d-02-arranjo-b-ou-d]]
---

**Arranjo D.** A interface do terminal roda dentro de um navegador; um **acompanhante nativo em Node**,
instalado na máquina, carrega o que exige custódia. Decidido pelo humano em 2026-09-11, sobre
recomendação minha. Fecha `D-02` inteira.

## Por quê

1. **O alvo Linux ficou deliberadamente em aberto.** Perguntado se Linux seria caixa de verdade ou só
   máquina de desenvolvimento, o humano respondeu que não sabe e quer a opção que não o prende. Isso
   decide sozinho: o arranjo B põe a interface dentro do processo nativo, e **React Native não tem alvo
   Linux desktop**. Em B, atender um cliente Linux significa escrever a interface uma segunda vez. Em D,
   Linux custa **zero hoje** e continua possível amanhã, porque o navegador já está lá e só o
   acompanhante precisa compilar.
2. **O acompanhante é Node**, então o arranjo não reabre `D-01`. Em B, a estação Windows seria React
   Native Windows fora do Expo, em suporte best-effort, que é a única peça do desenho sem dono claro.
3. **Uma superfície de interface serve os seis alvos**: web, Windows, Linux, macOS, Android e iOS. O
   corte por custódia (dossiê §3.1) continua valendo e não muda: a superfície **sem** custódia é servida
   direto pelo navegador; a **com** custódia ganha o acompanhante ao lado, não uma interface diferente.

## Recusado

**Arranjo B** (interface dentro do processo nativo), pelos três motivos acima. **Arranjo C** nunca foi
opção: é o nome do desfecho de não decidir.

## O preço, e ele é nomeado

- **As seis exigências de E1 migram inteiras para o acompanhante**: assinar sem rede, imprimir com
  desfecho de falha sob nosso controle, persistir ilegível em repouso, não descartar fato, drenar em
  plano de fundo sem janela em foco. O acompanhante passa a ser o software mais difícil do sistema, e
  ele **não tem tela onde um defeito apareça**. `R-01`…`R-09` moram nele.
- **Nasce uma superfície de segurança que B não tinha**: o canal local entre navegador e acompanhante.
  Quem autoriza aquele navegador a falar com aquele acompanhante, e o que impede outra página aberta na
  mesma máquina de falar também, é desenho obrigatório, com gate de `seguranca`, antes de qualquer
  código de fila.
- **Navegador em terminal de caixa é operação**, não detalhe: modo quiosque, política de atualização e
  comportamento quando a aba morre no meio de uma venda.
- **`SPR-50`, `SPR-42` e `SPR-43` deixam de decidir e passam a medir.** A evidência continua sendo
  exigida; o que ela não faz mais é escolher o arranjo. As duas perguntas do dossiê que podiam decidir
  sozinhas mudam de natureza: **certificado A3** deixa de ser risco de arranjo (D já é o arranjo que A3
  exigiria), e **biblioteca de impressora de fabricante** vira risco de linguagem do acompanhante, a ser
  medido contra Node.

## Como aplicar

Interface em Expo / React Native Web, alvo único. Acompanhante nativo em Node, território de `backend`.
O **contrato entre os dois** é artefato de primeira classe e precisa existir antes da fila: ele é o que
impede a regra de negócio de vazar para dentro do acompanhante. Superfície sem custódia continua no
navegador, sem acompanhante nenhum.
