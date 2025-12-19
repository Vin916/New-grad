import { Milestone, Cohort } from "@/contracts/report";
import { ScenarioInput } from "@/contracts/scenario";

/**
 * Default milestone templates for different stages
 */
const HIGH_SCHOOL_MILESTONES: Omit<Milestone, "pct">[] = [
  {
    milestoneType: "COLLEGE_APPS",
    startMonth: -12,
    endMonth: -6,
    label: "College Applications",
    details: "Submit applications to target schools",
  },
  {
    milestoneType: "DECISIONS",
    startMonth: -4,
    endMonth: -2,
    label: "Receive Decisions",
    details: "Hear back from colleges and make final choice",
  },
  {
    milestoneType: "GRADUATION",
    startMonth: 0,
    endMonth: 0,
    label: "High School Graduation",
    details: "Complete high school",
  },
  {
    milestoneType: "COLLEGE_START",
    startMonth: 3,
    endMonth: 4,
    label: "Start College",
    details: "Begin freshman year at chosen university",
  },
];

const COLLEGE_MILESTONES: Omit<Milestone, "pct">[] = [
  {
    milestoneType: "JOB_SEARCH_START",
    startMonth: -6,
    endMonth: -3,
    label: "Begin Job Search",
    details: "Start applying for internships and full-time roles",
  },
  {
    milestoneType: "FIRST_OFFER",
    startMonth: -4,
    endMonth: 0,
    label: "Receive First Offer",
    details: "Receive offer(s) from target companies",
  },
  {
    milestoneType: "GRADUATION",
    startMonth: 0,
    endMonth: 0,
    label: "College Graduation",
    details: "Complete undergraduate degree",
  },
  {
    milestoneType: "START_EMPLOYMENT",
    startMonth: 0,
    endMonth: 3,
    label: "Start Full-time Role",
    details: "Begin first full-time position",
  },
  {
    milestoneType: "FIRST_PROMOTION",
    startMonth: 12,
    endMonth: 24,
    label: "First Promotion",
    details: "Receive title change or level bump",
  },
  {
    milestoneType: "FIRST_JOB_CHANGE",
    startMonth: 18,
    endMonth: 36,
    label: "First Job Change",
    details: "Move to new role or company for growth",
  },
  {
    milestoneType: "SENIOR_ROLE",
    startMonth: 36,
    endMonth: 60,
    label: "Reach Senior Level",
    details: "Achieve senior or staff-level position",
  },
];

const POST_GRAD_MILESTONES: Omit<Milestone, "pct">[] = [
  {
    milestoneType: "NEXT_PROMOTION",
    startMonth: 6,
    endMonth: 18,
    label: "Next Promotion",
    details: "Progress to next level in career",
  },
  {
    milestoneType: "JOB_CHANGE",
    startMonth: 12,
    endMonth: 24,
    label: "Career Move",
    details: "Consider new opportunities for growth",
  },
  {
    milestoneType: "LEADERSHIP",
    startMonth: 24,
    endMonth: 48,
    label: "Leadership Role",
    details: "Move into management or technical leadership",
  },
  {
    milestoneType: "GRAD_SCHOOL",
    startMonth: 24,
    endMonth: 60,
    label: "Graduate School (Optional)",
    details: "Consider MBA or specialized master's degree",
  },
];

/**
 * Default probabilities for milestones by major category
 */
const DEFAULT_PROBS: Record<string, Record<string, number>> = {
  "Engineering & Technology": {
    JOB_SEARCH_START: 85,
    FIRST_OFFER: 78,
    START_EMPLOYMENT: 72,
    FIRST_PROMOTION: 50,
    FIRST_JOB_CHANGE: 60,
    SENIOR_ROLE: 40,
  },
  Business: {
    JOB_SEARCH_START: 80,
    FIRST_OFFER: 70,
    START_EMPLOYMENT: 65,
    FIRST_PROMOTION: 45,
    FIRST_JOB_CHANGE: 55,
    SENIOR_ROLE: 30,
  },
  default: {
    JOB_SEARCH_START: 75,
    FIRST_OFFER: 60,
    START_EMPLOYMENT: 55,
    FIRST_PROMOTION: 40,
    FIRST_JOB_CHANGE: 50,
    SENIOR_ROLE: 25,
    COLLEGE_APPS: 95,
    DECISIONS: 90,
    GRADUATION: 100,
    COLLEGE_START: 85,
    NEXT_PROMOTION: 45,
    JOB_CHANGE: 50,
    LEADERSHIP: 25,
    GRAD_SCHOOL: 20,
  },
};

/**
 * Generate fallback timeline milestones when no cohort-specific data exists.
 * Uses rule-based defaults based on stage and major category.
 */
export function generateFallbackTimeline(
  scenario: ScenarioInput,
  _cohort: Cohort | null,
  majorCategory?: string
): Milestone[] {
  // Select base milestones by stage
  let baseMilestones: Omit<Milestone, "pct">[];

  switch (scenario.stage) {
    case "HIGH_SCHOOL":
      baseMilestones = HIGH_SCHOOL_MILESTONES;
      break;
    case "COLLEGE":
      baseMilestones = COLLEGE_MILESTONES;
      break;
    case "POST_GRAD":
      baseMilestones = POST_GRAD_MILESTONES;
      break;
    default:
      baseMilestones = COLLEGE_MILESTONES;
  }

  // Get probability map for the major category
  const probMap =
    majorCategory && DEFAULT_PROBS[majorCategory]
      ? DEFAULT_PROBS[majorCategory]
      : DEFAULT_PROBS.default;

  // Map milestones with probabilities
  const milestones: Milestone[] = baseMilestones.map((m) => ({
    ...m,
    pct: probMap[m.milestoneType] ?? DEFAULT_PROBS.default[m.milestoneType] ?? 50,
  }));

  // Adjust timeline based on years since grad for POST_GRAD stage
  if (scenario.stage === "POST_GRAD" && scenario.yearsSinceGrad) {
    const offsetMonths = scenario.yearsSinceGrad * 12;
    return milestones.map((m) => ({
      ...m,
      startMonth: m.startMonth - offsetMonths,
      endMonth: m.endMonth - offsetMonths,
    }));
  }

  return milestones;
}

