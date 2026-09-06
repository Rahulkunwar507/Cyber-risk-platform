import { Link } from 'react-router-dom';
import { ArrowRight, BrainCircuit, Crosshair } from 'lucide-react';

/**
 * Dashboard AI recommendation preview. Renders whatever the API returns
 * under dashboard.aiRecommendation.
 */
export default function RecommendationCard({ recommendation, assetName }) {
  if (!recommendation) return null;
  return (
    <div className="card relative overflow-hidden p-5">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-accent/25 bg-accent/10 text-accent">
          <BrainCircuit className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-semibold text-white">AI Security Recommendation</p>
          <p className="text-[11px] text-faint">Generated from asset risk context · POST /api/ai/recommend</p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-ink">{recommendation.text}</p>
      {recommendation.rationale && (
        <p className="mt-3 flex items-start gap-2 rounded-lg border border-line bg-panel2/70 p-3 text-xs leading-relaxed text-muted">
          <Crosshair className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
          {recommendation.rationale}
        </p>
      )}
      <Link to="/ai-advisor" className="btn-primary mt-4">
        View AI Analysis <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
