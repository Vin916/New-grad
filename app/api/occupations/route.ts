import { NextResponse } from "next/server";
import { occupationsRepo } from "@/repositories";

/**
 * GET /api/occupations
 * Returns list of occupations with job outlook data.
 * Optional query params: q (search), education, sort (growth|wage)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const education = searchParams.get("education");
  const sort = searchParams.get("sort");

  let occupations;

  if (query) {
    occupations = await occupationsRepo.searchByTitle(query);
  } else if (education) {
    occupations = await occupationsRepo.getByEducation(education);
  } else if (sort === "growth") {
    occupations = await occupationsRepo.getTopGrowing(50);
  } else if (sort === "wage") {
    occupations = await occupationsRepo.getHighestPaying(50);
  } else {
    occupations = await occupationsRepo.getAll();
  }

  return NextResponse.json({
    occupations,
    count: occupations.length,
  });
}

