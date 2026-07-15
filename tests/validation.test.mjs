import assert from 'node:assert/strict';
import test from 'node:test';
import { matchStudent, validateInstitutes, validateStudent } from '../packages/match-engine/index.mjs';
import { deepClone, institute, student } from './fixtures.mjs';

test('rejects invalid profile scores and unbounded topK values', () => {
  assert.throws(() => validateStudent(student({ academicScore: 101 })), /between 0 and 100/);
  assert.throws(() => matchStudent(student(), [institute()], { topK: 101 }), /between 1 and 100/);
});

test('rejects duplicate IDs and incorrect parent references', () => {
  assert.throws(() => validateInstitutes([institute({ id: 'same' }), institute({ id: 'same' })]), /duplicate institute id/);
  const wrong = institute();
  wrong.programs[0].instituteId = 'another';
  assert.throws(() => validateInstitutes([wrong]), /must match parent institute id/);
});

test('does not mutate profile or institute inputs', () => {
  const profile = student();
  const catalog = [institute()];
  const beforeProfile = deepClone(profile);
  const beforeCatalog = deepClone(catalog);
  matchStudent(profile, catalog, { asOf: '2026-07-15' });
  assert.deepEqual(profile, beforeProfile);
  assert.deepEqual(catalog, beforeCatalog);
});

test('sensitive extra attributes do not influence ranking', () => {
  const catalog = [institute()];
  const base = matchStudent(student(), catalog, { asOf: '2026-07-15' });
  const extra = matchStudent(student({ gender: 'female', religion: 'not-used', disability: 'not-used' }), catalog, { asOf: '2026-07-15' });
  assert.deepEqual(extra.matches, base.matches);
});
