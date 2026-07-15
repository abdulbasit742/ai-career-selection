// Shared domain models for AI Career Selection.

export type Field = string;

export interface Student {
  id: string;
  name: string;
  interests: string[];
  subjects: string[];
  academicScore?: number;
  budget?: number;
  location?: { city?: string; country?: string };
  relocationOk?: boolean;
  goals: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DataSource {
  name: string;
  url?: string;
  verifiedAt?: string;
  /** True only for fixtures that must never be presented as real admissions data. */
  synthetic?: boolean;
}

export interface Program {
  id: string;
  instituteId: string;
  name: string;
  field: Field;
  keywords?: string[];
  careerOutcomes?: string[];
  feesPerYear?: number;
  currency?: string;
  durationYears?: number;
  minAcademicScore?: number;
  entryRequirements?: string[];
  applicationDeadline?: string;
  source?: DataSource;
}

export interface Institute {
  id: string;
  name: string;
  type: 'university' | 'college' | 'institute';
  location: { city?: string; country?: string };
  ranking?: number;
  website?: string;
  source?: DataSource;
  programs: Program[];
}

export interface MatchComponent {
  ratio: number;
  points: number;
  maxPoints: number;
}

export interface Match {
  studentId: string;
  instituteId: string;
  instituteName: string;
  programId: string;
  programName: string;
  field: Field;
  eligible: boolean;
  eligibilityStatus: 'verified' | 'unknown' | 'below-threshold';
  fitScore: number;
  confidence: number;
  components: Record<string, MatchComponent>;
  reasons: string[];
  warnings: string[];
  source: DataSource | null;
}

export interface Recommendation {
  student: Pick<Student, 'id' | 'name'>;
  matches: Match[];
  excluded: Array<{
    instituteId: string;
    programId: string;
    reason: string;
    requiredScore?: number;
  }>;
  evaluatedPrograms: number;
  generatedAt: string | null;
}
