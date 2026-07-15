import { scoreProgram } from './components.mjs';
import {
  assert,
  assertNumber,
  DEFAULT_WEIGHTS,
  validateInstitutes,
  validateStudent,
  validateWeights,
} from './validation.mjs';

export function matchStudent(studentInput, institutesInput, options = {}) {
  const student = validateStudent(studentInput);
  const institutes = validateInstitutes(institutesInput);
  const { weights, total } = validateWeights(options.weights ?? DEFAULT_WEIGHTS);
  const topK = options.topK ?? 10;
  assertNumber(topK, 'options.topK', { min: 1, max: 100, required: true });
  assert(Number.isInteger(topK), 'options.topK must be an integer');

  let asOf = null;
  if (options.asOf !== undefined) {
    asOf = new Date(options.asOf);
    assert(!Number.isNaN(asOf.getTime()), 'options.asOf must be a valid ISO date');
  }

  const scored = institutes.flatMap((institute) => institute.programs.map((program) => (
    scoreProgram(student, institute, program, weights, total, asOf)
  )));
  const ordered = scored.sort((a, b) => (
    Number(b.eligible) - Number(a.eligible)
    || b.fitScore - a.fitScore
    || b.confidence - a.confidence
    || a.instituteId.localeCompare(b.instituteId)
    || a.programId.localeCompare(b.programId)
  ));
  const ineligible = ordered.filter((item) => !item.eligible);
  const eligible = ordered.filter((item) => item.eligible);

  return {
    student: { id: student.id, name: student.name },
    matches: (options.includeIneligible ? ordered : eligible).slice(0, topK),
    excluded: options.includeIneligible ? [] : ineligible.map((item) => ({
      instituteId: item.instituteId,
      programId: item.programId,
      reason: 'Academic score is below the stated minimum.',
      requiredScore: institutes
        .find((institute) => institute.id === item.instituteId)
        ?.programs.find((program) => program.id === item.programId)
        ?.minAcademicScore,
    })),
    evaluatedPrograms: scored.length,
    generatedAt: options.asOf ?? null,
    methodology: {
      version: 1,
      deterministic: true,
      weights,
      disclaimer: 'Decision-support output only. Verify fees, eligibility, accreditation, and deadlines with official institute sources before acting.',
    },
  };
}
