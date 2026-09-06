import { NavLink } from 'react-router-dom';
import { BrainCircuit, Bug, LayoutDashboard, Server, ShieldCheck, TrendingUp, X } from 'lucide-react';

const NAV = [
  {
    section: 'Overview',
    items: [{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    section: 'Management',
    items: [
      { to: '/assets', label: 'Assets', icon: Server },
      { to: '/vulnerabilities', label: 'Vulnerabilities', icon: Bug },
    ],
  },
  {
    section: 'Intelligence',
    items: [
      { to: '/ai-advisor', label: 'AI Security Advisor', icon: BrainCircuit },
      { to: '/optimizer', label: 'Investment Optimizer', icon: TrendingUp },
    ],
  },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[264px] flex-col border-r border-line bg-panel transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-[#3b5bdb] text-white">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold tracking-tight text-white">CyberRisk AI</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-faint">Risk Platform</p>
            </div>
          </div>
          <button className="text-faint hover:text-ink lg:hidden" onClick={onClose} aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {NAV.map((section) => (
            <div key={section.section}>
              <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-faint">{section.section}</p>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/dashboard'}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? 'border-accent/25 bg-accent/10 text-white'
                          : 'border-transparent text-muted hover:bg-panel2 hover:text-ink'
                      }`
                    }
                  >
                    <item.icon className="h-[18px] w-[18px]" />
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="shrink-0 border-t border-line p-4">
          <div className="rounded-lg border border-line bg-panel2 p-3">
            <div className="flex items-center gap-2">
              <span className="pulse-dot h-2 w-2 rounded-full bg-success" />
              <p className="text-xs font-semibold text-ink">All Systems Operational</p>
            </div>
            <p className="mt-1 text-[11px] text-faint">3 services monitored · Prototype v1.0.0</p>
          </div>
        </div>
      </aside>
    </>
  );
}
