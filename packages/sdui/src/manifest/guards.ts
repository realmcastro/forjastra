/**
 * Guardas nomeadas. Todas **retornam**, nenhuma lança (`ui.md` §1).
 *
 * Cada uma responde uma pergunta só, e o nome é a pergunta. Guarda que precisa de comentário
 * para dizer o que aceita está aceitando demais.
 */

import type { ManifestPropValue, ManifestScalar } from './types.js';

/**
 * Chave que, copiada para dentro de um objeto, mexe no protótipo. O manifesto é entrada
 * hostil: props com uma dessas não é prop estranha, é tentativa.
 */
const POISONED_KEYS: readonly string[] = ['__proto__', 'constructor', 'prototype'];

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false;
  if (Array.isArray(value)) return false;
  const proto: unknown = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

/** Ordinal é posição, e posição é contrato: inteiro finito, não negativo. */
export function isOrdinal(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
}

export function isManifestScalar(value: unknown): value is ManifestScalar {
  if (value === null) return true;
  const type = typeof value;
  if (type === 'string' || type === 'boolean') return true;
  return type === 'number' && Number.isFinite(value);
}

export function isManifestPropValue(value: unknown): value is ManifestPropValue {
  if (Array.isArray(value)) return value.every(isManifestScalar);
  return isManifestScalar(value);
}

/**
 * Props são dado escalar (ou lista de escalares). Estrutura aninhada não é prop: é nó filho,
 * e nó filho tem papel, zona e ordinal. Aceitar objeto solto aqui seria abrir um segundo
 * canal de composição, sem vocabulário e sem contrato.
 */
export function isBlockProps(value: unknown): value is Record<string, ManifestPropValue> {
  if (!isPlainObject(value)) return false;
  for (const key of Object.keys(value)) {
    if (POISONED_KEYS.includes(key)) return false;
    if (!isManifestPropValue(value[key])) return false;
  }
  return true;
}

export function isArrayOfUnknown(value: unknown): value is readonly unknown[] {
  return Array.isArray(value);
}
