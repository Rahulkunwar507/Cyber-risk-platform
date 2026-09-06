/**
 * ─────────────────────────────────────────────────────────────
 * MOCK DATA — assets & dashboard summary
 *
 * These structures mirror the JSON shapes the real backend will
 * return from GET /api/assets and GET /api/dashboard.
 * Keep this module free of UI logic; the service layer
 * (src/services/api.js) is the only consumer.
 * ─────────────────────────────────────────────────────────────
 */

export const assets = [
  {
    id: 'asset-cust-db',
    name: 'Customer Database',
    type: 'Database',
    criticality: 'Critical',
    exposure: 'Internet Exposed',
    riskScore: 91,
    status: 'At Risk',
    lastUpdated: '2026-09-03T08:15:00Z',
    environment: 'Production',
    owner: 'Data Platform Team',
    ipAddress: '10.0.4.21',
    vulnerabilityCount: 14,
    description:
      'Primary customer information repository containing PII, KYC documents and transaction history for all retail and wealth customers.',
    businessImpact:
      'Compromise could expose sensitive customer information and disrupt critical business operations, with regulatory implications under the DPDP Act.',
  },
  {
    id: 'asset-payment-api',
    name: 'Payment API',
    type: 'API',
    criticality: 'Critical',
    exposure: 'Internet Exposed',
    riskScore: 87,
    status: 'At Risk',
    lastUpdated: '2026-09-03T07:40:00Z',
    environment: 'Production',
    owner: 'Payments Engineering',
    ipAddress: '10.0.5.12',
    vulnerabilityCount: 11,
    description:
      'Internet-facing payment gateway and transaction processing API handling card payments and UPI flows.',
    businessImpact:
      'Compromise could enable financial fraud, transaction manipulation and breach PCI DSS compliance obligations.',
  },
  {
    id: 'asset-web-server',
    name: 'Internet Web Server',
    type: 'Web Server',
    criticality: 'High',
    exposure: 'Internet Exposed',
    riskScore: 72,
    status: 'Needs Attention',
    lastUpdated: '2026-09-02T18:05:00Z',
    environment: 'Production',
    owner: 'Web Platform Team',
    ipAddress: '203.0.113.44',
    vulnerabilityCount: 9,
    description:
      'Public web server hosting the corporate website, customer portal login and marketing pages.',
    businessImpact:
      'Compromise could lead to website defacement, web-layer data breaches and reputational damage to customer-facing services.',
  },
  {
    id: 'asset-cloud-server',
    name: 'Cloud Server',
    type: 'Cloud Infrastructure',
    criticality: 'High',
    exposure: 'Restricted',
    riskScore: 68,
    status: 'Needs Attention',
    lastUpdated: '2026-09-02T14:30:00Z',
    environment: 'Production',
    owner: 'Cloud Infrastructure Team',
    ipAddress: '10.0.2.8',
    vulnerabilityCount: 8,
    description:
      'Virtualized production workloads hosting application back-ends and internal services on the private cloud.',
    businessImpact:
      'Compromise could allow lateral movement into production workloads and compromise shared cloud resources.',
  },
  {
    id: 'asset-employee-devices',
    name: 'Employee Devices',
    type: 'Endpoint',
    criticality: 'Medium',
    exposure: 'Internal',
    riskScore: 54,
    status: 'Monitoring',
    lastUpdated: '2026-09-03T06:50:00Z',
    environment: 'Corporate',
    owner: 'IT Operations',
    ipAddress: '10.0.10.0/24',
    vulnerabilityCount: 7,
    description:
      'Managed laptop fleet for employees, including finance, support and engineering teams.',
    businessImpact:
      'Compromise could lead to credential theft and lateral movement across the internal network.',
  },
  {
    id: 'asset-internal-network',
    name: 'Internal Network',
    type: 'Network',
    criticality: 'High',
    exposure: 'Internal',
    riskScore: 49,
    status: 'Protected',
    lastUpdated: '2026-09-01T11:20:00Z',
    environment: 'Corporate',
    owner: 'Network Engineering',
    ipAddress: '10.0.0.0/16',
    vulnerabilityCount: 6,
    description:
      'Core corporate network, switching fabric and segmentation between departments and environments.',
    businessImpact:
      'Weakness here could amplify lateral movement and extend the blast radius of any endpoint compromise.',
  },
];

