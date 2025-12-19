import { ReportOutput, Snapshot, CohortMeta, Cohort } from "@/contracts/report";
import { ScenarioInput } from "@/contracts/scenario";
import { cohortsRepo } from "@/repositories/cohortsRepo";
import { timelineService } from "./timelineService";
import { generateRiskFlags } from "@/rules/riskFlags";

/**
 * Service for generating outcome reports.
 * Orchestrates data from repositories and rules to build complete reports.
 */
export class ReportService {
  /**
   * Generate a complete outcome report for a given scenario.
   */
  async generateReport(scenario: ScenarioInput): Promise<ReportOutput> {
    // Find matching cohort data
    const cohort = await cohortsRepo.findBySchoolAndMajor(
      scenario.schoolId,
      scenario.majorId
    );

    // Build cohort metadata
    const cohortMeta = this.buildCohortMeta(cohort);

    // Build snapshot summary
    const snapshot = this.buildSnapshot(cohort);

    // Generate timeline
    const timeline = await timelineService.generateTimeline(scenario, cohort);

    // Generate risk flags
    const riskFlags = generateRiskFlags(scenario, cohort);

    // Build complete report
    const report: ReportOutput = {
      scenario,
      cohortMeta,
      snapshot,
      paths: cohort?.paths ?? [{ category: "Data Not Available", pct: 100 }],
      salary: cohort?.salary ?? {
        p25: null,
        p50: null,
        p75: null,
        p90: null,
        currency: "USD",
        year: null,
      },
      relocation: cohort?.relocation ?? { metros: [], states: [] },
      employers: cohort?.employers ?? [],
      titles: cohort?.titles ?? [],
      timeline,
      riskFlags,
    };

    return report;
  }

  /**
   * Build cohort metadata from cohort data
   */
  private buildCohortMeta(cohort: Cohort | null): CohortMeta {
    if (!cohort) {
      return {
        gradYearRange: "No data available",
        sampleSize: 0,
      };
    }

    return {
      gradYearRange: cohort.gradYearRange,
      sampleSize: cohort.sampleSize,
    };
  }

  /**
   * Build snapshot summary from cohort data
   */
  private buildSnapshot(cohort: Cohort | null): Snapshot {
    if (!cohort) {
      return {
        topPath: "Unknown",
        medianSalary: null,
        topMetro: null,
      };
    }

    // Find top path (highest percentage) - use default if no paths data
    const topPath = cohort.paths && cohort.paths.length > 0
      ? cohort.paths.reduce((max, p) => p.pct > max.pct ? p : max).category
      : "Full-time Employment";

    // Find top metro (highest percentage) - use null if no relocation data
    const topMetro =
      cohort.relocation && cohort.relocation.metros.length > 0
        ? cohort.relocation.metros.reduce((max, m) =>
            m.pct > max.pct ? m : max
          ).name
        : null;

    return {
      topPath,
      medianSalary: cohort.salary.p50,
      topMetro,
    };
  }

  /**
   * Compare two scenarios and return both reports.
   * For skeleton, just returns two separate reports.
   */
  async compareScenarios(
    scenario1: ScenarioInput,
    scenario2: ScenarioInput
  ): Promise<{ report1: ReportOutput; report2: ReportOutput }> {
    const [report1, report2] = await Promise.all([
      this.generateReport(scenario1),
      this.generateReport(scenario2),
    ]);

    return { report1, report2 };
  }
}

// Singleton instance for convenience
export const reportService = new ReportService();

