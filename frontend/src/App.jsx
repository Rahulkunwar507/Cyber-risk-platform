import { HashRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import Layout from './components/Layout';
import { ToastProvider } from './components/Toast';
import DashboardPage from './pages/DashboardPage';
import AssetsPage from './pages/AssetsPage';
import VulnerabilitiesPage from './pages/VulnerabilitiesPage';
import AiAdvisorPage from './pages/AiAdvisorPage';
import OptimizerPage from './pages/OptimizerPage';

function NotFound() {
  return (
    <div className="flex h-[60vh] flex-col items-center justify-center text-center">
      <Compass className="mb-4 h-10 w-10 text-faint" />
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-sm text-muted">The page you are looking for does not exist.</p>
      <Link to="/dashboard" className="btn-primary mt-6">
        Back to Dashboard
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <ToastProvider>
        <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/assets" element={<AssetsPage />} />
          <Route path="/assets/:id" element={<AssetsPage />} />
          <Route path="/vulnerabilities" element={<VulnerabilitiesPage />} />
          <Route path="/vulnerabilities/:id" element={<VulnerabilitiesPage />} />
          <Route path="/ai-advisor" element={<AiAdvisorPage />} />
          <Route path="/optimizer" element={<OptimizerPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Layout>
      </ToastProvider>
    </HashRouter>
  );
}
