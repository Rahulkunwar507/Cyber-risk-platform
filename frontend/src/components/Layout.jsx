import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);

  // Remount on route change, but keep the page mounted when only a route
  // param (asset/vuln id for the detail drawer) changes — preserves filters
  // and avoids reload flicker while rows are clicked.
  const routeKey = location.pathname.split('/').slice(0, 2).join('/');

  return (
    <div className="flex h-screen overflow-hidden bg-base">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar onMenu={() => setOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div key={routeKey} className="animate-fade-up mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
