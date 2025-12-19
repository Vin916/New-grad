import { NextRequest, NextResponse } from "next/server";
import { ScenarioInputSchema } from "@/contracts/scenario";
import { reportService } from "@/services/reportService";
import { ZodError } from "zod";

/**
 * POST /api/report
 * Generates an outcome report for the given scenario.
 * 
 * Request body: ScenarioInput
 * Response: ReportOutput
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input with Zod
    const scenario = ScenarioInputSchema.parse(body);

    // Generate report
    const report = await reportService.generateReport(scenario);

    return NextResponse.json(report);
  } catch (error) {
    console.error("Error generating report:", error);

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Invalid input",
          details: error.errors.map((e) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}

