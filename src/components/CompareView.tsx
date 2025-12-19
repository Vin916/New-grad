"use client";

import { useState } from "react";
import { ScenarioInput } from "@/contracts/scenario";
import { ReportOutput } from "@/contracts/report";
import { ScenarioForm } from "./ScenarioForm";
import { ReportSections } from "./ReportSections";

export function CompareView() {
  const [scenario1, setScenario1] = useState<ScenarioInput | null>(null);
  const [scenario2, setScenario2] = useState<ScenarioInput | null>(null);
  const [report1, setReport1] = useState<ReportOutput | null>(null);
  const [report2, setReport2] = useState<ReportOutput | null>(null);
  const [loading, setLoading] = useState(false);

  const handleScenario1Submit = async (scenario: ScenarioInput) => {
    setScenario1(scenario);
    await fetchReport(scenario, setReport1);
  };

  const handleScenario2Submit = async (scenario: ScenarioInput) => {
    setScenario2(scenario);
    await fetchReport(scenario, setReport2);
  };

  const fetchReport = async (
    scenario: ScenarioInput,
    setReport: (report: ReportOutput | null) => void
  ) => {
    setLoading(true);
    try {
      const response = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scenario),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch report");
      }

      const data = await response.json();
      setReport(data);
    } catch (error) {
      console.error("Error fetching report:", error);
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Forms Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-bold">
              A
            </span>
            Scenario A
          </h2>
          <ScenarioForm onSubmit={handleScenario1Submit} mode="callback" />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-accent-100 text-accent-600 flex items-center justify-center text-sm font-bold">
              B
            </span>
            Scenario B
          </h2>
          <ScenarioForm onSubmit={handleScenario2Submit} mode="callback" />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent" />
          <p className="mt-2 text-slate-600">Generating comparison...</p>
        </div>
      )}

      {/* Comparison Results */}
      {(report1 || report2) && !loading && (
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-slate-900">Comparison</h2>

          {/* Quick Comparison */}
          {report1 && report2 && (
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-medium opacity-90 mb-6">
                Quick Comparison
              </h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div />
                <div className="font-medium text-primary-300">Scenario A</div>
                <div className="font-medium text-accent-300">Scenario B</div>

                <div className="text-left text-slate-400">Median Salary</div>
                <div className="text-xl font-bold">
                  {report1.snapshot.medianSalary
                    ? `$${report1.snapshot.medianSalary.toLocaleString()}`
                    : "N/A"}
                </div>
                <div className="text-xl font-bold">
                  {report2.snapshot.medianSalary
                    ? `$${report2.snapshot.medianSalary.toLocaleString()}`
                    : "N/A"}
                </div>

                <div className="text-left text-slate-400">Top Path</div>
                <div className="text-sm">{report1.snapshot.topPath}</div>
                <div className="text-sm">{report2.snapshot.topPath}</div>

                <div className="text-left text-slate-400">Top Metro</div>
                <div className="text-sm">
                  {report1.snapshot.topMetro ?? "N/A"}
                </div>
                <div className="text-sm">
                  {report2.snapshot.topMetro ?? "N/A"}
                </div>

                <div className="text-left text-slate-400">Sample Size</div>
                <div className="text-sm">
                  {report1.cohortMeta.sampleSize.toLocaleString()}
                </div>
                <div className="text-sm">
                  {report2.cohortMeta.sampleSize.toLocaleString()}
                </div>
              </div>
            </div>
          )}

          {/* Full Reports Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {report1 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold">
                    A
                  </span>
                  Scenario A Results
                </h3>
                <ReportSections report={report1} />
              </div>
            )}

            {report2 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-accent-100 text-accent-600 flex items-center justify-center text-xs font-bold">
                    B
                  </span>
                  Scenario B Results
                </h3>
                <ReportSections report={report2} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!report1 && !report2 && !loading && (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <div className="text-4xl mb-4">⚖️</div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Compare Two Scenarios
          </h3>
          <p className="text-slate-600 max-w-md mx-auto">
            Fill out both forms above to compare outcomes between different
            school/major combinations, stages, or locations.
          </p>
        </div>
      )}
    </div>
  );
}

