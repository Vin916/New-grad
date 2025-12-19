import { Milestone, Cohort } from "@/contracts/report";
import { ScenarioInput } from "@/contracts/scenario";
import { generateFallbackTimeline } from "@/rules/timelineFallback";
import { majorsRepo } from "@/repositories/majorsRepo";

/**
 * Service for generating timeline milestones.
 * Currently uses fallback rules; will be enhanced with real cohort data later.
 */
export class TimelineService {
  /**
   * Generate timeline milestones for a given scenario.
   * Uses cohort-specific data when available, falls back to rules-based generation.
   */
  async generateTimeline(
    scenario: ScenarioInput,
    cohort: Cohort | null
  ): Promise<Milestone[]> {
    // TODO: When we have real cohort timeline data, use it here
    // For now, we use the fallback generator with major category for better defaults

    let majorCategory: string | undefined;

    // Get major category for better probability estimates
    const major = await majorsRepo.getById(scenario.majorId);
    if (major) {
      majorCategory = major.category;
    }

    // Generate timeline using fallback rules
    const milestones = generateFallbackTimeline(scenario, cohort, majorCategory);

    // Sort milestones by start month
    return milestones.sort((a, b) => a.startMonth - b.startMonth);
  }

  /**
   * Adjust timeline based on current date and scenario.
   * Makes the timeline relative to the user's actual graduation date.
   */
  adjustTimelineToCurrentDate(
    milestones: Milestone[],
    graduationDate: Date
  ): Milestone[] {
    const now = new Date();
    const monthsUntilGrad =
      (graduationDate.getFullYear() - now.getFullYear()) * 12 +
      (graduationDate.getMonth() - now.getMonth());

    // Adjust all milestones to be relative to current date
    return milestones.map((m) => ({
      ...m,
      startMonth: m.startMonth + monthsUntilGrad,
      endMonth: m.endMonth + monthsUntilGrad,
    }));
  }
}

// Singleton instance for convenience
export const timelineService = new TimelineService();

