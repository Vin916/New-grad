import { School, SchoolSchema } from "@/contracts/scenario";
import schoolsData from "@data/mock/schools.json";

/**
 * Repository for accessing school data.
 * Currently reads from mock JSON; will be swapped with database/API calls later.
 */
export class SchoolsRepository {
  private schools: School[];

  constructor() {
    // Validate and parse mock data on initialization
    this.schools = schoolsData.map((s) => SchoolSchema.parse(s));
  }

  /**
   * Get all schools
   */
  async getAll(): Promise<School[]> {
    return this.schools;
  }

  /**
   * Get a school by ID
   */
  async getById(id: string): Promise<School | null> {
    return this.schools.find((s) => s.id === id) ?? null;
  }

  /**
   * Search schools by name (case-insensitive partial match)
   */
  async searchByName(query: string): Promise<School[]> {
    const lowerQuery = query.toLowerCase();
    return this.schools.filter((s) =>
      s.name.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get schools by state
   */
  async getByState(state: string): Promise<School[]> {
    return this.schools.filter(
      (s) => s.state.toLowerCase() === state.toLowerCase()
    );
  }

  /**
   * Get schools by tier
   */
  async getByTier(
    tier: "ELITE" | "SELECTIVE" | "COMPETITIVE" | "ACCESSIBLE"
  ): Promise<School[]> {
    return this.schools.filter((s) => s.tier === tier);
  }
}

// Singleton instance for convenience
export const schoolsRepo = new SchoolsRepository();

