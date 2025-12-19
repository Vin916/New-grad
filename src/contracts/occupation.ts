import { z } from "zod";

// Occupation data from BLS
export const OccupationSchema = z.object({
  code: z.string(),
  title: z.string(),
  medianWage: z.number().nullable(),
  education: z.string(),
  growthPct: z.number().nullable(),
  annualOpenings: z.number().nullable(),
});

export type Occupation = z.infer<typeof OccupationSchema>;

// Detailed salary data from BLS
export const OccupationSalarySchema = z.object({
  code: z.string(),
  title: z.string(),
  totalEmployment: z.number().nullable(),
  p10: z.number().nullable(),
  p25: z.number().nullable(),
  p50: z.number().nullable(),
  p75: z.number().nullable(),
  p90: z.number().nullable(),
});

export type OccupationSalary = z.infer<typeof OccupationSalarySchema>;

