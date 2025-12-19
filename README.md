# AfterGrad 🎓

**AfterGrad** is a web application that helps students and recent graduates explore post-graduation outcomes, salary distributions, career timelines, and relocation patterns based on their school, major, and personal preferences. The goal is to empower informed decision-making by providing data-driven insights into what happens after graduation.

## Final Goal

AfterGrad will eventually:

- **Take user inputs**: stage (high school/college/post-grad), school, major, year, intended location, risk tolerance, grad school interest
- **Output comprehensive reports**:
  - Matriculation paths (employment, grad school, startups, etc.)
  - Salary distribution (25th, 50th, 75th, 90th percentiles)
  - Relocation patterns by metro and state
  - Top employers and common job titles
  - Future timeline with typical milestones over 1–5 years with probabilities
  - Personalized risk flags and considerations
- **Data sources** (future): College Scorecard, BLS, ACS/Census, LinkedIn aggregates, alumni surveys
- **Advanced features** (future): personalization, bias adjustments, cost-of-living (real-wage) calculations, downside scenarios, authentication, saved profiles, PDF export, payments, admin ingestion jobs

---

## Current Skeleton MVP

This is a **skeleton implementation** with working navigation and stubbed endpoints. All data is mock/placeholder.

### ✅ What's Implemented Now

| Layer | Component | Status |
|-------|-----------|--------|
| **Contracts** | Zod schemas + TypeScript types for `ScenarioInput`, `ReportOutput`, and all sub-types | ✅ Complete |
| **Mock Data** | `schools.json`, `majors.json`, `cohorts.json`, `mockReport.json` | ✅ Complete |
| **Repositories** | `schoolsRepo`, `majorsRepo`, `cohortsRepo` (read from JSON) | ✅ Complete |
| **Services** | `reportService`, `timelineService` | ✅ Complete |
| **Rules** | `timelineFallback`, `riskFlags` | ✅ Complete |
| **API Routes** | `GET /api/schools`, `GET /api/majors`, `POST /api/report` | ✅ Complete |
| **Components** | `ScenarioForm`, `ReportSections`, `Timeline`, `CompareView` | ✅ Complete |
| **Pages** | Landing (`/`), Report (`/report`), Compare (`/compare`) | ✅ Complete |
| **UI** | Basic but functional Tailwind styling with responsive design | ✅ Complete |

### ❌ Not Implemented Yet

- Stripe/payments
- Real data ingestion pipelines
- Web scraping
- Complex statistical modeling
- Full UI polish (charts, maps, animations)
- Authentication / saved profiles
- PDF export
- Database (currently using JSON files)

---

## Project Structure

```
aftergrad/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with nav
│   ├── page.tsx                 # Landing page
│   ├── globals.css              # Global styles
│   ├── report/
│   │   └── page.tsx             # Report view
│   ├── compare/
│   │   └── page.tsx             # Comparison view
│   └── api/
│       ├── schools/route.ts     # GET schools
│       ├── majors/route.ts      # GET majors
│       └── report/route.ts      # POST report
├── src/
│   ├── contracts/               # Zod schemas + TS types
│   │   ├── scenario.ts
│   │   ├── report.ts
│   │   └── index.ts
│   ├── repositories/            # Data access layer
│   │   ├── schoolsRepo.ts
│   │   ├── majorsRepo.ts
│   │   ├── cohortsRepo.ts
│   │   └── index.ts
│   ├── services/                # Business logic
│   │   ├── reportService.ts
│   │   ├── timelineService.ts
│   │   └── index.ts
│   ├── rules/                   # Rule-based generators
│   │   ├── timelineFallback.ts
│   │   ├── riskFlags.ts
│   │   └── index.ts
│   └── components/              # React components
│       ├── ScenarioForm.tsx
│       ├── ReportSections.tsx
│       ├── Timeline.tsx
│       ├── CompareView.tsx
│       └── index.ts
├── data/mock/                   # Mock JSON data
│   ├── schools.json
│   ├── majors.json
│   ├── cohorts.json
│   └── mockReport.json
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Navigate to project directory
cd New-grad

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## API Reference

### GET /api/schools

Returns list of all schools.

**Response:**
```json
{
  "schools": [
    {
      "id": "stanford",
      "name": "Stanford University",
      "type": "PRIVATE",
      "state": "CA",
      "tier": "ELITE"
    }
  ]
}
```

### GET /api/majors

Returns list of all majors and categories.

**Response:**
```json
{
  "majors": [
    {
      "id": "cs",
      "name": "Computer Science",
      "category": "Engineering & Technology",
      "cipCode": "11.0701"
    }
  ],
  "categories": ["Business", "Engineering & Technology", ...]
}
```

### POST /api/report

Generates an outcome report for a given scenario.

**Request Body (ScenarioInput):**
```json
{
  "stage": "COLLEGE",
  "schoolId": "stanford",
  "majorId": "cs",
  "collegeYear": "SENIOR",
  "intendedLocation": "San Francisco Bay Area",
  "riskTolerance": "MEDIUM",
  "gradSchoolInterest": false
}
```

**Response (ReportOutput):** See `src/contracts/report.ts` for full schema.

---

## Next Steps Checklist

### Phase 1: Data Layer
- [ ] Add Prisma + SQLite for local persistence
- [ ] Create database schema matching current contracts
- [ ] Migrate repositories to use Prisma instead of JSON
- [ ] Add seed script for initial data

### Phase 2: Real Data Integration
- [ ] Integrate College Scorecard API for school data
- [ ] Integrate BLS Occupational Outlook data
- [ ] Add ACS/Census data for regional statistics
- [ ] Build ingestion pipelines with scheduled jobs

### Phase 3: Enhanced UI
- [ ] Add charts (salary distribution, path breakdown)
- [ ] Add interactive maps for relocation data
- [ ] Improve timeline visualization
- [ ] Add loading skeletons and animations
- [ ] Mobile optimization

### Phase 4: Personalization
- [ ] Add user authentication (NextAuth)
- [ ] Save/load user scenarios
- [ ] Historical comparison tracking
- [ ] Personalized recommendations

### Phase 5: Advanced Features
- [ ] Cost-of-living adjusted salary calculations
- [ ] Downside scenario modeling
- [ ] PDF report export
- [ ] Comparison export/sharing

### Phase 6: Monetization
- [ ] Stripe integration for premium features
- [ ] Usage-based billing
- [ ] Admin dashboard for data management

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **Data**: JSON files (mock), Prisma + SQLite (planned)

---

## Contributing

This is a skeleton MVP. Contributions are welcome! Please open an issue first to discuss proposed changes.

---

## License

MIT

