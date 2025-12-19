import { CompareView } from "@/components/CompareView";

export default function ComparePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Compare Scenarios
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Compare outcomes between different school/major combinations to make
          informed decisions about your future path.
        </p>
      </div>

      {/* Compare View Component */}
      <CompareView />
    </div>
  );
}