export const notifications = [
  {
    id: 'notif-1',
    title: 'Critical exploit detected for CVE-2026-1001 on Customer Database',
    severity: 'Alert',
    time: '2026-09-03T08:05:00Z',
  },
  {
    id: 'notif-2',
    title: 'CVE-2026-0987 added to the Payment API from scanning',
    severity: 'Alert',
    time: '2026-09-03T07:20:00Z',
  },
  {
    id: 'notif-3',
    title: 'Weekly risk summary generated — overall risk HIGH (78/100)',
    severity: 'Info',
    time: '2026-09-02T22:00:00Z',
  },
  {
    id: 'notif-4',
    title: '2 endpoints missed the last patch cycle (Employee Devices)',
    severity: 'Info',
    time: '2026-09-02T12:45:00Z',
  },
];

export const dashboardSummary = {
  overallRiskScore: 78,
  overallRiskStatus: 'HIGH',
  criticalVulnerabilities: 8,
  highVulnerabilities: 17,
  estimatedFinancialExposureInr: 4250000,
  totalVulnerabilities: 61,
  updatedAt: '2026-09-03T08:30:00Z',
  trend: [
    { date: '2026-08-28', day: 1, label: 'Day 1', riskScore: 61 },
    { date: '2026-08-29', day: 2, label: 'Day 2', riskScore: 64 },
    { date: '2026-08-30', day: 3, label: 'Day 3', riskScore: 68 },
    { date: '2026-08-31', day: 4, label: 'Day 4', riskScore: 70 },
    { date: '2026-09-01', day: 5, label: 'Day 5', riskScore: 74 },
    { date: '2026-09-02', day: 6, label: 'Day 6', riskScore: 76 },
    { date: '2026-09-03', day: 7, label: 'Day 7', riskScore: 78 },
  ],
  topRiskyAssets: assets
    .slice()
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 5)
    .map((a) => ({
      id: a.id,
      name: a.name,
      type: a.type,
      riskScore: a.riskScore,
      status: a.status,
      criticality: a.criticality,
    })),
  riskFactors: [
    {
      id: 'rf-1',
      label: 'Critical vulnerability',
      detail: 'Open critical vulnerability with CVSS 9.8 (CVE-2026-1001)',
      severity: 'Critical',
      icon: 'bug',
    },
    {
      id: 'rf-2',
      label: 'Internet exposure',
      detail: '3 business-critical assets directly exposed to the internet',
      severity: 'Critical',
      icon: 'globe',
    },
    {
      id: 'rf-3',
      label: 'Sensitive customer data',
      detail: 'PII and financial records stored on exposed assets',
      severity: 'High',
      icon: 'database',
    },
    {
      id: 'rf-4',
      label: 'High asset criticality',
      detail: 'Customer Database and Payment API are business-critical systems',
      severity: 'High',
      icon: 'shield',
    },
    {
      id: 'rf-5',
      label: 'Exploit available',
      detail: 'Public exploit exists for 4 of the open critical vulnerabilities',
      severity: 'Critical',
      icon: 'flame',
    },
  ],
  vulnerabilitySeverityBreakdown: { critical: 8, high: 17, medium: 24, low: 12 },
  aiRecommendation: {
    id: 'rec-1',
    assetId: 'asset-cust-db',
    title: 'Prioritize Customer Database remediation',
    text: 'Prioritize remediation of the Customer Database vulnerability because it combines high asset criticality, external exposure and a critical vulnerability.',
    rationale:
      'This single initiative delivers the largest risk-point reduction per rupee in the current portfolio.',
  },
};
