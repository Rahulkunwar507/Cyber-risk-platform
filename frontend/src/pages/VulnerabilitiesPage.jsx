import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertTriangle, ArrowDownToLine, BrainCircuit, Bug, Flame, Layers, Search, X } from 'lucide-react';
import { getVulnerabilities, getVulnerability, getVulnerabilitySummary } from '../services/api';
import { useLoad } from '../hooks/useLoad';
import PageHeader from '../components/PageHeader';
import VulnerabilityTable from '../components/VulnerabilityTable';
import Drawer from '../components/Drawer';
import RiskScore from '../components/RiskScore';
import SeverityBadge, { PriorityBadge } from '../components/SeverityBadge';
import RiskBadge from '../components/RiskBadge';
import StatusBadge from '../components/StatusBadge';
import { EmptyState, ErrorState } from '../components/Feedback';
import { SkeletonText } from '../components/Skeleton';
import {
  DetailRow,
  ExploitBadge,
  ExposureBadge,
  StatBlock,
  VulnerabilityHeader,
  ActionSteps,
} from '../components/VulnerabilityDetail';
import { formatDate } from '../utils/format';

function VulnDrawer({ vulnId, onClose }) {
  const navigate = useNavigate();
  const { data: v, loading, error, refetch } = useLoad(() => getVulnerability(vulnId), [vulnId]);

  useEffect(() => {
    if (vulnId) document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [vulnId]);

  return (
    <Drawer
      open={!!vulnId}
      onClose={onClose}
      eyebrow="Vulnerability Detail"
      title={v ? `${v.cveId} · ${v.id}` : 'Loading vulnerability…'}
      footer={
        v && (
          <div className="flex items-center gap-2">
            <button className="btn-ghost flex-1" onClick={onClose}>
              Close
            </button>
            <button
              className="btn-primary flex-1"
              onClick={() => navigate('/ai-advisor', { state: { assetId: v.assetId, vulnId: v.id } })}
            >
              <BrainCircuit className="h-4 w-4" /> Analyze with AI
            </button>
          </div>
        )
      }
    >
      {loading && <SkeletonText lines={8} />}
      {error && <ErrorState message={error} onRetry={refetch} />}

      {v && (
        <div className="space-y-6">
          <VulnerabilityHeader v={v} />

          <div className="flex items-center gap-5 rounded-xl border border-line bg-panel2/50 p-4">
            <RiskScore score={v.riskScore} size={96} />
            <div className="space-y-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-faint">Risk for affected asset</p>
                <RiskBadge score={v.riskScore} />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={v.status} />
                <PriorityBadge priority={v.priority} />
              </div>
            </div>
          </div>

          <div className="divide-y divide-line/70 rounded-lg border border-line/70 bg-panel2/40 px-4">
            <DetailRow label="Vulnerability ID">{v.id}</DetailRow>
            <DetailRow label="CVE">{v.cveId}</DetailRow>
            <DetailRow label="Severity">
              <SeverityBadge severity={v.severity} />
            </DetailRow>
            <DetailRow label="CVSS Score">{v.cvss.toFixed(1)} / 10</DetailRow>
            <DetailRow label="Affected Asset">{v.assetName}</DetailRow>
            <DetailRow label="Exposure">
              <ExposureBadge exposure={v.exposure} />
            </DetailRow>
            <DetailRow label="Exploit Status">
              <ExploitBadge available={v.exploitAvailable} />
            </DetailRow>
            <DetailRow label="Discovery Date">{formatDate(v.discoveredDate)}</DetailRow>
            <DetailRow label="Priority">
              <PriorityBadge priority={v.priority} />
            </DetailRow>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Business Impact</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{v.businessImpact}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Recommended Action</h3>
            <p className="mt-1.5 rounded-lg border border-accent/25 bg-accent/[0.07] p-3 text-sm leading-relaxed text-ink">
              {v.recommendedAction}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Remediation Steps</h3>
            <div className="mt-2">
              <ActionSteps steps={v.remediationSteps} />
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
}

export default function VulnerabilitiesPage() {
  const navigate = useNavigate();
  const { id: routeVulnId } = useParams();
  const { data: vulns, loading, error, refetch } = useLoad(getVulnerabilities);
  const { data: summary } = useLoad(getVulnerabilitySummary);

  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openVulnId, setOpenVulnId] = useState(null);

  useEffect(() => {
    setOpenVulnId(routeVulnId || null);
  }, [routeVulnId]);

  const filtered = useMemo(() => {
    if (!vulns) return [];
    const q = search.trim().toLowerCase();
    return vulns.filter((v) => {
      if (severityFilter !== 'all' && v.severity !== severityFilter) return false;
      if (statusFilter !== 'all' && v.status !== statusFilter) return false;
      if (q && !`${v.title} ${v.cveId} ${v.id} ${v.assetName}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [vulns, search, severityFilter, statusFilter]);

  const closeDrawer = () => navigate('/vulnerabilities');

  const stats = [
    { label: 'Total Vulnerabilities', value: summary?.total ?? '—', icon: Bug, tone: 'muted' },
    { label: 'Critical', value: summary?.critical ?? '—', icon: Flame, tone: 'danger' },
    { label: 'High', value: summary?.high ?? '—', icon: AlertTriangle, tone: 'orange' },
    { label: 'Medium', value: summary?.medium ?? '—', icon: Layers, tone: 'warning' },
    {
      label: 'Remediation Progress',
      value: summary ? `${summary.remediationProgress}%` : '—',
      icon: ArrowDownToLine,
      tone: 'success',
      progress: summary?.remediationProgress,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Vulnerability Management" subtitle="Track, prioritize and remediate vulnerabilities across business-critical assets." />

      {error ? (
        <div className="card">
          <ErrorState message={error} onRetry={refetch} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
            {stats.map((s) => (
              <StatBlock key={s.label} {...s} />
            ))}
          </div>

          <div className="card flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search vulnerability, CVE or asset…"
                className="input pl-9"
              />
            </div>
            <div className="grid grid-cols-2 gap-3 lg:flex">
              <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} className="input lg:w-44">
                <option value="all">All Severities</option>
                {['Critical', 'High', 'Medium', 'Low'].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input lg:w-44">
                <option value="all">All Statuses</option>
                {['Open', 'In Progress', 'Remediated'].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button
                className="btn-ghost lg:ml-1"
                onClick={() => {
                  setSearch('');
                  setSeverityFilter('all');
                  setStatusFilter('all');
                }}
              >
                <X className="h-4 w-4" /> Clear
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-muted">
              Showing <span className="font-semibold text-white">{filtered.length}</span> of {vulns?.length ?? 0} vulnerabilities
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="card">
              <EmptyState
                title="No vulnerabilities match your filters"
                message="Try a different search term or reset the filters."
                action={
                  <button
                    className="btn-ghost mt-4"
                    onClick={() => {
                      setSearch('');
                      setSeverityFilter('all');
                      setStatusFilter('all');
                    }}
                  >
                    Reset filters
                  </button>
                }
              />
            </div>
          ) : (
            <VulnerabilityTable vulnerabilities={filtered} loading={loading} onRowClick={(v) => navigate(`/vulnerabilities/${v.id}`)} />
          )}
        </>
      )}

      <VulnDrawer vulnId={openVulnId} onClose={closeDrawer} />
    </div>
  );
}
