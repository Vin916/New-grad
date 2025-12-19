"use client";

import { Milestone } from "@/contracts/report";

interface TimelineProps {
  milestones: Milestone[];
}

export function Timeline({ milestones }: TimelineProps) {
  if (!milestones || milestones.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        No timeline data available
      </div>
    );
  }

  // Group milestones by phase (negative = before grad, 0-12 = first year, etc.)
  const getPhaseLabel = (startMonth: number): string => {
    if (startMonth < 0) return "Before Graduation";
    if (startMonth < 12) return "Year 1";
    if (startMonth < 24) return "Year 2";
    if (startMonth < 36) return "Year 3";
    if (startMonth < 48) return "Year 4";
    return "Year 5+";
  };

  const formatMonthRange = (start: number, end: number): string => {
    const formatMonth = (m: number): string => {
      if (m < 0) return `${Math.abs(m)}mo before`;
      if (m === 0) return "At graduation";
      return `${m}mo after`;
    };

    if (start === end) return formatMonth(start);
    return `${formatMonth(start)} → ${formatMonth(end)}`;
  };

  // Get color based on probability
  const getProbColor = (pct: number): string => {
    if (pct >= 70) return "bg-emerald-500";
    if (pct >= 50) return "bg-amber-500";
    return "bg-slate-400";
  };

  const getProbBg = (pct: number): string => {
    if (pct >= 70) return "bg-emerald-50 border-emerald-200";
    if (pct >= 50) return "bg-amber-50 border-amber-200";
    return "bg-slate-50 border-slate-200";
  };

  return (
    <div className="space-y-4">
      {milestones.map((milestone, idx) => (
        <div
          key={`${milestone.milestoneType}-${idx}`}
          className={`relative p-4 rounded-xl border ${getProbBg(milestone.pct)} transition-all hover:shadow-md`}
        >
          {/* Connection line */}
          {idx < milestones.length - 1 && (
            <div className="absolute left-7 top-full w-0.5 h-4 bg-slate-200" />
          )}

          <div className="flex items-start gap-4">
            {/* Probability indicator */}
            <div className="flex-shrink-0">
              <div
                className={`w-10 h-10 rounded-full ${getProbColor(milestone.pct)} flex items-center justify-center text-white text-xs font-bold`}
              >
                {milestone.pct}%
              </div>
            </div>

            {/* Content */}
            <div className="flex-grow min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h4 className="font-semibold text-slate-900">
                  {milestone.label}
                </h4>
                <span className="text-xs text-slate-500 whitespace-nowrap">
                  {getPhaseLabel(milestone.startMonth)}
                </span>
              </div>

              <p className="text-sm text-slate-600 mb-2">
                {milestone.details}
              </p>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{formatMonthRange(milestone.startMonth, milestone.endMonth)}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

