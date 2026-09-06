import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-lg border border-line bg-[#0E1420] px-3 py-2 shadow-xl">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-faint">
        {p.label} · {p.date}
      </p>
      <p className="mt-0.5 text-sm font-bold text-white">
        Risk Score: <span className="text-accent">{p.riskScore}</span> / 100
      </p>
    </div>
  );
}

/**
 * Cyber risk trend area chart. Pure presentational — consumes whatever
 * array of { date, label, riskScore } the API returns (mock today,
 * real backend tomorrow). Band shading marks the MEDIUM/HIGH/CRITICAL zones.
 */
export default function RiskChart({ data = [], height = 280 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
        <defs>
          <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4D7CFE" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#4D7CFE" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#1E2839" strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: '#5C6B85', fontSize: 11 }}
          axisLine={{ stroke: '#1E2839' }}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          domain={[0, 100]}
          ticks={[0, 20, 40, 60, 80, 100]}
          tick={{ fill: '#5C6B85', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#2a3a5c', strokeDasharray: '4 4' }} />
        <ReferenceArea y1={60} y2={80} fill="#FB923C" fillOpacity={0.05} stroke="#FB923C" strokeOpacity={0.14} />
        <ReferenceArea y1={80} y2={100} fill="#F43F5E" fillOpacity={0.06} stroke="#F43F5E" strokeOpacity={0.16} />
        <Area
          type="monotone"
          dataKey="riskScore"
          name="Risk Score"
          stroke="#4D7CFE"
          strokeWidth={2.5}
          fill="url(#riskGradient)"
          dot={{ r: 3.5, fill: '#4D7CFE', strokeWidth: 0 }}
          activeDot={{ r: 5, fill: '#4D7CFE' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
