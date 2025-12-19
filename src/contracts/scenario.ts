import { z } from "zod";

// Stage enum for user's current educational stage
export const StageSchema = z.enum(["HIGH_SCHOOL", "COLLEGE", "POST_GRAD"]);
export type Stage = z.infer<typeof StageSchema>;

// College year for current students
export const CollegeYearSchema = z.enum([
  "FRESHMAN",
  "SOPHOMORE",
  "JUNIOR",
  "SENIOR",
]);
export type CollegeYear = z.infer<typeof CollegeYearSchema>;

// Risk tolerance levels
export const RiskToleranceSchema = z.enum(["LOW", "MEDIUM", "HIGH"]);
export type RiskTolerance = z.infer<typeof RiskToleranceSchema>;

// Main scenario input schema
export const ScenarioInputSchema = z.object({
  stage: StageSchema,
  schoolId: z.string().min(1, "School is required"),
  majorId: z.string().min(1, "Major is required"),
  collegeYear: CollegeYearSchema.optional(),
  yearsSinceGrad: z.number().int().min(0).max(5).optional(),
  intendedLocation: z.string().optional(),
  riskTolerance: RiskToleranceSchema.optional(),
  gradSchoolInterest: z.boolean().optional(),
});

export type ScenarioInput = z.infer<typeof ScenarioInputSchema>;

// School type for dropdowns
export const SchoolSchema = z.object({
  id: z.string(),
  unitid: z.string().optional(),
  name: z.string(),
  city: z.string().optional(),
  state: z.string(),
  type: z.enum(["PUBLIC", "PRIVATE", "FOR_PROFIT", "COMMUNITY"]),
  tier: z.enum(["ELITE", "SELECTIVE", "COMPETITIVE", "ACCESSIBLE"]).optional(),
});

export type School = z.infer<typeof SchoolSchema>;

// Major type for dropdowns
export const MajorSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  cipCode: z.string().optional(),
});

export type Major = z.infer<typeof MajorSchema>;

