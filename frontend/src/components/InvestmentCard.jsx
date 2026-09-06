import { Check } from 'lucide-react';
import SeverityBadge, { PriorityBadge } from './SeverityBadge';
import { formatINR } from '../utils/format';

/**
 * Reusable investment option card (checkbox, cost, risk reduction,
 * priority, description).
 */
export default function InvestmentCard({ option, selected, onToggle, efficiency }) {
  return (
    <button
      type="button"
      onClick={() => onToggle(option.id)}
      className={`group w-full rounded-xl border p-4 text-left transition-all duration-150 ${
        selected
          ? 'border-accent/60 bg-accent/[0.07] shadow-[0_0_0_1px_rgba(77,124,254,0.35)]'
          : 'border-line bg-panel hover:border-[#2a3a5c] hover:bg-panel2/60'
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
            selected ? 'border-accent bg-accent text-white' : 'border-line bg-panel2 text-transparent'
          }`}
        >
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-white">{option.name}</p>
            <PriorityBadge priority={option.priority} />
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-muted">{option.description}</p>
          <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-line/60 pt-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-faint">Cost</p>
              <p className="text-sm font-bold text-white">{formatINR(option.cost)}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-faint">Est. Risk Reduction</p>
              <p className="text-sm font-bold text-success">−{option.riskReduction} pts</p>
            </div>
            {efficiency != null && (
              <div className="text-right">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-faint">Efficiency</p>
                <p className="text-sm font-bold text-accent">{efficiency.toFixed(1)}/₹1L</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
