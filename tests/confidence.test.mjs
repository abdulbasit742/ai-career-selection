import assert from 'node:assert/strict';
import test from 'node:test';
import { matchStudent } from '../packages/match-engine/index.mjs';
import { institute, source, student } from './fixtures.mjs';

test('missing fee and source data lowers confidence and produces warnings', () => {
  const incomplete = institute({ id: 'incomplete', source: undefined });
  delete incomplete.programs[0].feesPerYear;
  const complete = institute({ id: 'complete' });
  const result = matchStudent(student(), [incomplete, complete], { asOf: '2026-07-15' });
  const incompleteMatch = result.matches.find((item) => item.instituteId === 'incomplete');
  const completeMatch = result.matches.find((item) => item.instituteId === 'complete');
  assert.ok(incompleteMatch.confidence < completeMatch.confidence);
  assert.ok(incompleteMatch.warnings.includes('Program fee data is unavailable.'));
  assert.ok(incompleteMatch.warnings.includes('Program data has no source metadata.'));
});

test('stale provenance lowers confidence without silently changing eligibility', () => {
  const stale = institute({ id: 'stale', source: source({ verifiedAt: '2020-01-01' }) });
  const fresh = institute({ id: 'fresh' });
  const result = matchStudent(student(), [stale, fresh], { asOf: '2026-07-15' });
  const staleMatch = result.matches.find((item) => item.instituteId === 'stale');
  const freshMatch = result.matches.find((item) => item.instituteId === 'fresh');
  assert.equal(staleMatch.eligible, true);
  assert.ok(staleMatch.confidence < freshMatch.confidence);
  assert.ok(staleMatch.warnings.some((warning) => warning.includes('days before')));
});

test('uses deterministic IDs as the final tie breaker', () => {
  const result = matchStudent(student(), [institute({ id: 'b-inst' }), institute({ id: 'a-inst' })]);
  assert.deepEqual(result.matches.map((item) => item.instituteId), ['a-inst', 'b-inst']);
});
