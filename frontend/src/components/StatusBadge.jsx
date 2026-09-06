import { STATUS_TONES } from '../utils/risk';

const TONES = {
  danger: 'text-danger bg-danger/10 border-danger/30',
  orange: 'text-orange bg-orange/10 border-orange/30',
  warning: 'text-warning bg-warning/10 border-warning/30',
  info: 'text-info bg-info/10 border-info/30',
  success: 'text-success bg-success/10 border-success/30',
  muted: 'text-muted bg-panel2 border-line',
};

const DOTS = {
  danger: 'bg-danger',
  orange: 'bg-orange',
  warning: 'bg-warning',
  info: 'bg-info',
  success: 'bg-success',
  muted: 'bg-faint',
};

export default function StatusBadge({ status }) {
  const tone = STATUS_TONES[status] || 'muted';
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium ${TONES[tone]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${DOTS[tone]}`} />
      {status}
    </span>
  );
}
