"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ScenarioInput } from "@/contracts/scenario";
import { ReportOutput } from "@/contracts/report";
import { ReportSections } from "@/components/ReportSections";
import { ScenarioForm } from "@/components/ScenarioForm";

export default function ReportPage() {
  const router = useRouter();
  const [scenario, setScenario] = useState<ScenarioInput | null>(null);
  const [report, setReport] = useState<ReportOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  // Load scenario from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("aftergrad_scenario");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setScenario(parsed);
        fetchReport(parsed);
      } catch {
        setError("Invalid scenario data. Please start over.");
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchReport = async (scenarioData: ScenarioInput) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scenarioData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate report");
      }

      const data = await response.json();
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateScenario = (newScenario: ScenarioInput) => {
    localStorage.setItem("aftergrad_scenario", JSON.stringify(newScenario));
    setScenario(newScenario);
    setShowEditForm(false);
    fetchReport(newScenario);
  };

  // No scenario found - show form
  if (!scenario && !loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Generate Your Report
          </h1>
          <p className="text-slate-600">
            Fill out the form below to see your personalized outcomes report.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
          <ScenarioForm />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Your Outcomes Report
          </h1>
          {scenario && (
            <p className="text-slate-600 mt-1">
              Based on your selected school, major, and preferences
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowEditForm(!showEditForm)}
            className="px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            {showEditForm ? "Cancel" : "Edit Inputs"}
          </button>
          <button
            onClick={() => router.push("/compare")}
            className="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Compare →
          </button>
        </div>
      </div>

      {/* Edit Form (collapsible) */}
      {showEditForm && scenario && (
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border border-slate-200 animate-fade-in">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Update Your Inputs
          </h2>
          <ScenarioForm
            initialData={scenario}
            onSubmit={handleUpdateScenario}
            mode="callback"
          />
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mb-4" />
          <p className="text-slate-600">Generating your report...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-800 font-medium mb-2">
            Something went wrong
          </p>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <button
            onClick={() => scenario && fetchReport(scenario)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Report Sections */}
      {report && !loading && !error && (
        <div className="animate-fade-in">
          <ReportSections report={report} />
        </div>
      )}
    </div>
  );
}

