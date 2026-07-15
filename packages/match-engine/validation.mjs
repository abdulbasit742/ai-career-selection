export const DEFAULT_WEIGHTS = Object.freeze({
  interests: 30,
  subjects: 20,
  goals: 20,
  budget: 15,
  location: 10,
  academics: 5,
});

const LIMITS = Object.freeze({ listItems: 50, textLength: 160, institutes: 10_000, programsPerInstitute: 500 });

export function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function assertPlainObject(value, label) {
  assert(value !== null && typeof value === 'object' && !Array.isArray(value), `${label} must be an object`);
}

function assertString(value, label, { required = true, max = LIMITS.textLength } = {}) {
  if (!required && value === undefined) return;
  assert(typeof value === 'string' && value.trim().length > 0, `${label} must be a non-empty string`);
  assert(value.length <= max, `${label} must be at most ${max} characters`);
}

export function assertNumber(value, label, { min = 0, max = Number.MAX_SAFE_INTEGER, required = false } = {}) {
  if (!required && value === undefined) return;
  assert(Number.isFinite(value), `${label} must be a finite number`);
  assert(value >= min && value <= max, `${label} must be between ${min} and ${max}`);
}

function normalizeList(value, label, { required = false } = {}) {
  if (value === undefined && !required) return [];
  assert(Array.isArray(value), `${label} must be an array`);
  assert(value.length <= LIMITS.listItems, `${label} must have at most ${LIMITS.listItems} items`);
  return value.map((item, index) => {
    assertString(item, `${label}[${index}]`);
    return item.trim();
  });
}

export function validateWeights(weights) {
  assertPlainObject(weights, 'weights');
  const keys = Object.keys(DEFAULT_WEIGHTS);
  assert(Object.keys(weights).every((key) => keys.includes(key)), 'weights contains an unknown component');
  const merged = { ...DEFAULT_WEIGHTS, ...weights };
  for (const key of keys) assertNumber(merged[key], `weights.${key}`, { min: 0, max: 100, required: true });
  const total = Object.values(merged).reduce((sum, value) => sum + value, 0);
  assert(total > 0, 'weights must have a positive total');
  return { weights: merged, total };
}

export function validateStudent(student) {
  assertPlainObject(student, 'student');
  assertString(student.id, 'student.id');
  assertString(student.name, 'student.name');
  const interests = normalizeList(student.interests, 'student.interests', { required: true });
  const subjects = normalizeList(student.subjects, 'student.subjects', { required: true });
  const goals = normalizeList(student.goals, 'student.goals', { required: true });
  assert(interests.length + subjects.length + goals.length > 0, 'student must include at least one interest, subject, or goal');
  assertNumber(student.academicScore, 'student.academicScore', { min: 0, max: 100 });
  assertNumber(student.budget, 'student.budget', { min: 0 });
  if (student.relocationOk !== undefined) assert(typeof student.relocationOk === 'boolean', 'student.relocationOk must be boolean');
  if (student.location !== undefined) {
    assertPlainObject(student.location, 'student.location');
    assertString(student.location.city, 'student.location.city', { required: false });
    assertString(student.location.country, 'student.location.country', { required: false });
  }
  return {
    id: student.id.trim(), name: student.name.trim(), interests, subjects, goals,
    academicScore: student.academicScore, budget: student.budget, relocationOk: student.relocationOk,
    location: student.location ? { city: student.location.city?.trim(), country: student.location.country?.trim() } : undefined,
  };
}

function validateSource(source, label) {
  if (source === undefined) return undefined;
  assertPlainObject(source, label);
  assertString(source.name, `${label}.name`);
  assertString(source.url, `${label}.url`, { required: false, max: 500 });
  if (source.url !== undefined) {
    let parsed;
    try { parsed = new URL(source.url); } catch { throw new TypeError(`${label}.url must be an absolute URL`); }
    assert(['http:', 'https:'].includes(parsed.protocol), `${label}.url must use HTTP or HTTPS`);
    assert(!parsed.username && !parsed.password, `${label}.url must not contain credentials`);
  }
  assertString(source.verifiedAt, `${label}.verifiedAt`, { required: false });
  if (source.verifiedAt !== undefined) assert(!Number.isNaN(Date.parse(source.verifiedAt)), `${label}.verifiedAt must be an ISO date`);
  if (source.synthetic !== undefined) assert(typeof source.synthetic === 'boolean', `${label}.synthetic must be boolean`);
  return { ...source };
}

export function validateInstitutes(institutes) {
  assert(Array.isArray(institutes), 'institutes must be an array');
  assert(institutes.length > 0, 'institutes must not be empty');
  assert(institutes.length <= LIMITS.institutes, `institutes must have at most ${LIMITS.institutes} items`);
  const instituteIds = new Set();
  const programIds = new Set();
  return institutes.map((institute, instituteIndex) => {
    const base = `institutes[${instituteIndex}]`;
    assertPlainObject(institute, base);
    assertString(institute.id, `${base}.id`);
    assert(!instituteIds.has(institute.id), `duplicate institute id: ${institute.id}`);
    instituteIds.add(institute.id);
    assertString(institute.name, `${base}.name`);
    assert(['university', 'college', 'institute'].includes(institute.type), `${base}.type is invalid`);
    assertPlainObject(institute.location, `${base}.location`);
    assertString(institute.location.city, `${base}.location.city`, { required: false });
    assertString(institute.location.country, `${base}.location.country`, { required: false });
    assert(Array.isArray(institute.programs) && institute.programs.length > 0, `${base}.programs must be a non-empty array`);
    assert(institute.programs.length <= LIMITS.programsPerInstitute, `${base}.programs has too many items`);
    const instituteSource = validateSource(institute.source, `${base}.source`);
    const programs = institute.programs.map((program, programIndex) => {
      const label = `${base}.programs[${programIndex}]`;
      assertPlainObject(program, label);
      assertString(program.id, `${label}.id`);
      assert(!programIds.has(program.id), `duplicate program id: ${program.id}`);
      programIds.add(program.id);
      assertString(program.instituteId, `${label}.instituteId`);
      assert(program.instituteId === institute.id, `${label}.instituteId must match parent institute id`);
      assertString(program.name, `${label}.name`);
      assertString(program.field, `${label}.field`);
      assertNumber(program.feesPerYear, `${label}.feesPerYear`, { min: 0 });
      assertNumber(program.durationYears, `${label}.durationYears`, { min: 0.25, max: 20 });
      assertNumber(program.minAcademicScore, `${label}.minAcademicScore`, { min: 0, max: 100 });
      return {
        ...program,
        keywords: normalizeList(program.keywords, `${label}.keywords`),
        careerOutcomes: normalizeList(program.careerOutcomes, `${label}.careerOutcomes`),
        entryRequirements: normalizeList(program.entryRequirements, `${label}.entryRequirements`),
        source: validateSource(program.source, `${label}.source`) ?? instituteSource,
      };
    });
    return { ...institute, location: { ...institute.location }, source: instituteSource, programs };
  });
}
