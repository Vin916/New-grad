import { Cohort, CohortSchema } from "@/contracts/report";
import cohortsData from "@data/mock/cohorts.json";

/**
 * Repository for accessing cohort outcome data.
 * Currently reads from mock JSON; will be swapped with database/API calls later.
 */
export class CohortsRepository {
  private cohorts: Cohort[];

  constructor() {
    // Validate and parse mock data on initialization
    this.cohorts = cohortsData.map((c) => CohortSchema.parse(c));
  }

  /**
   * Get all cohorts
   */
  async getAll(): Promise<Cohort[]> {
    return this.cohorts;
  }

  /**
   * Get a cohort by ID
   */
  async getById(id: string): Promise<Cohort | null> {
    return this.cohorts.find((c) => c.id === id) ?? null;
  }

  /**
   * Find cohort by school and major combination
   * Falls back to default cohort if no specific match found
   */
  async findBySchoolAndMajor(
    schoolId: string,
    majorId: string
  ): Promise<Cohort | null> {
    // First try exact match
    const exactMatch = this.cohorts.find(
      (c) => c.schoolId === schoolId && c.majorId === majorId
    );
    if (exactMatch) return exactMatch;

    // Try school-only match (any major at that school)
    const schoolMatch = this.cohorts.find(
      (c) => c.schoolId === schoolId && c.majorId === "default"
    );
    if (schoolMatch) return schoolMatch;

    // Try major-only match (that major at any school)
    const majorMatch = this.cohorts.find(
      (c) => c.schoolId === "default" && c.majorId === majorId
    );
    if (majorMatch) return majorMatch;

    // Fall back to default cohort
    return this.cohorts.find((c) => c.id === "default") ?? null;
  }

  /**
   * Get cohorts by school
   */
  async getBySchool(schoolId: string): Promise<Cohort[]> {
    return this.cohorts.filter((c) => c.schoolId === schoolId);
  }

  /**
   * Get cohorts by major
   */
  async getByMajor(majorId: string): Promise<Cohort[]> {
    return this.cohorts.filter((c) => c.majorId === majorId);
  }
}

// Singleton instance for convenience
export const cohortsRepo = new CohortsRepository();

