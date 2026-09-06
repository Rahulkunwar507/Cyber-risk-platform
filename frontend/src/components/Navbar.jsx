import { useState } from 'react';
import { AlertTriangle, Bell, Building2, Info, LogOut, Menu } from 'lucide-react';
import { getNotifications } from '../services/api';
import { useLoad } from '../hooks/useLoad';
import { useToast } from './Toast';
import { formatTimeAgo } from '../utils/format';

export default function Navbar({ onMenu }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [read, setRead] = useState({});
  const { data: notifications } = useLoad(getNotifications);
  const toast = useToast();

  const unread = (notifications || []).filter((n) => !read[n.id]).length;

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-line bg-base/90 px-4 backdrop-blur sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button className="rounded-lg border border-line p-2 text-muted hover:bg-panel2 hover:text-ink lg:hidden" onClick={onMenu} aria-label="Open menu">
          <Menu className="h-4 w-4" />
        </button>
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Building2 className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">ABC Financial Services</p>
            <p className="hidden text-[11px] text-faint sm:block">Security Operations Center</p>
          </div>
        </div>
        <span className="ml-2 hidden items-center gap-1.5 rounded-full border border-success/25 bg-success/10 px-2.5 py-1 text-xs font-medium text-success md:inline-flex">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-success" />
          All Systems Operational
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            className="relative rounded-lg border border-line p-2 text-muted transition-colors hover:bg-panel2 hover:text-ink"
            onClick={() => setNotifOpen((o) => !o)}
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unread > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[9px] font-bold text-white">
                {unread}
              </span>
            )}
          </button>

          {notifOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
              <div className="animate-fade-up absolute right-0 top-11 z-40 w-[340px] overflow-hidden rounded-xl border border-line bg-panel shadow-2xl">
                <div className="flex items-center justify-between border-b border-line px-4 py-3">
                  <p className="text-sm font-semibold text-white">Notifications</p>
                  <button
                    className="text-xs font-semibold text-accent hover:text-[#6f95ff]"
                    onClick={() => {
                      const all = (notifications || []).reduce((acc, n) => ({ ...acc, [n.id]: true }), {});
                      setRead(all);
                    }}
                  >
                    Mark all as read
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {(notifications || []).length === 0 ? (
                    <p className="px-4 py-8 text-center text-xs text-faint">All caught up.</p>
                  ) : (
                    (notifications || []).map((n) => {
                      const Icon = n.severity === 'Info' ? Info : AlertTriangle;
                      const tone = n.severity === 'Info' ? 'text-info' : 'text-danger';
                      return (
                        <div
                          key={n.id}
                          className="flex items-start gap-3 border-b border-line/60 px-4 py-3 last:border-0 hover:bg-panel2/60"
                        >
                          <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${tone}`} />
                          <div className="min-w-0">
                            <p className="text-[13px] leading-snug text-ink">{n.title}</p>
                            <p className="mt-0.5 text-[11px] text-faint">{formatTimeAgo(n.time)}</p>
                          </div>
                          {!read[n.id] && <span className="mt-1.5 ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 border-l border-line pl-3">
          <div className="hidden items-center gap-2.5 md:flex">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-accent to-[#3b5bdb] text-xs font-bold text-white">
              AS
            </span>
            <div className="leading-tight">
              <p className="text-[13px] font-semibold text-white">Aarav Sharma</p>
              <p className="text-[11px] text-faint">Security Analyst</p>
            </div>
          </div>
          <button
            className="rounded-lg border border-line p-2 text-faint transition-colors hover:bg-panel2 hover:text-danger"
            title="Sign out (disabled in prototype)"
            onClick={() => toast('Sign-out is disabled in the SIH prototype.', 'info')}
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
