import assert from 'node:assert/strict';
import test from 'node:test';
import { matchStudent } from '../packages/match-engine/index.mjs';
import { institute, student } from './fixtures.mjs';

test('ranks the strongest transparent content match first', () => {
  const tech = institute();
  const health = institute({
    id: 'inst-2',
    name: 'Health College',
    location: { city: 'Lahore', country: 'Pakistan' },
    programs: [{
      id: 'inst-2-health', instituteId: 'inst-2', name: 'BS Public Health', field: 'Public Health',
      keywords: ['biology', 'community', 'medicine'], careerOutcomes: ['health analyst'],
      feesPerYear: 200000, minAcademicScore: 60, entryRequirements: ['Biology'],
    }],
  });
  const result = matchStudent(student(), [health, tech], { asOf: '2026-07-15' });
  assert.equal(result.matches[0].programId, 'inst-1-cs');
  assert.ok(result.matches[0].fitScore > result.matches[1].fitScore);
  assert.ok(result.matches[0].reasons.some((reason) => reason.startsWith('Interest overlap')));
});

test('treats academic threshold as an eligibility gate', () => {
  const result = matchStudent(student({ academicScore: 68 }), [institute()], { asOf: '2026-07-15' });
  assert.equal(result.matches.length, 0);
  assert.deepEqual(result.excluded, [{
    instituteId: 'inst-1', programId: 'inst-1-cs',
    reason: 'Academic score is below the stated minimum.', requiredScore: 70,
  }]);
});

test('can show ineligible programs without presenting them as eligible', () => {
  const result = matchStudent(student({ academicScore: 50 }), [institute()], { includeIneligible: true });
  assert.equal(result.matches[0].eligible, false);
  assert.equal(result.matches[0].eligibilityStatus, 'below-threshold');
});

test('penalizes fees above the stated budget', () => {
  const affordable = institute({ id: 'affordable' });
  affordable.programs[0].feesPerYear = 250000;
  const expensive = institute({ id: 'expensive' });
  expensive.programs[0].feesPerYear = 600000;
  const result = matchStudent(student(), [expensive, affordable]);
  assert.equal(result.matches[0].instituteId, 'affordable');
  assert.ok(result.matches[0].components.budget.points > result.matches[1].components.budget.points);
});

test('respects a no-relocation preference', () => {
  const local = institute({ id: 'local' });
  const distant = institute({ id: 'distant', location: { city: 'Karachi', country: 'Pakistan' } });
  const result = matchStudent(student({ relocationOk: false }), [distant, local]);
  assert.equal(result.matches[0].instituteId, 'local');
  assert.equal(result.matches[1].components.location.points, 0);
});
