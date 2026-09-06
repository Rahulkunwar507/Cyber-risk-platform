/**
 * ─────────────────────────────────────────────────────────────
 * CYBERSECURITY INVESTMENT OPTIMIZER — mock engine
 *
 * Isolated in the service layer. The optimizer page only calls
 * optimizeInvestment() and recommendMix() — it never computes
 * anything itself. When the optimization-engine team ships the
 * real backend, replace the bodies below with:
 *
 *   export async function optimizeInvestment({ budget, selectedIds }) {
 *     const res = await fetch('/api/optimizer/calculate', {
 *       method: 'POST',
 *       headers: { 'Content-Type': 'application/json' },
 *       body: JSON.stringify({ budget, actions: selectedIds }),
 *     });
 *     return res.json();
 *   }
 *
 * The returned shape stays: { beforeRisk, afterRisk, reduction,
 * budgetUsed, budgetRemaining, utilizationPct, selected }.
 * ─────────────────────────────────────────────────────────────
 */

import { investmentOptions, overlapFactor, portfolioBaseRisk } from '../data/optimizer';

// Asset context weights used to prioritize controls (mock risk model).
// The real engine computes these from its cyber-risk/financial model.
const CRITICALITY_WEIGHTS = { Critical: 1.4, High: 1.2, Medium: 1.0, Low: 0.8 };
const EXPOSURE_WEIGHTS = { 'Internet Exposed': 1.5, Restricted: 1.2, Internal: 1.0 };
// Minimum portfolio efficiency (risk points per ₹1L) — mock stand-in for
// the real engine's portfolio-constraint/frontier logic.
const MIN_EFFICIENCY = 5.5;

/** Efficiency: expected risk-point reduction per lakh invested. */
export function computeEfficiency(option) {
  const crit = CRITICALITY_WEIGHTS[option.assetCriticality] ?? 1.0;
  const exp = EXPOSURE_WEIGHTS[option.assetExposure] ?? 1.0;
  const lakhs = option.cost / 100000;
  return (option.riskReduction * crit * exp) / lakhs;
}

/**
 * Combined portfolio reduction (points).
 * Mock rule: strongest control counts fully; additional controls are
 * discounted by the overlap factor (diminishing returns). The real
 * backend computes this from its risk model.
 */
export function combinedReduction(chosen) {
  if (!chosen.length) return 0;
  const strongest = Math.max(...chosen.map((o) => o.riskReduction));
  if (chosen.length === 1) return strongest;
  const sum = chosen.reduce((s, o) => s + o.riskReduction, 0);
  return Math.round(Math.max(sum * overlapFactor, strongest));
}

/**
 * Optimize a budget across the selected investment options.
 * Returns the projected before/after risk, reduction and budget use.
 */
export function optimizeInvestment({ budget, selectedIds }) {
  const pool = investmentOptions.filter((o) => selectedIds.includes(o.id));
  const ranked = pool
    .map((o) => ({ ...o, efficiency: computeEfficiency(o) }))
    .filter((o) => o.efficiency >= MIN_EFFICIENCY)
    .sort((a, b) => b.efficiency - a.efficiency);

  let used = 0;
  const chosen = [];
  for (const option of ranked) {
    if (used + option.cost <= budget) {
      used += option.cost;
      chosen.push(option);
    }
  }

  const reduction = combinedReduction(chosen);
  const afterRisk = Math.max(0, Math.round(portfolioBaseRisk - reduction));

  return {
    beforeRisk: portfolioBaseRisk,
    afterRisk,
    reduction,
    budgetUsed: used,
    budgetRemaining: Math.max(0, budget - used),
    utilizationPct: budget > 0 ? Math.round(((budget - Math.max(0, budget - used)) / budget) * 100) : 0,
    selected: chosen.map((o) => o.id),
  };
}

/**
 * The AI-recommended investment mix for a budget — the engine's
 * "here is what you should buy" answer (independent of manual tweaks).
 */
export function recommendMix(budget) {
  return optimizeInvestment({ budget, selectedIds: investmentOptions.map((o) => o.id) });
}
