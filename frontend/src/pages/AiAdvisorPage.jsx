import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BrainCircuit,
  Bug,
  CheckCircle2,
  Database,
  Flame,
  Globe,
  KeyRound,
  ListChecks,
  Monitor,
  Network,
  Shield,
  ShieldAlert,
  Sparkles,
  Wrench,
} from 'lucide-react';
import { getAIRecommendation, getAssets } from '../services/api';
import { useLoad } from '../hooks/useLoad';
import PageHeader from '../components/PageHeader';
import RiskScore from '../components/RiskScore';
import { PriorityBadge } from '../components/SeverityBadge';
import StatusBadge from '../components/StatusBadge';
import { ErrorState } from '../components/Feedback';
import { SkeletonText } from '../components/Skeleton';
import { useToast } from '../components/Toast';
import { setPlan } from '../services/planStore';
import { formatINR } from '../utils/format';
import { riskStatus } from '../utils/risk';

const WHY_ICONS = { bug: Bug, globe: Globe, shield: Shield, database: Database, flame: Flame, key: KeyRound, monitor: Monitor, network: Network, wrench: Wrench };

const ACTION_ICONS = { wrench: Wrench, network: Network, key: KeyRound, monitor: Monitor, shield: Shield, flame: Flame };

const TONE = {
  Critical: 'border-danger/25 bg-danger/10 text-danger',
  High: 'border-orange/25 bg-orange/10 text-orange',
  Medium: 'border-warning/25 bg-warning/10 text-warning',
  Low: 'border-info/25 bg-info/10 text-info',
};

