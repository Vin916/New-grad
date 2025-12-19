import { RiskFlag, Cohort } from "@/contracts/report";
import { ScenarioInput } from "@/contracts/scenario";

/**
 * Risk flag thresholds and messages
 */
const HIGH_COL_METROS = [
  "San Francisco Bay Area",
  "New York City",
  "Seattle",
  "Boston",
  "Los Angeles",
];

const VOLATILE_INDUSTRIES = [
  "Technology",
  "Startups",
  "Media",
  "Entertainment",
];

/**
 * Generate risk flags based on scenario and cohort data.
 * These flags help users understand potential risks and considerations.
 */
export function generateRiskFlags(
  scenario: ScenarioInput,
  cohort: Cohort | null
): RiskFlag[] {
  const flags: RiskFlag[] = [];

  // Check location-based risks
  if (scenario.intendedLocation) {
    const isHighCOL = HIGH_COL_METROS.some(
      (metro) =>
        scenario.intendedLocation?.toLowerCase().includes(metro.toLowerCase())
    );

    if (isHighCOL) {
      flags.push({
        level: "INFO",
        message: `${scenario.intendedLocation} has high cost of living - consider real wage vs nominal salary`,
      });
    }
  }

  // Check salary data availability
  if (cohort && cohort.salary.p50 === null) {
    flags.push({
      level: "WARN",
      message:
        "Limited salary data available for this combination - estimates may be less accurate",
    });
  }

  // Check sample size
  if (cohort && cohort.sampleSize < 100) {
    flags.push({
      level: "WARN",
      message: `Small sample size (${cohort.sampleSize}) - results may not be representative`,
    });
  }

  // Check for high-risk tolerance with low sample data
  if (scenario.riskTolerance === "HIGH" && cohort && cohort.sampleSize < 500) {
    flags.push({
      level: "INFO",
      message:
        "High risk tolerance noted - consider that outcomes have wider variance",
    });
  }

  // Grad school interest considerations
  if (scenario.gradSchoolInterest) {
    flags.push({
      level: "INFO",
      message:
        "Graduate school can delay earnings but increase long-term potential - ROI varies by field",
    });
  }

  // Stage-specific flags
  if (scenario.stage === "HIGH_SCHOOL") {
    flags.push({
      level: "INFO",
      message:
        "Early planning is valuable - outcomes will depend heavily on college choice and major",
    });
  }

  if (scenario.stage === "POST_GRAD" && scenario.yearsSinceGrad === 0) {
    flags.push({
      level: "INFO",
      message:
        "Recent graduates may see significant variation in first-year outcomes",
    });
  }

  // Industry-specific flags (based on top employers in cohort)
  if (cohort && cohort.employers && cohort.employers.length > 0) {
    const hasVolatileIndustry = cohort.employers.some((e) =>
      VOLATILE_INDUSTRIES.some((v) =>
        e.name.toLowerCase().includes(v.toLowerCase())
      )
    );

    if (hasVolatileIndustry) {
      flags.push({
        level: "INFO",
        message:
          "Tech industry has cyclical hiring patterns - timing matters for job search",
      });
    }
  }

  // Salary negotiation flag for high-paying fields
  if (cohort && cohort.salary.p90 && cohort.salary.p25) {
    const variance = cohort.salary.p90 - cohort.salary.p25;
    if (variance > 100000) {
      flags.push({
        level: "WARN",
        message:
          "Starting salary varies significantly by company tier and negotiation",
      });
    }
  }

  // Location mismatch warning
  if (scenario.intendedLocation && cohort && cohort.relocation && cohort.relocation.metros.length > 0) {
    const topMetro = cohort.relocation.metros[0].name.toLowerCase();
    const intended = scenario.intendedLocation.toLowerCase();
    const matchesTop = topMetro.includes(intended) || intended.includes(topMetro);
    
    if (!matchesTop) {
      flags.push({
        level: "INFO",
        message: `Most graduates relocate to ${cohort.relocation.metros[0].name} - your intended location may have fewer opportunities in this field`,
      });
    }
  }

  return flags;
}

