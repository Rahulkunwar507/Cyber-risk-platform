import { riskStatus } from '../utils/risk';

export default function RiskBadge({ score }) {
  const s = riskStatus(score);
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border ${s.border} ${s.bg} px-2 py-0.5 text-xs font-semibold ${s.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {score} {s.label}
    </span>
  );
}
