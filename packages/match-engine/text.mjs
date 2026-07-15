const STOP_WORDS = new Set([
  'a', 'an', 'and', 'at', 'be', 'become', 'for', 'in', 'into', 'of', 'on', 'or',
  'the', 'to', 'with', 'work', 'working', 'study', 'studying', 'career', 'field',
]);

const TOKEN_ALIASES = new Map([
  ['ai', 'artificial-intelligence'],
  ['artificial', 'artificial-intelligence'],
  ['intelligence', 'artificial-intelligence'],
  ['ml', 'machine-learning'],
  ['machine', 'machine-learning'],
  ['learning', 'machine-learning'],
  ['math', 'mathematics'],
  ['maths', 'mathematics'],
  ['coding', 'programming'],
  ['code', 'programming'],
  ['software', 'programming'],
  ['developer', 'programming'],
  ['doctor', 'medicine'],
  ['medical', 'medicine'],
  ['healthcare', 'medicine'],
  ['designing', 'design'],
  ['designer', 'design'],
]);

export function tokens(values) {
  const source = Array.isArray(values) ? values.join(' ') : String(values ?? '');
  const raw = source
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .match(/[a-z0-9]+/g) ?? [];
  return new Set(raw
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token))
    .map((token) => TOKEN_ALIASES.get(token) ?? token));
}

export function overlap(profileTokens, programTokens) {
  if (profileTokens.size === 0) return { ratio: 0.5, matches: [] };
  const matches = [...profileTokens].filter((token) => programTokens.has(token)).sort();
  return { ratio: matches.length / profileTokens.size, matches };
}

export function round(value, places = 1) {
  const factor = 10 ** places;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}
