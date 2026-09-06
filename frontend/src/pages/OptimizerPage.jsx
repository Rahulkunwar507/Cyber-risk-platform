import { useEffect, useMemo, useRef, useState } from 'react';
import { BrainCircuit, CheckSquare, Square, Sparkles, Wand2 } from 'lucide-react';
import { getInvestmentOptions } from '../services/api';
import { optimizeInvestment, recommendMix } from '../services/optimizer';
import { getPlan } from '../services/planStore';
import { useLoad } from '../hooks/useLoad';
import PageHeader from '../components/PageHeader';
import InvestmentCard from '../components/InvestmentCard';
import BudgetSelector from '../components/BudgetSelector';
import BeforeAfterRisk from '../components/BeforeAfterRisk';
import { ErrorState } from '../components/Feedback';
import { useToast } from '../components/Toast';
import { budgetOptions, defaultBudget, portfolioBaseRiskNote } from '../data/optimizer';
import { formatINR } from '../utils/format';

const BUDGET_MIN = 500000;
const BUDGET_MAX = 2000000;

export default function OptimizerPage() {
  const toast = useToast();
  const { data: options, loading, error, refetch } = useLoad(getInvestmentOptions);

  const [budget, setBudget] = useState(defaultBudget);
  const [selected, setSelected] = useState([]);
  const [planApplied, setPlanApplied] = useState(false);
  const planAppliedRef = useRef(false);
  const [result, setResult] = useState(null);
  const [computing, setComputing] = useState(false);

  // A) Arrive from the AI Advisor with recommended actions pre-selected.
  // B) If none, pre-select the AI-recommended mix for the default budget.
  useEffect(() => {
    if (!options || planAppliedRef.current) return;
    planAppliedRef.current = true;
    const plan = getPlan();
    if (plan?.optionIds?.length) {
      const validIds = plan.optionIds.filter((id) => options.some((o) => o.id === id));
      setSelected(validIds);
      setPlanApplied(true);
      if (validIds.length) {
        toast(`${validIds.length} recommended action${validIds.length === 1 ? '' : 's'} from the AI Advisor are in your plan.`);
      }
    } else {
      const mix = recommendMix(budget);
      setSelected(mix.selected);
      setPlanApplied(true);
    }
  }, [options]); // eslint-disable-line react-hooks/exhaustive-deps

  const recommendedIds = useMemo(() => (options ? recommendMix(budget).selected : []), [options, budget]);

  const toggle = (id) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const selectedOptions = useMemo(() => (options || []).filter((o) => selected.includes(o.id)), [options, selected]);
  const totalCost = selectedOptions.reduce((s, o) => s + o.cost, 0);

  const handleOptimize = () => {
    if (selected.length === 0) {
      toast('Select at least one investment option before optimizing.', 'info');
      return;
    }
    setComputing(true);
    // Simulate optimizer-engine latency; real backend: POST /api/optimizer/calculate
    setTimeout(() => {
      try {
        const res = optimizeInvestment({ budget, selectedIds: selected });
        setResult(res);
      } catch (e) {
        toast(e.message || 'Optimization failed. Please try again.', 'info');
      } finally {
        setComputing(false);
      }
    }, 700);
  };

  const recommendedNames = useMemo(() => {
    const byId = new Map((options || []).map((o) => [o.id, o]));
    return recommendedIds.map((id) => byId.get(id)).filter(Boolean);
  }, [recommendedIds, options]);

  return (
    <div className="space-y-6">
      <PageHeader title="Cybersecurity Investment Optimizer" subtitle="Allocate a limited security budget to maximize cyber risk reduction." />

      {error ? (
        <div className="card">
          <ErrorState message={error} onRetry={refetch} />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* Investment options */}
          <div className="space-y-4 xl:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-white">Investment Options</h3>
              <div className="flex items-center gap-2">
                <button className="btn-ghost !px-3 !py-1.5 text-xs" onClick={() => setSelected((options || []).map((o) => o.id))}>
                  <CheckSquare className="h-3.5 w-3.5" /> Select all
                </button>
                <button className="btn-ghost !px-3 !py-1.5 text-xs" onClick={() => setSelected([])}>
                  <Square className="h-3.5 w-3.5" /> Clear
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="card space-y-3 p-5">
                      <div className="skeleton h-4 w-2/3" />
                      <div className="skeleton h-3 w-full" />
                      <div className="skeleton h-3 w-5/6" />
                      <div className="mt-3 flex justify-between">
                        <div className="skeleton h-6 w-16" />
                        <div className="skeleton h-6 w-16" />
                      </div>
                    </div>
                  ))
                : options.map((o) => (
                    <InvestmentCard
                      key={o.id}
                      option={o}
                      selected={selected.includes(o.id)}
                      onToggle={toggle}
                      efficiency={(o.riskReduction * 100000) / o.cost}
                    />
                  ))}
            </div>
          </div>

          {/* Control panel */}
          <div className="space-y-4">
            <div className="card space-y-5 p-5">
              <BudgetSelector
                value={budget}
                options={budgetOptions}
                min={BUDGET_MIN}
                max={BUDGET_MAX}
                onChange={setBudget}
              />

              <div className="border-t border-line/70 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Selected initiatives</span>
                  <span className="font-bold text-white">{selected.length}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-muted">Total cost</span>
                  <span className={`font-bold ${totalCost > budget ? 'text-danger' : 'text-white'}`}>{formatINR(totalCost)}</span>
                </div>
                {totalCost > budget && (
                  <p className="mt-2 rounded-md border border-warning/25 bg-warning/10 px-2.5 py-1.5 text-[11px] text-warning">
                    Selection exceeds budget — the engine will fit the mix within ₹{Math.round(budget / 100000)}L.
                  </p>
                )}
              </div>

              <button className="btn-primary w-full !py-2.5" onClick={handleOptimize} disabled={computing || loading}>
                {computing ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Optimizing…
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4" /> Optimize Investment
                  </>
                )}
              </button>
            </div>

            {/* AI recommended mix */}
            <div className="card p-5">
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-4 w-4 text-accent" />
                <p className="text-sm font-semibold text-white">AI Recommended Investment Mix</p>
              </div>
              <p className="mt-1 text-[11px] text-faint">Best-fit mix for {formatINR(budget)} as computed by the optimizer engine</p>
              <ul className="mt-3 space-y-1.5">
                {recommendedNames.map((o) => (
                  <li key={o.id} className="flex items-center gap-2 text-xs text-muted">
                    <Sparkles className="h-3 w-3 shrink-0 text-accent" />
                    <span className="truncate">{o.name}</span>
                    <span className="ml-auto shrink-0 font-mono text-[11px] text-faint">{formatINR(o.cost)}</span>
                  </li>
                ))}
              </ul>
              <button
                className="btn-ghost mt-3 w-full !py-1.5 text-xs"
                onClick={() => setSelected([...recommendedIds])}
              >
                Apply recommended mix
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="card p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-white">Optimization Result</h3>
              <p className="mt-0.5 text-xs text-muted">Projected before/after risk for the selected investment mix</p>
            </div>
            <button className="btn-ghost !px-3 !py-1.5 text-xs" onClick={() => setResult(null)}>
              Dismiss
            </button>
          </div>
          <BeforeAfterRisk
            result={result}
            selectedOptions={selectedOptions.filter((o) => result.selected.includes(o.id))}
          />
        </div>
      )}

      <p className="rounded-lg border border-line/70 bg-panel2/40 px-4 py-3 text-[11px] leading-relaxed text-faint">
        {portfolioBaseRiskNote} — To connect the real engine later, replace{' '}
        <code className="rounded bg-panel px-1.5 py-0.5 font-mono text-[10px] text-accent">optimizeInvestment()</code> in{' '}
        <code className="rounded bg-panel px-1.5 py-0.5 font-mono text-[10px] text-accent">src/services/optimizer.js</code> with a{' '}
        <code className="rounded bg-panel px-1.5 py-0.5 font-mono text-[10px] text-accent">POST /api/optimizer/calculate</code> call. No UI changes needed.
      </p>
    </div>
  );
}
