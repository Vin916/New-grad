import { ScenarioForm } from "@/components/ScenarioForm";

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-200/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Hero Text */}
            <div className="space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full text-primary-700 text-sm font-medium">
                <span className="animate-pulse">●</span>
                Skeleton MVP — Real data coming soon
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                What happens{" "}
                <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
                  after
                </span>{" "}
                graduation?
              </h1>

              <p className="text-lg text-slate-600 max-w-xl">
                Explore career outcomes, salary distributions, and your future
                timeline based on your school, major, and goals. Make informed
                decisions about your path forward.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    💰
                  </span>
                  Salary data
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    📍
                  </span>
                  Relocation patterns
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    🎯
                  </span>
                  Career timelines
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="animate-fade-in animation-delay-200">
              <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 p-8 border border-slate-100">
                <h2 className="text-xl font-semibold text-slate-900 mb-6">
                  Get Your Outcomes Report
                </h2>
                <ScenarioForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              What You&apos;ll Discover
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              AfterGrad provides comprehensive insights into post-graduation
              outcomes based on real cohort data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "📊",
                title: "Matriculation Paths",
                description:
                  "See what percentage of graduates enter full-time work, graduate school, startups, or other paths.",
              },
              {
                icon: "💵",
                title: "Salary Distribution",
                description:
                  "Understand the full range of starting salaries from 25th to 90th percentile.",
              },
              {
                icon: "🗺️",
                title: "Relocation Patterns",
                description:
                  "Discover where graduates typically move for their careers, by metro and state.",
              },
              {
                icon: "🏢",
                title: "Top Employers",
                description:
                  "Learn which companies most frequently hire graduates from your school and major.",
              },
              {
                icon: "📈",
                title: "Future Timeline",
                description:
                  "Get a 1-5 year outlook with typical milestones like promotions and job changes.",
              },
              {
                icon: "⚠️",
                title: "Risk Considerations",
                description:
                  "Receive personalized flags about COL, market conditions, and other factors.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <span className="text-4xl mb-4 block">{feature.icon}</span>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Compare Different Scenarios
            </h2>
            <p className="text-primary-100 mb-8 max-w-xl mx-auto">
              Not sure which path to take? Compare outcomes between different
              schools, majors, or career paths side by side.
            </p>
            <a
              href="/compare"
              className="inline-block px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition-colors"
            >
              Compare Scenarios →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

