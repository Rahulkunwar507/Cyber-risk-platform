import { Link } from 'react-router-dom';
import { AlertTriangle, Bug, ChevronRight, Database, Flame, Globe, IndianRupee, ShieldAlert } from 'lucide-react';
import { getDashboard } from '../services/api';
import { useLoad } from '../hooks/useLoad';
import PageHeader from '../components/PageHeader';
import MetricCard from '../components/MetricCard';
import RiskBadge from '../components/RiskBadge';
import RiskChart from '../components/RiskChart';
import ChartCard from '../components/ChartCard';
import RecommendationCard from '../components/RecommendationCard';
import { ErrorState } from '../components/Feedback';
import { SkeletonCard, SkeletonChart } from '../components/Skeleton';
import { formatINRLakhs } from '../utils/format';
import { riskStatus } from '../utils/risk';

const FACTOR_ICONS = { bug: Bug, globe: Globe, database: Database, shield: ShieldAlert, flame: Flame };

export default function DashboardPage() {
  const { data: dashboard, loading, error, refetch } = useLoad(getDashboard);

  if (error) {
    return (
      <div className="card">
        <ErrorState message={error} onRetry={refetch} />
      </div>
    );
  }

  if (loading || !dashboard) {
    return (
      <div className="space-y-6">
        <div>
          <div className="skeleton h-7 w-48" />
          <div className="skeleton mt-2 h-4 w-96 max-w-full" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <SkeletonChart className="lg:col-span-2" />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  const overallStatus = riskStatus(dashboard.overallRiskScore);
  const exposureInLakhs = formatINRLakhs(dashboard.estimatedFinancialExposureInr);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Security Dashboard"
        subtitle="AI-powered continuous cyber risk quantification for ABC Financial Services."
      >
        <span className="chip border-line bg-panel2 text-faint">Updated {new Date(dashboard.updatedAt).toLocaleString('en-IN')}</span>
      </PageHeader>

      {/* Main metric cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Overall Cyber Risk"
          value={`${dashboard.overallRiskScore} / 100`}
          sub={
            <span className={`mt-1 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-bold ${overallStatus.border} ${overallStatus.bg} ${overallStatus.text}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${overallStatus.dot}`} />
              {overallStatus.label}
            </span>
          }
          icon={ShieldAlert}
          tone="danger"
        />
        <MetricCard
          label="Critical Vulnerabilities"
          value={dashboard.criticalVulnerabilities}
          sub="CVSS ≥ 9.0 · exploit available"
          icon={Bug}
          tone="danger"
        />
        <MetricCard
          label="High Vulnerabilities"
          value={dashboard.highVulnerabilities}
          sub="CVSS 7.0 – 8.9"
          icon={AlertTriangle}
          tone="orange"
        />
        <MetricCard
          label="Estimated Financial Exposure"
          value={exposureInLakhs}
          sub="Projected annual exposure"
          icon={IndianRupee}
          tone="warning"
        />
      </div>

      {/* Risk trend + top risky assets */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ChartCard
          title="Cyber Risk Trend — Last 7 Days"
          subtitle="Organization-wide composite cyber risk score (0–100)"
          className="lg:col-span-2"
          actions={
            <div className="flex items-center gap-3 text-[11px] text-faint">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#FB923C]" /> High
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#F43F5E]" /> Critical
              </span>
            </div>
          }
        >
          <RiskChart data={dashboard.trend} />
        </ChartCard>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-white">Top Risky Assets</h3>
          <p className="mt-0.5 text-xs text-muted">Highest-risk assets by current score</p>
          <div className="mt-4 space-y-2">
            {dashboard.topRiskyAssets.map((asset) => (
              <Link
                key={asset.id}
                to={`/assets/${asset.id}`}
                className="group flex items-center justify-between gap-3 rounded-lg border border-line/70 bg-panel2/40 px-3 py-2.5 transition-colors hover:border-accent/40 hover:bg-panel2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{asset.name}</p>
                  <p className="text-[11px] text-faint">{asset.type}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <RiskBadge score={asset.riskScore} />
                  <ChevronRight className="h-4 w-4 text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
                </div>
              </Link>
            ))}
          </div>
          <Link to="/assets" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-[#6f95ff]">
            View all assets <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Risk factors + AI recommendation */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-white">Risk Factors</h3>
          <p className="mt-0.5 text-xs text-muted">What is driving the organization's risk right now</p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {dashboard.riskFactors.map((f) => {
              const Icon = FACTOR_ICONS[f.icon] || AlertTriangle;
              const tone = f.severity === 'Critical' ? 'text-danger border-danger/25 bg-danger/10' : 'text-orange border-orange/25 bg-orange/10';
              return (
                <div key={f.id} className="flex items-start gap-3 rounded-lg border border-line bg-panel2/40 p-3">
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${tone}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 text-sm font-semibold text-white">
                      {f.label}
                      <span className={`text-[10px] font-bold uppercase tracking-wide ${f.severity === 'Critical' ? 'text-danger' : 'text-orange'}`}>
                        {f.severity}
                      </span>
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted">{f.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <RecommendationCard recommendation={dashboard.aiRecommendation} />
      </div>
    </div>
  );
}
