import type { Institute, Match, Student } from '../shared/models.js';

export interface MatchOptions {
  topK?: number;
  includeIneligible?: boolean;
  asOf?: string;
  weights?: Partial<Record<'interests' | 'subjects' | 'goals' | 'budget' | 'location' | 'academics', number>>;
}

export interface MatchResult {
  student: Pick<Student, 'id' | 'name'>;
  matches: Match[];
  excluded: Array<{ instituteId: string; programId: string; reason: string; requiredScore?: number }>;
  evaluatedPrograms: number;
  generatedAt: string | null;
  methodology: {
    version: 1;
    deterministic: true;
    weights: Record<string, number>;
    disclaimer: string;
  };
}

export const DEFAULT_WEIGHTS: Readonly<Record<string, number>>;
export function validateStudent(student: Student): Student;
export function validateInstitutes(institutes: Institute[]): Institute[];
export function matchStudent(student: Student, institutes: Institute[], options?: MatchOptions): MatchResult;
