import { X } from 'lucide-react';

/** Right-side slide-over drawer used for asset & vulnerability details. */
export default function Drawer({ open, onClose, title, eyebrow, actions, children, footer }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="animate-fade-in absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={onClose} />
      <div className="animate-slide-in absolute inset-y-0 right-0 flex w-full max-w-[520px] flex-col border-l border-line bg-panel shadow-2xl">
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div className="min-w-0">
            {eyebrow && <p className="text-[11px] font-semibold uppercase tracking-wider text-faint">{eyebrow}</p>}
            <h2 className="mt-0.5 truncate text-lg font-bold text-white">{title}</h2>
          </div>
          <div className="flex items-center gap-2">
            {actions}
            <button className="rounded-lg border border-line p-2 text-muted transition-colors hover:bg-panel2 hover:text-ink" onClick={onClose} aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer && <div className="shrink-0 border-t border-line px-5 py-4">{footer}</div>}
      </div>
    </div>
  );
}
