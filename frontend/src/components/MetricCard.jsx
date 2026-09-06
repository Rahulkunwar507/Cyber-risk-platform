import { Skeleton } from './Skeleton';

const TONES = {
  accent: 'border-accent/20 bg-accent/10 text-accent',
  danger: 'border-danger/20 bg-danger/10 text-danger',
  orange: 'border-orange/20 bg-orange/10 text-orange',
  warning: 'border-warning/20 bg-warning/10 text-warning',
  success: 'border-success/20 bg-success/10 text-success',
  info: 'border-info/20 bg-info/10 text-info',
};

export default function MetricCard({ label, value, sub, icon: Icon, tone = 'accent', loading }) {
  if (loading) {
    return (
      <div className="card p-5">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-4 h-8 w-24" />
        <Skeleton className="mt-3 h-3.5 w-32" />
      </div>
    );
  }
  return (
    <div className="card card-hover p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-muted">{label}</p>
          <p className="mt-2 truncate text-[26px] font-bold leading-tight tracking-tight text-white">{value}</p>
          {sub && <div className="mt-1.5 text-xs text-faint">{sub}</div>}
        </div>
        {Icon && (
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${TONES[tone] || TONES.accent}`}>
            <Icon className="h-5 w-5" />
          </span>
        )}
      </div>
    </div>
  );
}
