/**
 * ─────────────────────────────────────────────────────────────
 * MOCK DATA — AI Security Advisor analyses (per asset)
 *
 * Mirror of the POST /api/ai/recommend response body.
 * The frontend treats these as API data — the AI engine team will
 * replace getAIRecommendation() in src/services/api.js with a real
 * call to their recommendation backend. No UI change required.
 * ─────────────────────────────────────────────────────────────
 */

export const aiRecommendations = {
  'asset-cust-db': {
    assetId: 'asset-cust-db',
    riskScore: 91,
    whyRisky: [
      { label: 'Critical vulnerability', detail: 'Open SQL injection — CVE-2026-1001 · CVSS 9.8', severity: 'Critical', icon: 'bug' },
      { label: 'Internet exposure', detail: 'Database tier is reachable from the public internet', severity: 'Critical', icon: 'globe' },
      { label: 'High business criticality', detail: 'Core data platform supporting every business line', severity: 'High', icon: 'shield' },
      { label: 'Sensitive customer information', detail: 'PII, KYC documents and transaction history', severity: 'High', icon: 'database' },
      { label: 'Exploit available', detail: 'Public proof-of-concept exists for CVE-2026-1001', severity: 'Critical', icon: 'flame' },
    ],
    businessImpact:
      'Compromise of this asset could expose sensitive customer information and disrupt critical business operations — including regulatory penalties under the DPDP Act and long-term reputational damage.',
    analysis: {
      recommendedPriority: 'Immediate',
      recommendation: 'Patch the critical vulnerability immediately and restrict unnecessary external exposure.',
      rationale:
        'This asset combines maximum criticality, internet exposure and an exploitable critical vulnerability. Remediating it removes the single largest contributor to organizational risk.',
    },
    recommendedActions: [
      { title: 'Patch critical vulnerability', cost: 100000, riskReduction: 'High', icon: 'wrench', mappedOptionId: 'patch-critical-vulnerability' },
      { title: 'Network restriction', cost: 50000, riskReduction: 'Medium', icon: 'network', mappedOptionId: null },
      { title: 'Enable MFA', cost: 100000, riskReduction: 'Medium', icon: 'key', mappedOptionId: 'enable-mfa' },
      { title: 'Increase monitoring', cost: 50000, riskReduction: 'Medium', icon: 'monitor', mappedOptionId: null },
    ],
  },
  'asset-payment-api': {
    assetId: 'asset-payment-api',
    riskScore: 87,
    whyRisky: [
      { label: 'Critical vulnerability', detail: 'Remote code execution — CVE-2026-0987 · CVSS 9.1', severity: 'Critical', icon: 'bug' },
      { label: 'Internet exposure', detail: 'Gateway and transaction API exposed to the internet', severity: 'Critical', icon: 'globe' },
      { label: 'Business-critical payment flows', detail: 'Handles card payments and UPI for all customers', severity: 'High', icon: 'shield' },
      { label: 'Cardholder data at risk', detail: 'PCI DSS obligations apply to this asset', severity: 'High', icon: 'database' },
      { label: 'Exploit available', detail: 'Public exploit available for the gateway library', severity: 'Critical', icon: 'flame' },
    ],
    businessImpact:
      'Compromise could enable financial fraud, transaction manipulation and breach of PCI DSS obligations, exposing cardholder data flows.',
    analysis: {
      recommendedPriority: 'Immediate',
      recommendation: 'Patch the payment gateway library immediately and place the API behind a web application firewall.',
      rationale:
        'An internet-exposed, exploitable vulnerability on a transaction-processing asset directly threatens revenue and compliance — the highest financial impact in the portfolio.',
    },
    recommendedActions: [
      { title: 'Patch payment gateway library', cost: 100000, riskReduction: 'High', icon: 'wrench', mappedOptionId: 'patch-critical-vulnerability' },
      { title: 'Deploy WAF protections', cost: 100000, riskReduction: 'Medium', icon: 'network', mappedOptionId: 'network-segmentation' },
      { title: 'Enable MFA for admins', cost: 100000, riskReduction: 'Medium', icon: 'key', mappedOptionId: 'enable-mfa' },
      { title: 'Increase monitoring', cost: 50000, riskReduction: 'Medium', icon: 'monitor', mappedOptionId: null },
    ],
  },
  'asset-web-server': {
    assetId: 'asset-web-server',
    riskScore: 72,
    whyRisky: [
      { label: 'Critical vulnerability', detail: 'Default admin credentials — CVE-2026-0543 · CVSS 9.4', severity: 'Critical', icon: 'bug' },
      { label: 'Internet exposure', detail: 'Public web server with admin console exposed', severity: 'Critical', icon: 'globe' },
      { label: 'High asset criticality', detail: 'Hosts the customer portal and marketing sites', severity: 'High', icon: 'shield' },
      { label: 'Weak access controls', detail: 'Default credentials remain active on the console', severity: 'High', icon: 'key' },
      { label: 'Exploit available', detail: 'Attackers actively target default-credential consoles', severity: 'Critical', icon: 'flame' },
    ],
    businessImpact:
      'Full server takeover could enable website defacement, web-layer data breaches and use of the host as a pivot point into the internal network.',
    analysis: {
      recommendedPriority: 'High',
      recommendation: 'Rotate all default credentials, enforce MFA on administration and restrict the admin console to the corporate VPN.',
      rationale:
        'Trivial-to-exploit access control gaps on a public-facing asset carry outsized risk for a modest remediation cost.',
    },
    recommendedActions: [
      { title: 'Rotate credentials & harden access', cost: 100000, riskReduction: 'High', icon: 'key', mappedOptionId: 'enable-mfa' },
      { title: 'Patch web server', cost: 100000, riskReduction: 'High', icon: 'wrench', mappedOptionId: 'patch-critical-vulnerability' },
      { title: 'Deploy WAF', cost: 100000, riskReduction: 'Medium', icon: 'network', mappedOptionId: 'network-segmentation' },
      { title: 'Increase monitoring', cost: 50000, riskReduction: 'Medium', icon: 'monitor', mappedOptionId: null },
    ],
  },
  'asset-cloud-server': {
    assetId: 'asset-cloud-server',
    riskScore: 68,
    whyRisky: [
      { label: 'Unpatched hypervisor kernel', detail: 'Privilege-escalation fixes missing — CVE-2025-8812 · CVSS 7.8', severity: 'High', icon: 'bug' },
      { label: 'Shared production workloads', detail: 'All business application back-ends run here', severity: 'High', icon: 'shield' },
      { label: 'Restricted but adjacent', detail: 'Not internet-exposed, but a single hop from exposed tiers', severity: 'Medium', icon: 'globe' },
      { label: 'Recovery dependency', detail: 'Backups and DR runbooks are not yet validated', severity: 'Medium', icon: 'database' },
      { label: 'No exploit available', detail: 'No public exploit yet — window to act ahead of attackers', severity: 'Low', icon: 'shield' },
    ],
    businessImpact:
      'A guest-to-host escape could compromise every workload sharing the hypervisor, taking core applications offline.',
    analysis: {
      recommendedPriority: 'High',
      recommendation: 'Patch the hypervisor during a maintenance window and validate backup-and-recovery readiness before upgrading.',
      rationale:
        'The blast radius covers all production workloads; sequencing patch + verified recovery minimizes downtime risk.',
    },
    recommendedActions: [
      { title: 'Patch hypervisor kernel', cost: 100000, riskReduction: 'High', icon: 'wrench', mappedOptionId: 'patch-critical-vulnerability' },
      { title: 'Improve backup & recovery', cost: 200000, riskReduction: 'Medium', icon: 'shield', mappedOptionId: 'improve-backup-recovery' },
      { title: 'Enable MFA for cloud admins', cost: 100000, riskReduction: 'Medium', icon: 'key', mappedOptionId: 'enable-mfa' },
      { title: 'Increase monitoring', cost: 50000, riskReduction: 'Medium', icon: 'monitor', mappedOptionId: null },
    ],
  },
  'asset-employee-devices': {
    assetId: 'asset-employee-devices',
    riskScore: 54,
    whyRisky: [
      { label: 'Endpoint protection gap', detail: 'Scan exclusion for legacy browser — CVE-2025-6433', severity: 'High', icon: 'bug' },
      { label: 'Large attack surface', detail: 'Hundreds of managed laptops across departments', severity: 'High', icon: 'monitor' },
      { label: 'Credential theft risk', detail: 'Compromised endpoints feed lateral movement', severity: 'Medium', icon: 'key' },
      { label: 'Phishing susceptibility', detail: 'No role-based security awareness program yet', severity: 'Medium', icon: 'shield' },
    ],
    businessImpact:
      'Compromise could lead to credential theft and lateral movement across the internal network, amplifying the impact of any single infection.',
    analysis: {
      recommendedPriority: 'Medium',
      recommendation: 'Remove the endpoint scan exclusion, roll out MFA organization-wide and launch security awareness training.',
      rationale:
        'Broad but shallow risk: cheap, high-coverage controls (MFA, EDR, training) reduce the likelihood of endpoint-driven breaches.',
    },
    recommendedActions: [
      { title: 'Enable MFA organization-wide', cost: 100000, riskReduction: 'Medium', icon: 'key', mappedOptionId: 'enable-mfa' },
      { title: 'Deploy EDR', cost: 200000, riskReduction: 'High', icon: 'monitor', mappedOptionId: 'deploy-edr' },
      { title: 'Security awareness training', cost: 100000, riskReduction: 'Medium', icon: 'shield', mappedOptionId: 'security-awareness-training' },
      { title: 'Increase monitoring', cost: 50000, riskReduction: 'Medium', icon: 'monitor', mappedOptionId: null },
    ],
  },
  'asset-internal-network': {
    assetId: 'asset-internal-network',
    riskScore: 49,
    whyRisky: [
      { label: 'Segmentation misconfiguration', detail: 'VLAN boundary flaw — CVE-2025-9182 · CVSS 6.8', severity: 'Medium', icon: 'bug' },
      { label: 'Lateral-movement amplifier', detail: 'Weak segmentation extends the blast radius of any breach', severity: 'High', icon: 'network' },
      { label: 'Outdated switch firmware', detail: 'Known DoS and management-plane issues — CVE-2025-7711', severity: 'High', icon: 'shield' },
      { label: 'Internal exposure only', detail: 'Not reachable from the internet', severity: 'Low', icon: 'globe' },
    ],
    businessImpact:
      'Weakness here amplifies lateral movement and extends the blast radius of any endpoint or server compromise.',
    analysis: {
      recommendedPriority: 'Medium',
      recommendation: 'Correct the segmentation configuration and update switch firmware to contain future compromises.',
      rationale:
        'The network is a force multiplier — fixing segmentation is the highest-leverage containment control available.',
    },
    recommendedActions: [
      { title: 'Network segmentation', cost: 300000, riskReduction: 'High', icon: 'network', mappedOptionId: 'network-segmentation' },
      { title: 'Firmware updates', cost: 100000, riskReduction: 'Medium', icon: 'wrench', mappedOptionId: null },
      { title: 'Enable MFA', cost: 100000, riskReduction: 'Medium', icon: 'key', mappedOptionId: 'enable-mfa' },
      { title: 'Increase monitoring', cost: 50000, riskReduction: 'Medium', icon: 'monitor', mappedOptionId: null },
    ],
  },
};
