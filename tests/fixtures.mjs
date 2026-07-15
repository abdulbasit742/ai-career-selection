export function student(overrides = {}) {
  return {
    id: 'student-1',
    name: 'Student One',
    interests: ['coding', 'artificial intelligence'],
    subjects: ['Mathematics', 'Physics'],
    academicScore: 82,
    budget: 300000,
    location: { city: 'Islamabad', country: 'Pakistan' },
    relocationOk: true,
    goals: ['become a software developer'],
    createdAt: '2026-07-15T00:00:00Z',
    updatedAt: '2026-07-15T00:00:00Z',
    ...overrides,
  };
}

export function source(overrides = {}) {
  return {
    name: 'Official program page',
    url: 'https://example.edu/program',
    verifiedAt: '2026-07-01',
    ...overrides,
  };
}

export function institute(overrides = {}) {
  const id = overrides.id ?? 'inst-1';
  return {
    id,
    name: overrides.name ?? 'Institute One',
    type: 'university',
    location: { city: 'Islamabad', country: 'Pakistan' },
    source: source(),
    programs: [{
      id: `${id}-cs`,
      instituteId: id,
      name: 'BS Computer Science',
      field: 'Computer Science',
      keywords: ['programming', 'algorithms', 'artificial intelligence'],
      careerOutcomes: ['software developer'],
      feesPerYear: 280000,
      minAcademicScore: 70,
      entryRequirements: ['Mathematics', 'Physics'],
    }],
    ...overrides,
  };
}

export function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}
