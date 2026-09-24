import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  BLOCK_KINDS,
  BLOCK_KIND_REGISTRY,
  crossesNetwork,
  isBlockKind,
  type BlockKindEntry,
} from '../src/vocabulary/block-kinds.js';
import { PREFIX_REGISTRY, prefixOf } from '../src/vocabulary/prefixes.js';
import { PUBLISHED_KINDS } from '../src/vocabulary/published.js';
import { checkVocabulary, type VocabularyInput } from '../src/vocabulary/check.js';
import { ZONE_IDS } from '../src/vocabulary/zones.js';

const ENTRADAS = Object.values(BLOCK_KIND_REGISTRY);

function entradaSintetica(kind: string, extra: Partial<BlockKindEntry> = {}): BlockKindEntry {
  // O ponto do teste é justamente um id que o tipo não admite: ele chega pela rede, não pelo build.
  return {
    kind,
    role: 'papel sintético de teste',
    emission: 'manifest',
    status: 'active',
    zones: ['zone.flow'],
    ...extra,
  } as unknown as BlockKindEntry;
}

function base(): VocabularyInput {
  return {
    kinds: ENTRADAS,
    prefixes: PREFIX_REGISTRY,
    published: PUBLISHED_KINDS,
    foreignIds: ZONE_IDS.map((id) => ({ id, species: 'zona de layout' as const })),
  };
}

test('o registro vigente não tem problema nenhum', () => {
  assert.deepEqual(checkVocabulary(), []);
});

test('o registro e a lista de ids são a mesma coisa, sem sobra dos dois lados', () => {
  assert.deepEqual([...BLOCK_KINDS].sort(), Object.keys(BLOCK_KIND_REGISTRY).sort());
  for (const kind of BLOCK_KINDS) {
    assert.equal(BLOCK_KIND_REGISTRY[kind].kind, kind);
    assert.ok(BLOCK_KIND_REGISTRY[kind].role.length > 0, kind);
  }
});

test('todo id declara se atravessa a rede, e as duas entradas de piso não atravessam', () => {
  const contrato = BLOCK_KINDS.filter(crossesNetwork);
  const build = BLOCK_KINDS.filter((kind) => !crossesNetwork(kind));

  assert.deepEqual(contrato, [
    'block.region',
    'block.record-collection',
    'block.record-summary',
    'block.entry',
    'block.option-set',
    'block.command',
  ]);
  assert.deepEqual(build, ['block.fallback', 'block.connection-status']);
});

test('todo prefixo usado tem linha no registro de prefixos', () => {
  for (const id of [...BLOCK_KINDS, ...ZONE_IDS]) {
    const prefixo = prefixOf(id);
    assert.ok(prefixo !== null, id);
    assert.ok(
      PREFIX_REGISTRY.some((entrada) => entrada.prefix === prefixo),
      `${id}: prefixo "${String(prefixo)}" sem linha no registro`,
    );
  }
});

test('duas espécies com o mesmo prefixo são recusadas pelo registro', () => {
  const problemas = checkVocabulary({
    ...base(),
    foreignIds: [
      ...base().foreignIds,
      // "block." já nomeia papel de bloco; aqui alguém tenta acomodar outra espécie nele.
      { id: 'block.compact', species: 'medida e faixa de densidade' },
    ],
  });

  assert.ok(problemas.some((problema) => problema.code === 'prefix-claimed-by-two-species'));
});

test('prefixo sem linha no registro é recusado', () => {
  const problemas = checkVocabulary({
    ...base(),
    kinds: [...ENTRADAS, entradaSintetica('widget.clock')],
  });

  assert.deepEqual(
    problemas.map((problema) => problema.code),
    ['prefix-not-registered'],
  );
});

test('id publicado que some do registro é erro, não limpeza', () => {
  const problemas = checkVocabulary({
    ...base(),
    published: [{ kind: 'block.record-ticker', publishedOn: '2026-10-01' }],
  });

  assert.deepEqual(
    problemas.map((problema) => problema.code),
    ['published-kind-missing'],
  );

  // E o id aposentado continua no registro, então ele **não** é problema.
  const comAposentado = checkVocabulary({
    ...base(),
    kinds: [...ENTRADAS, entradaSintetica('block.record-ticker', { status: 'retired' })],
    published: [{ kind: 'block.record-ticker', publishedOn: '2026-10-01' }],
  });
  assert.deepEqual(comAposentado, []);
});

test('forma do id: três segmentos, dígito e variante escrita no nome não passam', () => {
  const malformados = ['block.command.large', 'block.list-2', 'block.Command', 'blockcommand'];
  for (const kind of malformados) {
    const problemas = checkVocabulary({ ...base(), kinds: [...ENTRADAS, entradaSintetica(kind)] });
    assert.deepEqual(
      problemas.map((problema) => problema.code),
      ['id-malformed'],
      kind,
    );
  }
});

test('eixo, estado e termo de ramo não entram em id de bloco', () => {
  for (const kind of ['block.table-map', 'block.touch-pad', 'block.state-banner', 'block.fuel-gauge']) {
    const problemas = checkVocabulary({ ...base(), kinds: [...ENTRADAS, entradaSintetica(kind)] });
    assert.ok(
      problemas.some((problema) => problema.code === 'id-carries-forbidden-word'),
      kind,
    );
  }
});

test('só block.command ocupa a zona de ação crítica, entre os que o servidor emite', () => {
  const problemas = checkVocabulary({
    ...base(),
    kinds: [...ENTRADAS, entradaSintetica('block.tender-tray', { zones: ['zone.anchor-bottom'] })],
  });

  assert.deepEqual(
    problemas.map((problema) => problema.code),
    ['critical-zone-admits-non-command'],
  );
});

test('isBlockKind é a única porta: id de fora não entra nem por parecer', () => {
  assert.ok(isBlockKind('block.command'));
  for (const quase of ['block.commands', 'block.comand', 'BLOCK.COMMAND', 'command', '', null, 42]) {
    assert.equal(isBlockKind(quase), false, String(quase));
  }
});
