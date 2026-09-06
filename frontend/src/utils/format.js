/**
 * Number & date formatting helpers (Indian rupee conventions).
 */

/** 1000000 -> "₹10,00,000" (Indian digit grouping) */
export function formatINR(value) {
  if (value == null || Number.isNaN(value)) return '—';
  const s = Math.round(value).toString();
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3);
  const grouped = rest ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3 : last3;
  return '₹' + grouped;
}

/** 1000000 -> "₹10L" (compact lakh notation) */
export function formatINRCompact(value) {
  if (value == null || Number.isNaN(value)) return '—';
  const lakhs = Math.round((value / 100000) * 10) / 10;
  return `₹${lakhs}L`;
}

/** 4250000 -> "₹42.5 Lakhs" (lakh-word notation) */
export function formatINRLakhs(value) {
  if (value == null || Number.isNaN(value)) return '—';
  const lakhs = Math.round((value / 100000) * 10) / 10;
  return `₹${lakhs} Lakhs`;
}

/** ISO date -> "3 Sep 2026" */
export function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** ISO date -> "2h ago" */
export function formatTimeAgo(iso) {
  if (!iso) return '—';
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '—';
  const mins = Math.max(1, Math.round((Date.now() - then) / 60000));
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}
