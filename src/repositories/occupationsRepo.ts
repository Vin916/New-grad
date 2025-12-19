import {
  Occupation,
  OccupationSchema,
  OccupationSalary,
  OccupationSalarySchema,
} from "@/contracts/occupation";
import occupationsData from "@data/mock/occupations.json";
import salaryData from "@data/mock/salaryByOccupation.json";

/**
 * Repository for accessing occupation and salary data from BLS.
 */
export class OccupationsRepository {
  private occupations: Occupation[];
  private salaries: Map<string, OccupationSalary>;

  constructor() {
    // Validate and parse mock data on initialization
    this.occupations = occupationsData.map((o) => OccupationSchema.parse(o));

    // Build salary lookup map
    this.salaries = new Map();
    salaryData.forEach((s) => {
      const parsed = OccupationSalarySchema.parse(s);
      this.salaries.set(parsed.code, parsed);
    });
  }

  /**
   * Get all occupations
   */
  async getAll(): Promise<Occupation[]> {
    return this.occupations;
  }

  /**
   * Get an occupation by code
   */
  async getByCode(code: string): Promise<Occupation | null> {
    return this.occupations.find((o) => o.code === code) ?? null;
  }

  /**
   * Search occupations by title (case-insensitive partial match)
   */
  async searchByTitle(query: string): Promise<Occupation[]> {
    const lowerQuery = query.toLowerCase();
    return this.occupations.filter((o) =>
      o.title.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get occupations by education level
   */
  async getByEducation(education: string): Promise<Occupation[]> {
    const lowerEd = education.toLowerCase();
    return this.occupations.filter((o) =>
      o.education.toLowerCase().includes(lowerEd)
    );
  }

  /**
   * Get top growing occupations
   */
  async getTopGrowing(limit: number = 20): Promise<Occupation[]> {
    return [...this.occupations]
      .filter((o) => o.growthPct !== null)
      .sort((a, b) => (b.growthPct ?? 0) - (a.growthPct ?? 0))
      .slice(0, limit);
  }

  /**
   * Get highest paying occupations
   */
  async getHighestPaying(limit: number = 20): Promise<Occupation[]> {
    return [...this.occupations]
      .filter((o) => o.medianWage !== null)
      .sort((a, b) => (b.medianWage ?? 0) - (a.medianWage ?? 0))
      .slice(0, limit);
  }

  /**
   * Get detailed salary data for an occupation
   */
  async getSalaryByCode(code: string): Promise<OccupationSalary | null> {
    return this.salaries.get(code) ?? null;
  }

  /**
   * Get all salary data
   */
  async getAllSalaries(): Promise<OccupationSalary[]> {
    return Array.from(this.salaries.values());
  }
}

// Singleton instance for convenience
export const occupationsRepo = new OccupationsRepository();

