import { NextResponse } from "next/server";
import { majorsRepo } from "@/repositories/majorsRepo";

/**
 * GET /api/majors
 * Returns list of all majors for dropdown selection.
 */
export async function GET() {
  try {
    const majors = await majorsRepo.getAll();
    const categories = await majorsRepo.getCategories();
    return NextResponse.json({ majors, categories });
  } catch (error) {
    console.error("Error fetching majors:", error);
    return NextResponse.json(
      { error: "Failed to fetch majors" },
      { status: 500 }
    );
  }
}

