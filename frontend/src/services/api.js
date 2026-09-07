const API_BASE = "http://localhost:8000";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

export async function getDashboard() {
  return request("/api/dashboard");
}

export async function getAssets() {
  return request("/api/assets");
}

export async function getAsset(id) {
  return request(`/api/assets/${id}`);
}

export async function getVulnerabilities() {
  return request("/api/vulnerabilities");
}

export async function getVulnerability(id) {
  return request(`/api/vulnerabilities/${id}`);
}

export async function getVulnerabilitiesByAsset(assetId) {
  return request(`/api/vulnerabilities?assetId=${assetId}`);
}

export async function getVulnerabilitySummary() {
  return request("/api/vulnerabilities/summary");
}

export async function getAIRecommendation(assetId) {
  return request("/api/ai/recommend", {
    method: "POST",
    body: JSON.stringify({ assetId }),
  });
}

export async function getInvestmentOptions() {
  return request("/api/optimizer/options");
}

export async function getNotifications() {
  return request("/api/notifications");
}
