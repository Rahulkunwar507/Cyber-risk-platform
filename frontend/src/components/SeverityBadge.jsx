import { priorityStyle, severityStyle } from '../utils/risk';

export default function SeverityBadge({ severity }) {
  const s = severityStyle(severity);
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border ${s.border} ${s.bg} px-2 py-0.5 text-xs font-semibold ${s.text}`}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.hex }} />
      {severity}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const p = priorityStyle(priority);
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-md border ${p.border} ${p.bg} px-2 py-0.5 text-xs font-semibold ${p.text}`}>
      {priority}
    </span>
  );
}
