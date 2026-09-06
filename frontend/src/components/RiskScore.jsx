import { riskStatus } from '../utils/risk';

/**
 * Circular risk gauge — score 0-100 with color-coded ring.
 * Colors derive from the risk band (0-39 LOW · 40-59 MEDIUM · 60-79 HIGH · 80-100 CRITICAL).
 */
export default function RiskScore({ score, size = 150, label, caption }) {
  const s = riskStatus(score);
  const R = 52;
  const stroke = 10;
  const c = 2 * Math.PI * R;
  const clamped = Math.max(0, Math.min(100, score));
  const offset = c * (1 - clamped / 100);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 120 120" width={size} height={size} className="-rotate-90">
          <circle cx="60" cy="60" r={R} fill="none" stroke="#1E2839" strokeWidth={stroke} />
          <circle
            cx="60"
            cy="60"
            r={R}
            fill="none"
            stroke={s.hex}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 900ms cubic-bezier(0.22, 1, 0.36, 1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-white">{score}</span>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-faint">/ 100</span>
        </div>
      </div>
      {label !== undefined ? (
        label
      ) : (
        <span className={`mt-2 text-xs font-bold tracking-wider ${s.text}`}>{s.label}</span>
      )}
      {caption && <span className="mt-1 text-[11px] text-faint">{caption}</span>}
    </div>
  );
}
