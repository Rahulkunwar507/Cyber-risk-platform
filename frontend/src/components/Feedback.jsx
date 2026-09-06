import { AlertTriangle, RefreshCw, SearchX } from 'lucide-react';

export function EmptyState({ icon: Icon = SearchX, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-panel2 text-faint">
        <Icon className="h-6 w-6" />
      </span>
      <p className="mt-4 text-sm font-semibold text-ink">{title}</p>
      {message && <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted">{message}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ title = 'Failed to load data', message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-danger/30 bg-danger/10 text-danger">
        <AlertTriangle className="h-6 w-6" />
      </span>
      <p className="mt-4 text-sm font-semibold text-ink">{title}</p>
      {message && <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted">{message}</p>}
      {onRetry && (
        <button className="btn-ghost mt-5" onClick={onRetry}>
          <RefreshCw className="h-4 w-4" /> Retry
        </button>
      )}
    </div>
  );
}
