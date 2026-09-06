import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, Braces, ChevronRight, Cloud, Database, Globe, Monitor, Network, Server } from 'lucide-react';
import RiskBadge from './RiskBadge';
import StatusBadge from './StatusBadge';
import { SkeletonRows } from './Skeleton';
import { formatDate } from '../utils/format';
import { riskStatus } from '../utils/risk';

const TYPE_ICONS = {
  Database,
  API: Braces,
  'Web Server': Globe,
  'Cloud Infrastructure': Cloud,
  Endpoint: Monitor,
  Network,
};

function MiniBar({ score }) {
  const s = riskStatus(score);
  return (
    <div className="mt-1.5 h-1 w-14 overflow-hidden rounded-full bg-line">
      <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: s.hex }} />
    </div>
  );
}

const CRIT_ORDER = { Critical: 3, High: 2, Medium: 1, Low: 0 };

export default function AssetTable({ assets = [], loading, onRowClick }) {
  const [sortKey, setSortKey] = useState('riskScore');
  const [sortDir, setSortDir] = useState('desc');

  const sorted = useMemo(() => {
    const arr = [...assets];
    arr.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortKey === 'riskScore') cmp = a.riskScore - b.riskScore;
      else if (sortKey === 'criticality') cmp = CRIT_ORDER[a.criticality] - CRIT_ORDER[b.criticality];
      else if (sortKey === 'lastUpdated') cmp = new Date(a.lastUpdated) - new Date(b.lastUpdated);
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return arr;
  }, [assets, sortKey, sortDir]);

  const toggle = (key) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir(key === 'name' || key === 'criticality' ? 'asc' : 'desc');
    }
  };

  const SortHeader = ({ label, k, className = '' }) => (
    <th className={`th cursor-pointer select-none hover:text-ink ${className}`} onClick={() => toggle(k)}>
      <span className="inline-flex items-center gap-1.5">
        {label}
        {sortKey === k ? (
          sortDir === 'asc' ? (
            <ArrowUp className="h-3 w-3 text-accent" />
          ) : (
            <ArrowDown className="h-3 w-3 text-accent" />
          )
        ) : (
          <ArrowUpDown className="h-3 w-3 text-faint/70" />
        )}
      </span>
    </th>
  );

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="border-b border-line bg-panel2/40">
            <tr>
              <SortHeader label="Asset" k="name" />
              <th className="th">Type</th>
              <SortHeader label="Criticality" k="criticality" />
              <th className="th">Exposure</th>
              <SortHeader label="Risk Score" k="riskScore" />
              <th className="th">Status</th>
              <SortHeader label="Last Updated" k="lastUpdated" />
              <th className="th" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <SkeletonRows rows={6} cols={7} />
            ) : (
              sorted.map((asset) => {
                const Icon = TYPE_ICONS[asset.type] || Server;
                return (
                  <tr
                    key={asset.id}
                    onClick={() => onRowClick?.(asset)}
                    className="cursor-pointer border-b border-line/60 transition-colors last:border-0 hover:bg-panel2/50"
                  >
                    <td className="td">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line bg-panel2 text-muted">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="font-semibold text-white">{asset.name}</p>
                          <p className="text-xs text-faint">{asset.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="td text-muted">{asset.type}</td>
                    <td className="td">
                      <span
                        className={`chip ${
                          asset.criticality === 'Critical'
                            ? 'border-danger/25 bg-danger/10 text-danger'
                            : asset.criticality === 'High'
                              ? 'border-orange/25 bg-orange/10 text-orange'
                              : 'border-line bg-panel2 text-muted'
                        }`}
                      >
                        {asset.criticality}
                      </span>
                    </td>
                    <td className="td text-muted">{asset.exposure}</td>
                    <td className="td">
                      <RiskBadge score={asset.riskScore} />
                      <MiniBar score={asset.riskScore} />
                    </td>
                    <td className="td">
                      <StatusBadge status={asset.status} />
                    </td>
                    <td className="td text-muted">{formatDate(asset.lastUpdated)}</td>
                    <td className="td">
                      <ChevronRight className="h-4 w-4 text-faint" />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