function InfoRow({ icon: Icon, item }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-line/70 bg-panel2/40 p-3">
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${TONE[item.severity] || TONE.Medium}`}>
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-sm font-semibold text-white">
          {item.label}
          <span className={`text-[10px] font-bold uppercase tracking-wide ${item.severity === 'Critical' ? 'text-danger' : item.severity === 'High' ? 'text-orange' : 'text-warning'}`}>
            {item.severity}
          </span>
        </p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted">{item.detail}</p>
      </div>
    </div>
  );
}

const RISK_REDUCTION_TONE = { High: 'text-success', Medium: 'text-warning', Low: 'text-info' };

export default function AiAdvisorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const preSelectedAssetId = location.state?.assetId || 'asset-cust-db';
  const { data: assets } = useLoad(getAssets);

  const [assetId, setAssetId] = useState(preSelectedAssetId);
  const { data: rec, loading: analyzing, error, refetch } = useLoad(() => getAIRecommendation(assetId), [assetId]);
  const [added, setAdded] = useState(false);

  // Keep the selector in sync when arriving from the asset/vulnerability pages.
  useEffect(() => {
    if (location.state?.assetId) setAssetId(location.state.assetId);
  }, [location.state]);

  useEffect(() => {
    window.history.replaceState({}, '', window.location.pathname + window.location.hash.split('?')[0]);
  }, []);

  const selectedAsset = useMemo(
    () => (assets || []).find((a) => a.id === assetId) || { name: 'Customer Database' },
    [assets, assetId]
  );

  const status = rec ? riskStatus(rec.riskScore) : null;

  const handleAddToPlan = () => {
    if (!rec) return;
    const optionIds = rec.recommendedActions
      .map((a) => a.mappedOptionId)
      .filter(Boolean)
      .filter((id, i, arr) => arr.indexOf(id) === i);
    setPlan({ assetId, source: 'ai-advisor', optionIds });
    setAdded(true);
    toast(`Added ${optionIds.length} recommended action${optionIds.length === 1 ? '' : 's'} to your investment plan.`);
    navigate('/optimizer');
  };

  return (
    <div className="space-y-6">
      <PageHeader title="AI Security Advisor" subtitle="Understand why a risk matters and what action should be prioritized." />

      {/* Asset selector */}
      <div className="card p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Analyze Asset</p>
            <p className="mt-0.5 text-xs text-muted">Select an asset to generate an AI security analysis</p>
          </div>
          <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:w-[560px] lg:grid-cols-3">
            {(assets || []).map((a) => (
              <button
                key={a.id}
                onClick={() => setAssetId(a.id)}
                className={`rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors ${
                  assetId === a.id
                    ? 'border-accent/60 bg-accent/10 text-white'
                    : 'border-line bg-panel text-muted hover:bg-panel2 hover:text-ink'
                }`}
              >
                <span className="block truncate">{a.name}</span>
                <span className={`mt-0.5 block text-[10px] font-semibold ${assetId === a.id ? 'text-accent' : 'text-faint'}`}>
                  {a.riskScore} · {a.status}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {error ? (
        <div className="card">
          <ErrorState message={error} onRetry={refetch} />
        </div>
      ) : analyzing || !rec ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="card p-5 lg:col-span-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <BrainCircuit className="h-4 w-4 text-accent" /> Generating AI analysis…
            </div>
            <SkeletonText lines={5} className="mt-4" />
            <SkeletonText lines={4} className="mt-4" />
          </div>
          <div className="card p-5">
            <SkeletonText lines={6} />
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Risk overview */}
            <div className="card p-5 lg:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Risk Score — {selectedAsset.name}</h3>
                  <p className="mt-0.5 text-xs text-muted">Asset-level cyber risk as scored by the risk engine</p>
                </div>
                <StatusBadge status={selectedAsset.status || 'At Risk'} />
              </div>
              <div className="mt-5 flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
                <RiskScore score={rec.riskScore} size={150} />
                <div className="w-full">
                  <p className="text-xs font-semibold uppercase tracking-wider text-faint">Why Is This Asset Risky?</p>
                  <div className="mt-2.5 space-y-2">
                    {rec.whyRisky.map((item) => (
                      <InfoRow key={item.label + item.detail} icon={WHY_ICONS[item.icon] || ShieldAlert} item={item} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-lg border border-line bg-panel2/40 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-faint">Business Impact</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{rec.businessImpact}</p>
              </div>
            </div>

            {/* AI analysis panel */}
            <div className="card relative overflow-hidden p-5">
              <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-accent/25 bg-accent/10 text-accent">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">AI Analysis</p>
                  <p className="text-[11px] text-faint">POST /api/ai/recommend</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-faint">Recommended Priority</p>
                <div className="mt-1.5">
                  <PriorityBadge priority={rec.analysis.recommendedPriority} />
                </div>
              </div>

              <div className="mt-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-faint">Recommendation</p>
                <p className="mt-1.5 text-sm font-medium leading-relaxed text-white">{rec.analysis.recommendation}</p>
              </div>

              <div className="mt-4 border-t border-line/70 pt-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-faint">Rationale</p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">{rec.analysis.rationale}</p>
              </div>
            </div>
          </div>

          {/* Recommended actions */}
          <div className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-accent" />
                <h3 className="text-sm font-semibold text-white">Recommended Actions</h3>
              </div>
              <span className="text-[11px] text-faint">
                Mapped to optimizer options · total {formatINR(rec.recommendedActions.reduce((s, a) => s + a.cost, 0))}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {rec.recommendedActions.map((a) => {
                const Icon = ACTION_ICONS[a.icon] || Wrench;
                return (
                  <div key={a.title} className="flex items-start gap-3 rounded-lg border border-line/70 bg-panel2/40 p-3.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-accent/25 bg-accent/10 text-accent">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-white">{a.title}</p>
                      <div className="mt-1.5 flex items-center justify-between gap-2">
                        <p className="text-xs text-muted">{formatINR(a.cost)}</p>
                        <p className={`text-xs font-bold ${RISK_REDUCTION_TONE[a.riskReduction] || 'text-muted'}`}>
                          {a.riskReduction} reduction
                        </p>
                      </div>
                      {a.mappedOptionId ? (
                        <p className="mt-1 flex items-center gap-1 text-[10px] font-medium text-success">
                          <CheckCircle2 className="h-3 w-3" /> Included in investment plan
                        </p>
                      ) : (
                        <p className="mt-1 text-[10px] font-medium text-faint">Advisory control — configure separately</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <button className="btn-primary mt-4 w-full" onClick={handleAddToPlan}>
              Add Recommended Actions to Investment Plan <ArrowRight className="h-4 w-4" />
            </button>
            <p className="mt-2 text-center text-[11px] text-faint">
              Passing your selections to the Investment Optimizer for budget allocation.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
