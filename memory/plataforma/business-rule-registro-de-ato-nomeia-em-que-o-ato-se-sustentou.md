---
name: business-rule-registro-de-ato-nomeia-em-que-o-ato-se-sustentou
description: registro de auditoria nomeia uma de três fontes de sustentação (atribuição, concessão, identificação retida + habilitação do terminal) e nunca "nenhuma"; com a terceira e limite publicado, diz também qual teto foi aplicado
type: business-rule
escopo: plataforma
camada: produto
data: 2026-08-23
relaciona: [[business-rule-ato-ordinario-versus-operacao-sensivel]], [[decision-celula-e-autoridade-unica-sobre-autorizacao]], [[gotcha-regra-nova-que-nao-corrige-a-celula-nasce-inerte]]
tarefa: T-0003
---

O campo de autoria do registro de auditoria (`RN-NUC-029`) não pergunta "quem autorizou": pergunta **em que
o ato se sustentou**, e a resposta é exatamente **uma de três** fontes, nunca "nenhuma" — **(1) atribuição**,
**(2) concessão** (`provider_support`), **(3) identificação retida + habilitação do terminal a vender**, que
é o que sustenta o ato ordinário sem contato. Quando a fonte é (3) **e** a operação aplica limite publicado,
o registro diz também **qual teto** foi aplicado.

**Por quê:** com "atribuição ou concessão" apenas, o ato ordinário sem contato não tinha valor possível para
o campo, e os dois desfechos eram defeito — falha fechado e abrir sessão de caixa volta a recusar ao vencer
a validade (`PN-01` de volta); falha aberto e a trilha registra o desconto ao teto do papel-piso como
autorizado pela atribuição de `manager`, tornando **impossível a partir da trilha** verificar exatamente o
que a cláusula do teto existe para permitir. Foi `AUT-15`.

**Como aplicar:** a fonte (3) é **uma**, não duas — identificação e habilitação sempre aparecem juntas e
nenhuma sustenta ato sozinha, então separá-las criaria valor de campo que nunca ocorre isolado, que é como
campo enumerável apodrece. Ao acrescentar operação com célula `R`, responda antes: qual das três fontes a
sustenta, e ela é distinguível na trilha da mesma operação sustentada por outra fonte?
