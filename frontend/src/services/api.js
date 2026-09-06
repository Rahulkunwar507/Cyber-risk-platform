import { assets, dashboardSummary, notifications } from '../data/mockData';
import { vulnerabilities, vulnerabilitySummary } from '../data/vulnerabilities';
import { aiRecommendations } from '../data/advisor';
import { investmentOptions } from '../data/optimizer';

/**
 * ─────────────────────────────────────────────────────────────
 * API SERVICE LAYER
 *
 * Every page consumes data exclusively through the functions below.
 * Today they resolve from src/data/* mock modules (with simulated
 * network latency); tomorrow your backend team swaps each
 * implementation for a real fetch() — the UI never changes.
 *
 *   Response contract summary:
 *   GET  /api/dashboard              → getDashboard()
 *   GET  /api/assets                 → getAssets()
 *   GET  /api/assets/:id             → getAsset(id)
 *   GET  /api/vulnerabilities        → getVulnerabilities()
 *   GET  /api/vulnerabilities/:id    → getVulnerability(id)
 *   GET  /api/vulnerabilities?assetId→ getVulnerabilitiesByAsset(assetId)
 *   GET  /api/vulnerabilities/summary→ getVulnerabilitySummary()
 *   POST /api/ai/recommend           → getAIRecommendation(assetId)
 *   GET  /api/optimizer/options      → getInvestmentOptions()
 *   GET  /api/notifications          → getNotifications()
 * ─────────────────────────────────────────────────────────────
 */

const MOCK_LATENCY = { min: 220, max: 620 };
let MOCK_ERROR_RATE = 0; // set > 0 (e.g. configureMock({ errorRate: 0.2 })) to exercise error states

/** Configure the mock transport — dev-only knob, removed with the mock layer. */
export function configureMock({ errorRate, latencyRange } = {}) {
  if (typeof errorRate === 'number') MOCK_ERROR_RATE = Math.max(0, Math.min(1, errorRate));
  if (latencyRange) {
    MOCK_LATENCY.min = latencyRange[0];
    MOCK_LATENCY.max = latencyRange[1];
  }
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const clone = (value) => JSON.parse(JSON.stringify(value)); // JSON round-trip ≈ network serialization

async function mockResponse(payload) {
  const ms = MOCK_LATENCY.min + Math.random() * (MOCK_LATENCY.max - MOCK_LATENCY.min);
  await wait(ms);
  if (Math.random() < MOCK_ERROR_RATE) throw new Error('The API is temporarily unavailable. Please try again.');
  return clone(payload);
}

// ── Dashboard ─────────────────────────────────────────────────
export function getDashboard() {
  // Real backend: return fetch('/api/dashboard').then((r) => r.json());
  return mockResponse(dashboardSummary);
}

// ── Assets ────────────────────────────────────────────────────
export function getAssets() {
  // Real backend: return fetch('/api/assets').then((r) => r.json());
  return mockResponse(assets);
}

export function getAsset(id) {
  // Real backend: return fetch(`/api/assets/${id}`).then((r) => r.json());
  const asset = assets.find((a) => a.id === id);
  if (!asset) return Promise.reject(new Error(`Asset "${id}" was not found.`));
  return mockResponse(asset);
}

// ── Vulnerabilities ───────────────────────────────────────────
export function getVulnerabilities() {
  // Real backend: return fetch('/api/vulnerabilities').then((r) => r.json());
  return mockResponse(vulnerabilities);
}

export function getVulnerability(id) {
  // Real backend: return fetch(`/api/vulnerabilities/${id}`).then((r) => r.json());
  const vuln = vulnerabilities.find((v) => v.id === id);
  if (!vuln) return Promise.reject(new Error(`Vulnerability "${id}" was not found.`));
  return mockResponse(vuln);
}

export function getVulnerabilitiesByAsset(assetId) {
  // Real backend: return fetch(`/api/vulnerabilities?assetId=${assetId}`).then((r) => r.json());
  return mockResponse(vulnerabilities.filter((v) => v.assetId === assetId));
}

export function getVulnerabilitySummary() {
  // Real backend: return fetch('/api/vulnerabilities/summary').then((r) => r.json());
  return mockResponse(vulnerabilitySummary);
}

// ── AI Security Advisor ───────────────────────────────────────
export function getAIRecommendation(assetId) {
  // Real backend:
  //   return fetch('/api/ai/recommend', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ assetId }),
  //   }).then((r) => r.json());
  const rec = aiRecommendations[assetId];
  if (!rec) return Promise.reject(new Error(`No AI analysis available for asset "${assetId}".`));
  return mockResponse(rec);
}

// ── Investment Optimizer ──────────────────────────────────────
export function getInvestmentOptions() {
  // Real backend: return fetch('/api/optimizer/options').then((r) => r.json());
  return mockResponse(investmentOptions);
}

// ── Notifications (top bar) ───────────────────────────────────
export function getNotifications() {
  return mockResponse(notifications);
}
