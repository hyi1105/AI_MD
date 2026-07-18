const WATCHLIST_KEY = "ai_md_watchlist";
const WATCHLIST_MAX = 20;
const THEME_KEY = "ai_md_theme";

function getStoredTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch (_) {}
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function updateThemeToggleButton(theme) {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;
  const isDark = theme === "dark";
  btn.setAttribute("aria-label", isDark ? "切換至淺色背景" : "切換至深色背景");
  btn.setAttribute("title", isDark ? "淺色背景" : "深色背景");
  btn.textContent = isDark ? "☀️" : "🌙";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (_) {}
  updateThemeToggleButton(theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  applyTheme(current === "dark" ? "light" : "dark");
}

function initTheme() {
  applyTheme(getStoredTheme());
  document.getElementById("theme-toggle")?.addEventListener("click", toggleTheme);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTheme);
} else {
  initTheme();
}

function getWatchlist() {
  try {
    const raw = localStorage.getItem(WATCHLIST_KEY);
    const data = raw ? JSON.parse(raw) : { keywords: [] };
    return Array.isArray(data.keywords) ? data.keywords : [];
  } catch {
    return [];
  }
}

function saveWatchlist(keywords) {
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify({ keywords }));
}

function normalize(text) {
  return String(text).toLowerCase().trim();
}

function toolMatchesTerm(tool, term) {
  if (!term) return false;
  const q = normalize(term);
  const fields = [
    tool.name,
    tool.category,
    tool.description,
    tool.bestFor,
    tool.tags.join(" "),
    tool.keywords.join(" "),
  ];
  return fields.some((text) => normalize(text).includes(q));
}

function toolMatchesWatchlist(tool, keywords) {
  if (!keywords.length) return false;
  return keywords.some((kw) => toolMatchesTerm(tool, kw));
}

function getToolById(id) {
  return AI_TOOLS.find((t) => t.id === id);
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}
