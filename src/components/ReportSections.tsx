"use client";

import { ReportOutput } from "@/contracts/report";
import { Timeline } from "./Timeline";

interface ReportSectionsProps {
  report: ReportOutput;
}

export function ReportSections({ report }: ReportSectionsProps) {
  const formatCurrency = (value: number | null): string => {
    if (value === null) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: report.salary.currency,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-8">
      {/* Snapshot Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-6 text-white">
        <h2 className="text-lg font-medium opacity-90 mb-4">Snapshot</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm opacity-75">Top Path</p>
            <p className="text-2xl font-bold">{report.snapshot.topPath}</p>
          </div>
          <div>
            <p className="text-sm opacity-75">Median Salary</p>
            <p className="text-2xl font-bold">
              {formatCurrency(report.snapshot.medianSalary)}
            </p>
          </div>
          <div>
            <p className="text-sm opacity-75">Top Metro</p>
            <p className="text-2xl font-bold">
              {report.snapshot.topMetro ?? "N/A"}
            </p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/20 text-sm opacity-75">
          Based on {report.cohortMeta.sampleSize.toLocaleString()} graduates (
          {report.cohortMeta.gradYearRange})
        </div>
      </section>

      {/* Matriculation Paths */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Matriculation Paths
        </h2>
        <div className="space-y-3">
          {report.paths.map((path) => (
            <div key={path.category} className="flex items-center gap-4">
              <div className="flex-grow">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-slate-700">
                    {path.category}
                  </span>
                  <span className="text-sm text-slate-500">{path.pct}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                    style={{ width: `${path.pct}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Salary Distribution */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Salary Distribution
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "25th %ile", value: report.salary.p25 },
            { label: "Median", value: report.salary.p50 },
            { label: "75th %ile", value: report.salary.p75 },
            { label: "90th %ile", value: report.salary.p90 },
          ].map((item) => (
            <div
              key={item.label}
              className="text-center p-4 bg-slate-50 rounded-xl"
            >
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                {item.label}
              </p>
              <p className="text-xl font-bold text-slate-900">
                {formatCurrency(item.value)}
              </p>
            </div>
          ))}
        </div>
        {report.salary.year && (
          <p className="text-xs text-slate-500 text-center mt-4">
            Data from {report.salary.year}
          </p>
        )}
      </section>

      {/* Relocation */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Relocation Patterns
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Metros */}
          <div>
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              Top Metro Areas
            </h3>
            {report.relocation.metros.length > 0 ? (
              <ul className="space-y-2">
                {report.relocation.metros.slice(0, 5).map((metro) => (
                  <li
                    key={metro.name}
                    className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                  >
                    <span className="text-slate-700">{metro.name}</span>
                    <span className="text-sm font-medium text-primary-600">
                      {metro.pct}%
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 text-sm">No data available</p>
            )}
          </div>

          {/* Top States */}
          <div>
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              Top States
            </h3>
            {report.relocation.states.length > 0 ? (
              <ul className="space-y-2">
                {report.relocation.states.slice(0, 5).map((state) => (
                  <li
                    key={state.name}
                    className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                  >
                    <span className="text-slate-700">{state.name}</span>
                    <span className="text-sm font-medium text-primary-600">
                      {state.pct}%
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 text-sm">No data available</p>
            )}
          </div>
        </div>
      </section>

      {/* Employers & Titles */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Employers & Titles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Employers */}
          <div>
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              Top Employers
            </h3>
            {report.employers.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {report.employers.slice(0, 6).map((emp) => (
                  <span
                    key={emp.name}
                    className="px-3 py-1.5 bg-slate-100 rounded-full text-sm text-slate-700"
                  >
                    {emp.name}{" "}
                    <span className="text-slate-500">({emp.pct}%)</span>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">No data available</p>
            )}
          </div>

          {/* Common Titles */}
          <div>
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              Common Titles
            </h3>
            {report.titles.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {report.titles.slice(0, 5).map((title) => (
                  <span
                    key={title.name}
                    className="px-3 py-1.5 bg-accent-100 rounded-full text-sm text-accent-700"
                  >
                    {title.name}{" "}
                    <span className="text-accent-500">({title.pct}%)</span>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">No data available</p>
            )}
          </div>
        </div>
      </section>

      {/* Future Timeline */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Future Timeline
        </h2>
        <Timeline milestones={report.timeline} />
      </section>

      {/* Risk Flags */}
      {report.riskFlags.length > 0 && (
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Considerations & Risks
          </h2>
          <div className="space-y-3">
            {report.riskFlags.map((flag, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg flex items-start gap-3 ${
                  flag.level === "RISK"
                    ? "bg-red-50 border border-red-200"
                    : flag.level === "WARN"
                    ? "bg-amber-50 border border-amber-200"
                    : "bg-blue-50 border border-blue-200"
                }`}
              >
                <span
                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    flag.level === "RISK"
                      ? "bg-red-500 text-white"
                      : flag.level === "WARN"
                      ? "bg-amber-500 text-white"
                      : "bg-blue-500 text-white"
                  }`}
                >
                  {flag.level === "RISK"
                    ? "!"
                    : flag.level === "WARN"
                    ? "⚠"
                    : "i"}
                </span>
                <p
                  className={`text-sm ${
                    flag.level === "RISK"
                      ? "text-red-800"
                      : flag.level === "WARN"
                      ? "text-amber-800"
                      : "text-blue-800"
                  }`}
                >
                  {flag.message}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

