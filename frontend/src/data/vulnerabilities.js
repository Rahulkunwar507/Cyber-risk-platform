/**
 * ─────────────────────────────────────────────────────────────
 * MOCK DATA — vulnerabilities
 *
 * Mirrors the shape of GET /api/vulnerabilities responses.
 * CVE IDs shown here are DEMO identifiers for the SIH prototype,
 * not real CVE entries.
 * ─────────────────────────────────────────────────────────────
 */

export const vulnerabilities = [
  {
    id: 'VULN-001',
    cveId: 'CVE-2026-1001',
    title: 'Unauthenticated SQL Injection in Customer Portal',
    severity: 'Critical',
    cvss: 9.8,
    assetId: 'asset-cust-db',
    assetName: 'Customer Database',
    exposure: 'Internet Exposed',
    exploitAvailable: true,
    riskScore: 91,
    priority: 'Immediate',
    status: 'Open',
    discoveredDate: '2026-08-24',
    description:
      'An unauthenticated SQL injection flaw in the customer portal query layer allows remote attackers to extract, modify or delete records from the customer database without credentials.',
    businessImpact:
      'Full compromise of the customer database — PII exfiltration, data integrity loss, regulatory penalties under the DPDP Act and severe reputational damage.',
    recommendedAction:
      'Apply the vendor security patch immediately, move all queries to prepared statements and restrict direct database exposure to trusted tiers only.',
    remediationSteps: [
      'Apply vendor security patch to the customer portal application',
      'Audit and harden all SQL query construction',
      'Restrict database access to application-tier networks only',
      'Validate the fix with targeted penetration testing',
    ],
  },
  {
    id: 'VULN-002',
    cveId: 'CVE-2026-0987',
    title: 'Remote Code Execution in Payment Gateway Library',
    severity: 'Critical',
    cvss: 9.1,
    assetId: 'asset-payment-api',
    assetName: 'Payment API',
    exposure: 'Internet Exposed',
    exploitAvailable: true,
    riskScore: 87,
    priority: 'Immediate',
    status: 'Open',
    discoveredDate: '2026-08-26',
    description:
      'A deserialization vulnerability in the third-party payment gateway library used by the Payment API permits unauthenticated remote code execution on the host.',
    businessImpact:
      'Financial fraud, transaction manipulation and breach of PCI DSS obligations, plus exposure of cardholder data flows.',
    recommendedAction:
      'Patch the payment gateway library immediately, place the API behind a WAF and enforce strict rate limiting on exposed endpoints.',
    remediationSteps: [
      'Deploy the patched payment gateway library version',
      'Add web application firewall rules for the API',
      'Enable anomaly detection on payment traffic',
    ],
  },
  {
    id: 'VULN-003',
    cveId: 'CVE-2026-0543',
    title: 'Default Administrator Credentials on Web Admin Console',
    severity: 'Critical',
    cvss: 9.4,
    assetId: 'asset-web-server',
    assetName: 'Internet Web Server',
    exposure: 'Internet Exposed',
    exploitAvailable: true,
    riskScore: 76,
    priority: 'Immediate',
    status: 'Open',
    discoveredDate: '2026-08-28',
    description:
      'The administration console of the web server ships with default credentials that remain unchanged, granting full administrative access to anyone on the internet.',
    businessImpact:
      'Full server takeover, website defacement and use of the host as a pivot point into the internal network.',
    recommendedAction:
      'Rotate all default credentials, enforce strong password policy plus MFA, and restrict the admin console to the VPN.',
    remediationSteps: [
      'Rotate default credentials on first login',
      'Move the admin console behind the corporate VPN',
      'Enforce MFA for all administrative accounts',
    ],
  },
  {
    id: 'VULN-004',
    cveId: 'CVE-2026-0873',
    title: 'Insecure Deserialization in API Gateway',
    severity: 'High',
    cvss: 8.8,
    assetId: 'asset-payment-api',
    assetName: 'Payment API',
    exposure: 'Internet Exposed',
    exploitAvailable: false,
    riskScore: 84,
    priority: 'Immediate',
    status: 'In Progress',
    discoveredDate: '2026-08-22',
    description:
      'The API gateway accepts untrusted serialized objects, which may allow an attacker to execute arbitrary code if a compatible gadget chain is present in the classpath.',
    businessImpact:
      'Remote code execution on the API tier could compromise transaction integrity and card data.',
    recommendedAction:
      'Disable deserialization of untrusted data, upgrade the API gateway and monitor for exploit attempts.',
    remediationSteps: [
      'Block untrusted deserialization at the gateway',
      'Upgrade the API gateway to the latest version',
      'Add runtime exploit-detection signatures',
    ],
  },
  {
    id: 'VULN-005',
    cveId: 'CVE-2025-7720',
    title: 'Outdated TLS Configuration on Web Server',
    severity: 'High',
    cvss: 8.1,
    assetId: 'asset-web-server',
    assetName: 'Internet Web Server',
    exposure: 'Internet Exposed',
    exploitAvailable: true,
    riskScore: 72,
    priority: 'High',
    status: 'Open',
    discoveredDate: '2026-08-19',
    description:
      'The web server supports deprecated TLS versions and weak cipher suites, enabling man-in-the-middle decryption of customer traffic.',
    businessImpact:
      'Session hijacking and interception of customer credentials and personal data in transit.',
    recommendedAction:
      'Enforce TLS 1.3, disable weak cipher suites and re-issue certificates with modern key sizes.',
    remediationSteps: ['Enable TLS 1.3 only', 'Remove deprecated cipher suites', 'Schedule quarterly TLS conformance scans'],
  },
  {
    id: 'VULN-006',
    cveId: 'CVE-2025-8812',
    title: 'Unpatched Kernel on Cloud Hypervisor',
    severity: 'High',
    cvss: 7.8,
    assetId: 'asset-cloud-server',
    assetName: 'Cloud Server',
    exposure: 'Restricted',
    exploitAvailable: false,
    riskScore: 68,
    priority: 'High',
    status: 'Open',
    discoveredDate: '2026-08-17',
    description:
      'The hypervisor kernel is several releases behind, missing fixes for known privilege-escalation vulnerabilities.',
    businessImpact:
      'Guest-to-host escape could compromise all hosted workloads sharing the hypervisor.',
    recommendedAction:
      'Schedule a maintenance window to patch the hypervisor kernel and verify VM backups before the upgrade.',
    remediationSteps: ['Back up all VMs', 'Patch hypervisor kernel', 'Run post-patch integrity checks'],
  },
  {
    id: 'VULN-007',
    cveId: 'CVE-2026-0220',
    title: 'Multi-Factor Authentication Bypass in Admin SSO',
    severity: 'Medium',
    cvss: 6.5,
    assetId: 'asset-cloud-server',
    assetName: 'Cloud Server',
    exposure: 'Restricted',
    exploitAvailable: false,
    riskScore: 60,
    priority: 'Medium',
    status: 'In Progress',
    discoveredDate: '2026-08-15',
    description:
      'The single sign-on flow for the cloud admin console accepts session tokens created before MFA enforcement, bypassing second-factor checks.',
    businessImpact:
      'Stolen credentials alone could grant administrative access to the cloud environment.',
    recommendedAction: 'Invalidate pre-MFA sessions, enforce step-up authentication and rotate admin session keys.',
    remediationSteps: ['Invalidate legacy sessions', 'Enforce step-up authentication', 'Rotate session signing keys'],
  },
  {
    id: 'VULN-008',
    cveId: 'CVE-2025-9182',
    title: 'VLAN Segmentation Misconfiguration',
    severity: 'Medium',
    cvss: 6.8,
    assetId: 'asset-internal-network',
    assetName: 'Internal Network',
    exposure: 'Internal',
    exploitAvailable: false,
    riskScore: 55,
    priority: 'Medium',
    status: 'Open',
    discoveredDate: '2026-08-12',
    description:
      'A switch configuration error allows traffic to cross VLAN boundaries between the finance and general user segments.',
    businessImpact:
      'Lateral movement between logical network segments without passing through security controls.',
    recommendedAction: 'Correct the VLAN trunk configuration, apply access lists and verify with a network segmentation test.',
    remediationSteps: ['Audit VLAN trunking config', 'Apply inter-VLAN ACLs', 'Run segmentation validation tests'],
  },
  {
    id: 'VULN-009',
    cveId: 'CVE-2025-6433',
    title: 'Endpoint Protection Exclusion for Legacy Browser',
    severity: 'High',
    cvss: 7.2,
    assetId: 'asset-employee-devices',
    assetName: 'Employee Devices',
    exposure: 'Internal',
    exploitAvailable: true,
    riskScore: 54,
    priority: 'Medium',
    status: 'Open',
    discoveredDate: '2026-08-10',
    description:
      'The endpoint protection agent excludes a legacy browser process from real-time scanning across a large portion of the laptop fleet.',
    businessImpact:
      'Malware delivered through the excluded browser can run undetected and harvest credentials.',
    recommendedAction: 'Remove the scan exclusion, update the legacy browser and force endpoint policy compliance.',
    remediationSteps: ['Remove scan exclusion', 'Upgrade legacy browser', 'Re-scan affected fleet'],
  },
  {
    id: 'VULN-010',
    cveId: 'CVE-2025-7711',
    title: 'Outdated Firmware on Core Network Switches',
    severity: 'High',
    cvss: 7.5,
    assetId: 'asset-internal-network',
    assetName: 'Internal Network',
    exposure: 'Internal',
    exploitAvailable: false,
    riskScore: 52,
    priority: 'Medium',
    status: 'In Progress',
    discoveredDate: '2026-08-08',
    description:
      'Core switches run firmware versions with known denial-of-service and management-plane vulnerabilities.',
    businessImpact:
      'Network outage or switch compromise could take the entire corporate network offline.',
    recommendedAction: 'Upgrade firmware during a planned maintenance window with a tested rollback plan.',
    remediationSteps: ['Stage firmware in staging lab', 'Schedule maintenance window', 'Upgrade with rollback plan'],
  },
  {
    id: 'VULN-011',
    cveId: 'CVE-2026-0104',
    title: 'Unpatched Browser Plugin Across Endpoints',
    severity: 'Medium',
    cvss: 6.1,
    assetId: 'asset-employee-devices',
    assetName: 'Employee Devices',
    exposure: 'Internal',
    exploitAvailable: true,
    riskScore: 48,
    priority: 'Medium',
    status: 'Open',
    discoveredDate: '2026-08-05',
    description:
      'A widely deployed browser plugin is missing the latest security update, with a publicly documented exploit for the installed version.',
    businessImpact:
      'Drive-by download and credential theft when employees browse during normal business.',
    recommendedAction: 'Push the plugin update through the software management tool and block the vulnerable version.',
    remediationSteps: ['Push plugin update', 'Block vulnerable versions', 'Confirm fleet coverage'],
  },
  {
    id: 'VULN-012',
    cveId: 'CVE-2026-0331',
    title: 'Sensitive Data Logged in Application Logs',
    severity: 'Medium',
    cvss: 5.9,
    assetId: 'asset-cust-db',
    assetName: 'Customer Database',
    exposure: 'Internal',
    exploitAvailable: false,
    riskScore: 42,
    priority: 'Low',
    status: 'In Progress',
    discoveredDate: '2026-08-02',
    description:
      'The application writes customer identifiers and partial payment details to plain-text application logs retained for 180 days.',
    businessImpact:
      'A log repository compromise leaks customer data and increases DPDP Act exposure.',
    recommendedAction: 'Redact sensitive fields from logs, shorten retention and restrict log-repository access.',
    remediationSteps: ['Add log redaction rules', 'Reduce retention period', 'Restrict log access'],
  },
];

export const vulnerabilitySummary = {
  total: 61,
  critical: 8,
  high: 17,
  medium: 24,
  low: 12,
  remediated: 18,
  open: 31,
  inProgress: 12,
  remediationProgress: 29.5, // %
};
