"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ScenarioInput,
  Stage,
  CollegeYear,
  RiskTolerance,
  School,
  Major,
} from "@/contracts";
import { SearchableSelect } from "./SearchableSelect";

interface ScenarioFormProps {
  onSubmit?: (scenario: ScenarioInput) => void;
  initialData?: Partial<ScenarioInput>;
  mode?: "navigate" | "callback";
}

export function ScenarioForm({
  onSubmit,
  initialData,
  mode = "navigate",
}: ScenarioFormProps) {
  const router = useRouter();

  // Form state
  const [stage, setStage] = useState<Stage>(initialData?.stage ?? "COLLEGE");
  const [schoolId, setSchoolId] = useState(initialData?.schoolId ?? "");
  const [majorId, setMajorId] = useState(initialData?.majorId ?? "");
  const [collegeYear, setCollegeYear] = useState<CollegeYear | undefined>(
    initialData?.collegeYear
  );
  const [yearsSinceGrad, setYearsSinceGrad] = useState<number | undefined>(
    initialData?.yearsSinceGrad
  );
  const [intendedLocation, setIntendedLocation] = useState(
    initialData?.intendedLocation ?? ""
  );
  const [riskTolerance, setRiskTolerance] = useState<RiskTolerance | undefined>(
    initialData?.riskTolerance
  );
  const [gradSchoolInterest, setGradSchoolInterest] = useState(
    initialData?.gradSchoolInterest ?? false
  );

  // Data for dropdowns
  const [schools, setSchools] = useState<School[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [loading, setLoading] = useState(true);

  // Memoized options for searchable selects
  const schoolOptions = useMemo(
    () =>
      schools.map((school) => ({
        id: school.id,
        label: school.name,
        sublabel: school.city && school.state ? `${school.city}, ${school.state}` : school.state,
      })),
    [schools]
  );

  const majorOptions = useMemo(
    () =>
      majors.map((major) => ({
        id: major.id,
        label: major.name.replace(/\.$/, ""), // Remove trailing period
        sublabel: major.category,
      })),
    [majors]
  );

  // Fetch schools and majors on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const [schoolsRes, majorsRes] = await Promise.all([
          fetch("/api/schools"),
          fetch("/api/majors"),
        ]);

        const schoolsData = await schoolsRes.json();
        const majorsData = await majorsRes.json();

        setSchools(schoolsData.schools || []);
        setMajors(majorsData.majors || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const scenario: ScenarioInput = {
      stage,
      schoolId,
      majorId,
      ...(stage === "COLLEGE" && collegeYear ? { collegeYear } : {}),
      ...(stage === "POST_GRAD" && yearsSinceGrad !== undefined
        ? { yearsSinceGrad }
        : {}),
      ...(intendedLocation ? { intendedLocation } : {}),
      ...(riskTolerance ? { riskTolerance } : {}),
      gradSchoolInterest,
    };

    if (mode === "callback" && onSubmit) {
      onSubmit(scenario);
    } else {
      // Store scenario and navigate to report page
      localStorage.setItem("aftergrad_scenario", JSON.stringify(scenario));
      router.push("/report");
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-slate-200 rounded" />
        <div className="h-10 bg-slate-200 rounded" />
        <div className="h-10 bg-slate-200 rounded" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Stage Selection */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Current Stage
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(["HIGH_SCHOOL", "COLLEGE", "POST_GRAD"] as Stage[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStage(s)}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                stage === s
                  ? "bg-primary-600 text-white shadow-lg shadow-primary-500/30"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {s === "HIGH_SCHOOL"
                ? "High School"
                : s === "COLLEGE"
                ? "College"
                : "Post-Grad"}
            </button>
          ))}
        </div>
      </div>

      {/* School Selection - Searchable */}
      <SearchableSelect
        label="School"
        id="school"
        value={schoolId}
        onChange={setSchoolId}
        placeholder="Search for your school..."
        required
        options={schoolOptions}
      />

      {/* Major Selection - Searchable */}
      <SearchableSelect
        label="Major"
        id="major"
        value={majorId}
        onChange={setMajorId}
        placeholder="Search for your major..."
        required
        options={majorOptions}
      />

      {/* Conditional: College Year */}
      {stage === "COLLEGE" && (
        <div>
          <label
            htmlFor="collegeYear"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            College Year
          </label>
          <select
            id="collegeYear"
            value={collegeYear ?? ""}
            onChange={(e) =>
              setCollegeYear(e.target.value as CollegeYear | undefined)
            }
            className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          >
            <option value="">Select year...</option>
            <option value="FRESHMAN">Freshman</option>
            <option value="SOPHOMORE">Sophomore</option>
            <option value="JUNIOR">Junior</option>
            <option value="SENIOR">Senior</option>
          </select>
        </div>
      )}

      {/* Conditional: Years Since Graduation */}
      {stage === "POST_GRAD" && (
        <div>
          <label
            htmlFor="yearsSinceGrad"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Years Since Graduation
          </label>
          <select
            id="yearsSinceGrad"
            value={yearsSinceGrad ?? ""}
            onChange={(e) =>
              setYearsSinceGrad(
                e.target.value ? parseInt(e.target.value) : undefined
              )
            }
            className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          >
            <option value="">Select...</option>
            {[0, 1, 2, 3, 4, 5].map((y) => (
              <option key={y} value={y}>
                {y === 0 ? "Just graduated" : `${y} year${y > 1 ? "s" : ""}`}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Intended Location */}
      <div>
        <label
          htmlFor="location"
          className="block text-sm font-medium text-slate-700 mb-2"
        >
          Intended Location (Optional)
        </label>
        <input
          id="location"
          type="text"
          value={intendedLocation}
          onChange={(e) => setIntendedLocation(e.target.value)}
          placeholder="e.g., San Francisco Bay Area"
          className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Risk Tolerance */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Risk Tolerance (Optional)
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(["LOW", "MEDIUM", "HIGH"] as RiskTolerance[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() =>
                setRiskTolerance(riskTolerance === r ? undefined : r)
              }
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                riskTolerance === r
                  ? "bg-accent-500 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {r.charAt(0) + r.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Grad School Interest */}
      <div className="flex items-center gap-3">
        <input
          id="gradSchool"
          type="checkbox"
          checked={gradSchoolInterest}
          onChange={(e) => setGradSchoolInterest(e.target.checked)}
          className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
        />
        <label htmlFor="gradSchool" className="text-sm text-slate-700">
          I&apos;m interested in graduate school
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-4 px-6 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all duration-200"
      >
        {mode === "navigate" ? "View My Outcomes →" : "Update"}
      </button>
    </form>
  );
}

