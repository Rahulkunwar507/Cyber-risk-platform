/** Skeleton loaders — shimmer placeholders used across pages. */

export function Skeleton({ className = '' }) {
  return <div className={`skeleton ${className}`} />;
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-3.5 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`card p-5 ${className}`}>
      <Skeleton className="h-4 w-32" />
      <Skeleton className="mt-4 h-7 w-24" />
      <Skeleton className="mt-3 h-3.5 w-40" />
      <Skeleton className="mt-8 h-24 w-full rounded-lg" />
    </div>
  );
}

export function SkeletonRows({ rows = 6, cols = 8 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r} className="border-b border-line/60 last:border-0">
          {Array.from({ length: cols }).map((__, c) => (
            <td key={c} className="td">
              <Skeleton className="h-4 w-full max-w-[150px]" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function SkeletonChart({ className = '' }) {
  return (
    <div className={`card p-5 ${className}`}>
      <Skeleton className="h-4 w-56" />
      <Skeleton className="mt-2 h-3 w-72" />
      <Skeleton className="mt-5 h-52 w-full rounded-lg" />
    </div>
  );
}
