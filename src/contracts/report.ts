import { z } from "zod";
import { ScenarioInputSchema } from "./scenario";

// Cohort metadata
export const CohortMetaSchema = z.object({
  gradYearRange: z.string(),
  sampleSize: z.number().int().nonnegative(),
});

export type CohortMeta = z.infer<typeof CohortMetaSchema>;

// Snapshot summary
export const SnapshotSchema = z.object({
  topPath: z.string(),
  medianSalary: z.number().nullable(),
  topMetro: z.string().nullable(),
});

export type Snapshot = z.infer<typeof SnapshotSchema>;

// Matriculation path distribution
export const PathSchema = z.object({
  category: z.string(),
  pct: z.number().min(0).max(100),
});

export type Path = z.infer<typeof PathSchema>;

// Salary distribution
export const SalaryDistributionSchema = z.object({
  p25: z.number().nullable(),
  p50: z.number().nullable(),
  p75: z.number().nullable(),
  p90: z.number().nullable(),
  currency: z.string().default("USD"),
  year: z.number().nullable(),
});

export type SalaryDistribution = z.infer<typeof SalaryDistributionSchema>;

// Metro/State distribution for relocation
export const LocationDistSchema = z.object({
  name: z.string(),
  pct: z.number().min(0).max(100),
});

export type LocationDist = z.infer<typeof LocationDistSchema>;

// Relocation data
export const RelocationSchema = z.object({
  metros: z.array(LocationDistSchema),
  states: z.array(LocationDistSchema),
});

export type Relocation = z.infer<typeof RelocationSchema>;

// Employer distribution
export const EmployerSchema = z.object({
  name: z.string(),
  pct: z.number().min(0).max(100),
});

export type Employer = z.infer<typeof EmployerSchema>;

// Title distribution
export const TitleSchema = z.object({
  name: z.string(),
  pct: z.number().min(0).max(100),
});

export type Title = z.infer<typeof TitleSchema>;

// Timeline milestone
export const MilestoneSchema = z.object({
  milestoneType: z.string(),
  startMonth: z.number().int().min(0),
  endMonth: z.number().int().min(0),
  pct: z.number().min(0).max(100),
  label: z.string(),
  details: z.string().optional(),
});

export type Milestone = z.infer<typeof MilestoneSchema>;

// Risk flag levels
export const RiskLevelSchema = z.enum(["INFO", "WARN", "RISK"]);
export type RiskLevel = z.infer<typeof RiskLevelSchema>;

// Risk flag
export const RiskFlagSchema = z.object({
  level: RiskLevelSchema,
  message: z.string(),
});

export type RiskFlag = z.infer<typeof RiskFlagSchema>;

// Complete report output schema
export const ReportOutputSchema = z.object({
  scenario: ScenarioInputSchema,
  cohortMeta: CohortMetaSchema,
  snapshot: SnapshotSchema,
  paths: z.array(PathSchema),
  salary: SalaryDistributionSchema,
  relocation: RelocationSchema,
  employers: z.array(EmployerSchema),
  titles: z.array(TitleSchema),
  timeline: z.array(MilestoneSchema),
  riskFlags: z.array(RiskFlagSchema),
});

export type ReportOutput = z.infer<typeof ReportOutputSchema>;

// Cohort data structure (for repository)
export const CohortSchema = z.object({
  id: z.string(),
  schoolId: z.string(),
  majorId: z.string(),
  gradYearRange: z.string(),
  sampleSize: z.number(),
  paths: z.array(PathSchema).optional(),
  salary: SalaryDistributionSchema,
  relocation: RelocationSchema.optional(),
  employers: z.array(EmployerSchema).optional(),
  titles: z.array(TitleSchema).optional(),
});

export type Cohort = z.infer<typeof CohortSchema>;

