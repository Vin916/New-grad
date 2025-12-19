import { NextResponse } from "next/server";
import { schoolsRepo } from "@/repositories/schoolsRepo";

/**
 * GET /api/schools
 * Returns list of all schools for dropdown selection.
 */
export async function GET() {
  try {
    const schools = await schoolsRepo.getAll();
    return NextResponse.json({ schools });
  } catch (error) {
    console.error("Error fetching schools:", error);
    return NextResponse.json(
      { error: "Failed to fetch schools" },
      { status: 500 }
    );
  }
}

