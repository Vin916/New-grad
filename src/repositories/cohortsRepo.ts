import { Cohort, CohortSchema } from "@/contracts/report";
import cohortsData from "@data/mock/cohorts.json";
import schoolsData from "@data/mock/schools.json";
import majorsData from "@data/mock/majors.json";

/**
 * Repository for accessing cohort outcome data.
 * Currently reads from mock JSON; will be swapped with database/API calls later.
 */
export class CohortsRepository {
  private cohorts: Cohort[];
  private schoolIdToUnitid: Map<string, string>;
  private majorIdToCipCode: Map<string, string>;

  constructor() {
    // Validate and parse mock data on initialization
    this.cohorts = cohortsData.map((c) => CohortSchema.parse(c));
    
    // Build school ID to unitid mapping
    this.schoolIdToUnitid = new Map();
    for (const school of schoolsData as Array<{ id: string; unitid?: string }>) {
      if (school.unitid) {
        this.schoolIdToUnitid.set(school.id, school.unitid);
      }
    }
    
    // Build major ID to cipCode mapping
    this.majorIdToCipCode = new Map();
    for (const major of majorsData as Array<{ id: string; cipCode?: string }>) {
      if (major.cipCode) {
        this.majorIdToCipCode.set(major.id, major.cipCode);
      }
    }
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
    // Convert school slug ID to unitid for lookup
    const unitid = this.schoolIdToUnitid.get(schoolId) ?? schoolId;
    // Convert major slug ID to cipCode for lookup
    const cipCode = this.majorIdToCipCode.get(majorId) ?? majorId;
    
    // First try exact match with unitid and cipCode
    const exactMatch = this.cohorts.find(
      (c) => c.schoolId === unitid && c.majorId === cipCode
    );
    if (exactMatch) return exactMatch;

    // Try school-only match (any major at that school)
    const schoolMatch = this.cohorts.find(
      (c) => c.schoolId === unitid
    );
    if (schoolMatch) return schoolMatch;

    // Try major-only match (that major at any school)
    const majorMatch = this.cohorts.find(
      (c) => c.majorId === cipCode
    );
    if (majorMatch) return majorMatch;

    // Fall back to first cohort with valid salary data
    return this.cohorts.find((c) => c.salary?.p50 !== null) ?? null;
  }

  /**
   * Get cohorts by school
   */
  async getBySchool(schoolId: string): Promise<Cohort[]> {
    const unitid = this.schoolIdToUnitid.get(schoolId) ?? schoolId;
    return this.cohorts.filter((c) => c.schoolId === unitid);
  }

  /**
   * Get cohorts by major
   */
  async getByMajor(majorId: string): Promise<Cohort[]> {
    // Convert major slug ID to cipCode for lookup
    const cipCode = this.majorIdToCipCode.get(majorId) ?? majorId;
    return this.cohorts.filter((c) => c.majorId === cipCode);
  }
}

// Singleton instance for convenience
export const cohortsRepo = new CohortsRepository();

