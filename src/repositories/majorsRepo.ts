import { Major, MajorSchema } from "@/contracts/scenario";
import majorsData from "@data/mock/majors.json";

/**
 * Repository for accessing major/field of study data.
 * Currently reads from mock JSON; will be swapped with database/API calls later.
 */
export class MajorsRepository {
  private majors: Major[];

  constructor() {
    // Validate and parse mock data on initialization
    this.majors = majorsData.map((m) => MajorSchema.parse(m));
  }

  /**
   * Get all majors
   */
  async getAll(): Promise<Major[]> {
    return this.majors;
  }

  /**
   * Get a major by ID
   */
  async getById(id: string): Promise<Major | null> {
    return this.majors.find((m) => m.id === id) ?? null;
  }

  /**
   * Search majors by name (case-insensitive partial match)
   */
  async searchByName(query: string): Promise<Major[]> {
    const lowerQuery = query.toLowerCase();
    return this.majors.filter((m) =>
      m.name.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get majors by category
   */
  async getByCategory(category: string): Promise<Major[]> {
    const lowerCategory = category.toLowerCase();
    return this.majors.filter(
      (m) => m.category.toLowerCase() === lowerCategory
    );
  }

  /**
   * Get all unique categories
   */
  async getCategories(): Promise<string[]> {
    const categories = new Set(this.majors.map((m) => m.category));
    return Array.from(categories).sort();
  }
}

// Singleton instance for convenience
export const majorsRepo = new MajorsRepository();

