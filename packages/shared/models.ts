// packages/shared/models.ts
// Core domain models for AI Career Selection. These are the single source of truth shared by the
// API, the match engine, and the web app. Feature #1 defines the shapes; later features fill in
// behaviour (persistence, matching, UI).

/** A field/discipline, e.g. "Computer Science", "Medicine", "Physics". */
export type Field = string;

/** What the student tells us about themselves. The richer this is, the better the match. */
export interface Student {
  id: string;
  name: string;
  /** Free-text + tags of what they're into, e.g. ["coding", "space", "startups"]. */
  interests: string[];
  /** Subjects they've studied / enjoy, e.g. ["Physics", "Maths", "Biology"]. */
  subjects: string[];
  /** Normalised academic score 0..100 (maps from %, GPA, grades — handled later). */
  academicScore?: number;
  /** Yearly budget the student/family can afford, in PKR (or a currency set later). */
  budget?: number;
  /** Where they are / want to study. */
  location?: { city?: string; country?: string };
  /** Preference for studying near home vs anywhere. */
  relocationOk?: boolean;
  /** Career goals in their own words, e.g. ["become a doctor", "work in AI"]. */
  goals: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Program {
  id: string;
  instituteId: string;
  name: string;            // e.g. "BS Computer Science"
  field: Field;            // e.g. "Computer Science"
  feesPerYear?: number;
  durationYears?: number;
  /** Minimum normalised academic score 0..100 to be eligible. */
  minAcademicScore?: number;
  entryRequirements?: string[];
  applicationDeadline?: string;
}

export interface Institute {
  id: string;
  name: string;
  type: 'university' | 'college' | 'institute';
  location: { city?: string; country?: string };
  /** Lower is better (1 = top). Optional; not every institute is ranked. */
  ranking?: number;
  website?: string;
  programs: Program[];
}

/** A single recommendation: one program at one institute, scored and explained. */
export interface Match {
  studentId: string;
  instituteId: string;
  programId: string;
  /** 0..100 fit score produced by the match engine. */
  score: number;
  /** Human-readable reasons the engine chose this, e.g. "Matches your interest in coding". */
  reasons: string[];
}

/** The ranked result returned to the student. */
export interface Recommendation {
  student: Pick<Student, 'id' | 'name'>;
  matches: Match[]; // sorted by score desc
  generatedAt: string;
}
