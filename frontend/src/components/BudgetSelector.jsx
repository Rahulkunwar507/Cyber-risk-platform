import { formatINRCompact } from '../utils/format';

/**
 * Budget selector — segmented presets ₹5L/₹10L/₹15L/₹20L plus a slider.
 * Emits the budget value; no optimizer logic lives here.
 */
export default function BudgetSelector({ value, options, min, max, step = 50000, onChange }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-white">Security Budget</p>
        <p className="text-xl font-bold text-accent">{formatINRCompact(value)}</p>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {options.map((opt) => {
          const active = opt === value;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={`rounded-lg border px-2 py-2 text-sm font-semibold transition-colors ${
                active
                  ? 'border-accent bg-accent/15 text-white'
                  : 'border-line bg-panel text-muted hover:bg-panel2 hover:text-ink'
              }`}
            >
              {formatINRCompact(opt)}
            </button>
          );
        })}
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-5 w-full accent-[#4D7CFE]"
      />
      <div className="mt-1 flex justify-between text-[11px] text-faint">
        <span>{formatINRCompact(min)}</span>
        <span className="font-semibold text-muted">{formatINRCompact(value)}</span>
        <span>{formatINRCompact(max)}</span>
      </div>
    </div>
  );
}
