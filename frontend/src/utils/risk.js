/**
 * Risk scoring helpers — shared vocabulary for the whole UI.
 * Score bands: 0-39 LOW · 40-59 MEDIUM · 60-79 HIGH · 80-100 CRITICAL
 */

export function riskStatus(score) {
  if (score >= 80)
    return {
      label: 'CRITICAL',
      text: 'text-danger',
      bg: 'bg-danger/10',
      border: 'border-danger/30',
      dot: 'bg-danger',
      hex: '#F43F5E',
    };
  if (score >= 60)
    return {
      label: 'HIGH',
      text: 'text-orange',
      bg: 'bg-orange/10',
      border: 'border-orange/30',
      dot: 'bg-orange',
      hex: '#FB923C',
    };
  if (score >= 40)
    return {
      label: 'MEDIUM',
      text: 'text-warning',
      bg: 'bg-warning/10',
      border: 'border-warning/30',
      dot: 'bg-warning',
      hex: '#FBBF24',
    };
  return {
    label: 'LOW',
    text: 'text-success',
    bg: 'bg-success/10',
    border: 'border-success/30',
    dot: 'bg-success',
    hex: '#34D399',
  };
}

export const SEVERITY_STYLES = {
  Critical: { text: 'text-danger', bg: 'bg-danger/10', border: 'border-danger/30', hex: '#F43F5E' },
  High: { text: 'text-orange', bg: 'bg-orange/10', border: 'border-orange/30', hex: '#FB923C' },
  Medium: { text: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/30', hex: '#FBBF24' },
  Low: { text: 'text-info', bg: 'bg-info/10', border: 'border-info/30', hex: '#38BDF8' },
};

export const PRIORITY_STYLES = {
  Immediate: { text: 'text-danger', bg: 'bg-danger/10', border: 'border-danger/30' },
  High: { text: 'text-orange', bg: 'bg-orange/10', border: 'border-orange/30' },
  Medium: { text: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/30' },
  Low: { text: 'text-info', bg: 'bg-info/10', border: 'border-info/30' },
};

export function severityStyle(severity) {
  return SEVERITY_STYLES[severity] || SEVERITY_STYLES.Medium;
}

export function priorityStyle(priority) {
  return PRIORITY_STYLES[priority] || PRIORITY_STYLES.Medium;
}

/** Map arbitrary status strings to a tone used by StatusBadge. */
export const STATUS_TONES = {
  'At Risk': 'danger',
  'Needs Attention': 'orange',
  'Monitoring': 'info',
  'Protected': 'success',
  'Open': 'danger',
  'In Progress': 'warning',
  'Remediated': 'success',
  'Exploit Available': 'danger',
  'No Exploit': 'success',
  'Operational': 'success',
};
