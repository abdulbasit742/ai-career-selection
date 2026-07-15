import { overlap, round, tokens } from './text.mjs';

function sourceConfidence(source, warnings, asOf) {
  if (!source) {
    warnings.push('Program data has no source metadata.');
    return 0.2;
  }
  let score = 0.5;
  if (source.url) score += 0.2;
  if (source.verifiedAt) score += 0.3;
  else warnings.push('Program data has no verification date.');
  if (asOf && source.verifiedAt) {
    const ageDays = (asOf.getTime() - new Date(source.verifiedAt).getTime()) / 86_400_000;
    if (ageDays > 365) {
      score = Math.max(0.2, score - 0.35);
      warnings.push(`Program data was last verified ${Math.floor(ageDays)} days before the assessment date.`);
    }
  }
  if (source.synthetic) {
    score = Math.min(score, 0.5);
    warnings.push('This is synthetic demonstration data, not an admissions listing.');
  }
  return Math.min(1, score);
}

function dataConfidence(student, institute, program, warnings, asOf) {
  const profileSignals = [
    student.interests.length > 0,
    student.subjects.length > 0,
    student.goals.length > 0,
    student.academicScore !== undefined,
    student.budget !== undefined,
    Boolean(student.location?.city || student.location?.country),
  ];
  const programSignals = [
    Boolean(program.field),
    program.keywords.length > 0 || program.careerOutcomes.length > 0,
    program.feesPerYear !== undefined,
    program.minAcademicScore !== undefined,
    Boolean(institute.location?.city || institute.location?.country),
  ];
  const profileCompleteness = profileSignals.filter(Boolean).length / profileSignals.length;
  const programCompleteness = programSignals.filter(Boolean).length / programSignals.length;
  const provenance = sourceConfidence(program.source ?? institute.source, warnings, asOf);
  return round((profileCompleteness * 0.45 + programCompleteness * 0.35 + provenance * 0.2) * 100);
}

function budgetComponent(student, program, warnings) {
  if (student.budget === undefined) {
    warnings.push('No student budget was provided.');
    return 0.5;
  }
  if (program.feesPerYear === undefined) {
    warnings.push('Program fee data is unavailable.');
    return 0.5;
  }
  if (program.feesPerYear === 0 || program.feesPerYear <= student.budget) return 1;
  return Math.max(0, Math.min(1, student.budget / program.feesPerYear));
}

function locationComponent(student, institute, warnings) {
  const preferredCity = student.location?.city?.toLowerCase();
  const preferredCountry = student.location?.country?.toLowerCase();
  const instituteCity = institute.location?.city?.toLowerCase();
  const instituteCountry = institute.location?.country?.toLowerCase();
  if (!preferredCity && !preferredCountry) {
    warnings.push('No preferred study location was provided.');
    return 0.5;
  }
  if (preferredCity) {
    if (instituteCity === preferredCity) return 1;
    if (student.relocationOk === false) return 0;
    if (preferredCountry && instituteCountry === preferredCountry) {
      if (student.relocationOk === true) return 0.7;
      warnings.push('Relocation preference is unknown.');
      return 0.5;
    }
    if (student.relocationOk === true) return 0.5;
    warnings.push('Relocation preference is unknown.');
    return 0.3;
  }
  if (preferredCountry && instituteCountry === preferredCountry) return 1;
  if (student.relocationOk === true) return 0.5;
  if (student.relocationOk === false) return 0;
  warnings.push('Relocation preference is unknown.');
  return 0.4;
}

function academicComponent(student, program, warnings) {
  if (student.academicScore === undefined) {
    warnings.push('Academic eligibility could not be verified because the student score is missing.');
    return { eligible: true, ratio: 0.5, status: 'unknown' };
  }
  if (program.minAcademicScore === undefined) {
    warnings.push('Program academic threshold is unavailable.');
    return { eligible: true, ratio: 0.5, status: 'unknown' };
  }
  if (student.academicScore < program.minAcademicScore) {
    return { eligible: false, ratio: 0, status: 'below-threshold' };
  }
  return {
    eligible: true,
    ratio: Math.min(1, 0.7 + (student.academicScore - program.minAcademicScore) / 50),
    status: 'verified',
  };
}

function matchReason(label, matches) {
  return matches.length ? `${label}: ${matches.slice(0, 4).join(', ')}` : null;
}

export function scoreProgram(student, institute, program, weights, weightTotal, asOf) {
  const warnings = [];
  const programTokens = tokens([
    program.name,
    program.field,
    ...program.keywords,
    ...program.careerOutcomes,
    ...program.entryRequirements,
  ]);
  const interest = overlap(tokens(student.interests), programTokens);
  const subjects = overlap(tokens(student.subjects), programTokens);
  const goals = overlap(tokens(student.goals), programTokens);
  const budget = budgetComponent(student, program, warnings);
  const location = locationComponent(student, institute, warnings);
  const academics = academicComponent(student, program, warnings);
  const raw = {
    interests: interest.ratio,
    subjects: subjects.ratio,
    goals: goals.ratio,
    budget,
    location,
    academics: academics.ratio,
  };
  const components = Object.fromEntries(Object.entries(raw).map(([key, ratio]) => [key, {
    ratio: round(ratio, 3),
    points: round((ratio * weights[key] / weightTotal) * 100),
    maxPoints: round((weights[key] / weightTotal) * 100),
  }]));
  const reasons = [
    matchReason('Interest overlap', interest.matches),
    matchReason('Subject overlap', subjects.matches),
    matchReason('Goal overlap', goals.matches),
    budget === 1 && student.budget !== undefined && program.feesPerYear !== undefined
      ? 'Fits the stated yearly budget.' : null,
    location === 1 ? 'Located in the preferred location.' : null,
    academics.status === 'verified' ? 'Meets the stated academic threshold.' : null,
  ].filter(Boolean);
  if (!reasons.length) {
    reasons.push('Limited direct evidence; review the component scores and missing-data warnings.');
  }
  return {
    studentId: student.id,
    instituteId: institute.id,
    instituteName: institute.name,
    programId: program.id,
    programName: program.name,
    field: program.field,
    eligible: academics.eligible,
    eligibilityStatus: academics.status,
    fitScore: round(Object.values(components).reduce((sum, component) => sum + component.points, 0)),
    confidence: dataConfidence(student, institute, program, warnings, asOf),
    components,
    reasons,
    warnings: [...new Set(warnings)],
    source: program.source ?? institute.source ?? null,
  };
}
