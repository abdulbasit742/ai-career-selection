import { readFile } from 'node:fs/promises';
import { matchStudent } from '../packages/match-engine/index.mjs';

const institutes = JSON.parse(await readFile(new URL('../data/sample-institutes.json', import.meta.url), 'utf8'));
const student = {
  id: 'demo-student',
  name: 'Demo Student',
  interests: ['coding', 'artificial intelligence', 'startups'],
  subjects: ['Mathematics', 'Physics'],
  academicScore: 82,
  budget: 300000,
  location: { city: 'Islamabad', country: 'Pakistan' },
  relocationOk: true,
  goals: ['become a software developer', 'work in AI'],
  createdAt: '2026-07-15T00:00:00Z',
  updatedAt: '2026-07-15T00:00:00Z'
};

console.log(JSON.stringify(matchStudent(student, institutes, { topK: 3, asOf: '2026-07-15' }), null, 2));
