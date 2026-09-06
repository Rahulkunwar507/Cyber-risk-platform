/**
 * Tiny cross-page plan store — carries the AI Advisor's recommended
 * actions into the Investment Optimizer. In a full-stack build this
 * hand-off would travel through the backend (e.g. POST /api/plans);
 * localStorage keeps the demo flow working statically.
 */

const KEY = 'cyberrisk-ai-plan';
let cache = null;
const listeners = new Set();

const read = () => {
  if (cache === null) {
    try {
      cache = JSON.parse(localStorage.getItem(KEY));
    } catch {
      cache = null;
    }
  }
  return cache;
};

const emit = () => listeners.forEach((fn) => fn(read()));

export function getPlan() {
  return read();
}

export function setPlan(plan) {
  cache = plan;
  try {
    localStorage.setItem(KEY, JSON.stringify(plan));
  } catch {
    /* storage unavailable — session-only */
  }
  emit();
}

export function clearPlan() {
  cache = null;
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* noop */
  }
  emit();
}

export function subscribePlan(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
