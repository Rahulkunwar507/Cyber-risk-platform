import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BrainCircuit, Building2, Fingerprint, Globe, Network, Rocket, Search, ShieldAlert, X } from 'lucide-react';
import { getAsset, getAssets, getVulnerabilitiesByAsset } from '../services/api';
import { useLoad } from '../hooks/useLoad';
import PageHeader from '../components/PageHeader';
import AssetTable from '../components/AssetTable';
import Drawer from '../components/Drawer';
import StatusBadge from '../components/StatusBadge';
import RiskScore from '../components/RiskScore';
import SeverityBadge from '../components/SeverityBadge';
import { EmptyState, ErrorState } from '../components/Feedback';
import { SkeletonText } from '../components/Skeleton';
import { formatDate } from '../utils/format';

const RISK_FILTERS = [
  { value: 'all', label: 'All Risk Levels' },
  { value: 'critical', label: 'Critical (≥ 80)' },
  { value: 'high', label: 'High (60 – 79)' },
  { value: 'medium', label: 'Medium (40 – 59)' },
  { value: 'low', label: 'Low (< 40)' },
];

function riskBand(score) {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

function AssetDrawer({ assetId, onClose }) {
  const navigate = useNavigate();
  const { data: asset, loading, error, refetch } = useLoad(() => getAsset(assetId), [assetId]);
  const { data: vulns } = useLoad(() => getVulnerabilitiesByAsset(assetId), [assetId]);

  useEffect(() => {
    if (assetId) document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [assetId]);

  return (
    <Drawer
      open={!!assetId}
      onClose={onClose}
      eyebrow="Asset Detail"
      title={asset?.name || 'Loading asset…'}
      actions={
        asset && (
          <button className="btn-primary" onClick={() => navigate('/ai-advisor', { state: { assetId: asset.id } })}>
            <BrainCircuit className="h-4 w-4" /> Analyze with AI
          </button>
        )
      }
    >
      {loading && <SkeletonText lines={6} />}
      {error && <ErrorState message={error} onRetry={refetch} />}

      {asset && (
        <div className="space-y-6">
          <div className="flex items-center gap-5 rounded-xl border border-line bg-panel2/50 p-4">
            <RiskScore score={asset.riskScore} size={104} />
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-faint">Current Risk Score</p>
              <StatusBadge status={asset.status} />
              <p className="text-xs text-muted">Last updated {formatDate(asset.lastUpdated)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { icon: Network, label: 'Type', value: asset.type },
              { icon: ShieldAlert, label: 'Criticality', value: asset.criticality },
              { icon: Globe, label: 'Exposure', value: asset.exposure },
              { icon: Building2, label: 'Environment', value: asset.environment },
              { icon: Rocket, label: 'Owner Team', value: asset.owner },
              { icon: Fingerprint, label: 'IP / Segment', value: asset.ipAddress },
            ].map((f) => (
              <div key={f.label} className="flex items-start gap-2.5 rounded-lg border border-line/70 bg-panel2/40 p-3">
                <f.icon className="mt-0.5 h-4 w-4 text-faint" />
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-faint">{f.label}</p>
                  <p className="truncate text-sm font-medium text-white">{f.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Description</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{asset.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Business Impact</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{asset.businessImpact}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Open Vulnerabilities ({vulns?.length ?? 0})</h3>
            <div className="mt-2 space-y-2">
              {vulns?.length ? (
                vulns.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => navigate(`/vulnerabilities/${v.id}`)}
                    className="flex w-full items-center justify-between gap-3 rounded-lg border border-line/70 bg-panel2/40 px-3 py-2.5 text-left transition-colors hover:border-accent/40"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">{v.title}</p>
                      <p className="font-mono text-xs text-faint">{v.cveId}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <SeverityBadge severity={v.severity} />
                      <span className="font-mono text-xs font-bold text-white">{v.cvss.toFixed(1)}</span>
                    </div>
                  </button>
                ))
              ) : (
                <p className="text-xs text-faint">No open vulnerabilities recorded for this asset.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
}

export default function AssetsPage() {
  const navigate = useNavigate();
  const { id: routeAssetId } = useParams();
  const { data: allAssets, loading, error, refetch } = useLoad(getAssets);

  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [openAssetId, setOpenAssetId] = useState(null);

  useEffect(() => {
    setOpenAssetId(routeAssetId || null);
  }, [routeAssetId]);

  const typeOptions = useMemo(() => {
    const types = [...new Set((allAssets || []).map((a) => a.type))].sort();
    return ['all', ...types];
  }, [allAssets]);

  const filtered = useMemo(() => {
    if (!allAssets) return [];
    const q = search.trim().toLowerCase();
    return allAssets.filter((a) => {
      if (riskFilter !== 'all' && riskBand(a.riskScore) !== riskFilter) return false;
      if (typeFilter !== 'all' && a.type !== typeFilter) return false;
      if (q && !`${a.name} ${a.type} ${a.id}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [allAssets, search, riskFilter, typeFilter]);

  const closeDrawer = () => navigate('/assets');

  return (
    <div className="space-y-6">
      <PageHeader title="Asset Inventory" subtitle="Monitor business-critical assets and their cyber risk posture." />

      {error ? (
        <div className="card">
          <ErrorState message={error} onRetry={refetch} />
        </div>
      ) : (
        <>
          <div className="card flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by asset name, type or ID…"
                className="input pl-9"
              />
            </div>
            <div className="grid grid-cols-2 gap-3 lg:flex">
              <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)} className="input lg:w-48">
                {RISK_FILTERS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="input lg:w-48">
                {typeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t === 'all' ? 'All Asset Types' : t}
                  </option>
                ))}
              </select>
              <button
                className="btn-ghost lg:ml-1"
                onClick={() => {
                  setSearch('');
                  setRiskFilter('all');
                  setTypeFilter('all');
                }}
              >
                <X className="h-4 w-4" /> Clear
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-muted">
              Showing <span className="font-semibold text-white">{filtered.length}</span> of {allAssets?.length ?? 0} assets
            </p>
            {loading && <span className="pulse-dot text-xs text-faint">Syncing…</span>}
          </div>

          {filtered.length === 0 ? (
            <div className="card">
              <EmptyState
                title="No assets match your filters"
                message="Try a different search term or reset the risk/type filters."
                action={
                  <button className="btn-ghost mt-4" onClick={() => { setSearch(''); setRiskFilter('all'); setTypeFilter('all'); }}>
                    Reset filters
                  </button>
                }
              />
            </div>
          ) : (
            <AssetTable assets={filtered} loading={loading} onRowClick={(a) => navigate(`/assets/${a.id}`)} />
          )}
        </>
      )}

      <AssetDrawer assetId={openAssetId} onClose={closeDrawer} />
    </div>
  );
}
