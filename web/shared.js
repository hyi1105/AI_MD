const WATCHLIST_KEY = "ai_md_watchlist";
const WATCHLIST_MAX = 20;

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
