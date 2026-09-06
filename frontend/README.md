# CyberRisk AI — Frontend

**AI-Powered Continuous Cyber Risk Quantification and Investment Optimization Platform** — SIH 2026 frontend (React).

This repository contains **only the frontend**. Backend, database, risk engine, AI and optimization engines are built by other team members and connect later through REST APIs.

## Architecture

```
React Frontend  →  REST API (src/services)  →  Backend →  Database / AI / Risk Engine / Optimizer
```

Every page consumes data through the service layer (`src/services/api.js`, `src/services/optimizer.js`), which today resolves mock data from `src/data/*` with simulated network latency. Swap the function bodies for real `fetch()` calls — the UI does not change.

### Planned backend contract

| Service function | Backend endpoint (planned) |
| --- | --- |
| `getDashboard()` | `GET /api/dashboard` |
| `getAssets()` / `getAsset(id)` | `GET /api/assets` / `GET /api/assets/:id` |
| `getVulnerabilities()` / `getVulnerability(id)` | `GET /api/vulnerabilities` / `GET /api/vulnerabilities/:id` |
| `getAIRecommendation(assetId)` | `POST /api/ai/recommend` |
| `optimizeInvestment({budget, selectedIds})` | `POST /api/optimizer/calculate` |

Each function carries a commented `fetch()` implementation ready to activate.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm run preview    # serve the production build
```

## Stack

- React 18 + Vite 5
- Tailwind CSS v3 (dark enterprise theme)
- Recharts (risk trend chart)
- lucide-react (icons)
- react-router-dom (HashRouter — works when served statically)

## Project structure

```
src/
├── components/   Sidebar · Navbar · MetricCard · RiskScore · RiskBadge · SeverityBadge ·
│                 AssetTable · VulnerabilityTable · RiskChart · RecommendationCard ·
│                 InvestmentCard · BudgetSelector · BeforeAfterRisk · Drawer · …
├── pages/        Dashboard · Assets · Vulnerabilities · AIAdvisor · Optimizer
├── data/         mockData · vulnerabilities · advisor · optimizer
├── services/     api (data access) · optimizer (mock optimization engine) · planStore
├── hooks/        useLoad (loading/error/refetch)
└── utils/        format · risk (bands, severity/priority styles)
```

## Mock data → real API

1. Replace the bodies of the functions in `src/services/api.js` with real `fetch()` calls.
2. Optionally remove the simulated latency/mock modules.
3. Replace `optimizeInvestment()`/`recommendMix()` in `src/services/optimizer.js` with the backend optimization engine call.
4. The plan hand-off (AI Advisor → Optimizer) currently uses `localStorage` via `planStore`; move it to a backend endpoint when available.

## Demo flow

Dashboard (78 — HIGH) → Customer Database (91 — CRITICAL) → Vulnerability (CVE-2026-1001, CVSS 9.8) → Analyze with AI → Add recommendations → Optimizer (₹10L) → Optimize → Risk 87 → 34 (53-point reduction).

*CVE IDs in mock data are demo identifiers for the prototype, not real CVE entries.*
