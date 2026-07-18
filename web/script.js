const QUICK_TAGS = ["寫程式", "繪圖", "寫作", "影片", "翻譯", "配音", "簡報", "搜尋"];
const PAGE_SIZE = 10;

const searchInput = document.getElementById("search-input");
const clearBtn = document.getElementById("clear-btn");
const searchSuggestionsEl = document.getElementById("search-suggestions");
const resultsGrid = document.getElementById("results-grid");
const resultsCount = document.getElementById("results-count");
const emptyState = document.getElementById("empty-state");
const sortSelect = document.getElementById("sort-select");
const quickTagsEl = document.getElementById("quick-tags");
const watchlistInput = document.getElementById("watchlist-input");
const watchlistAddBtn = document.getElementById("watchlist-add-btn");
const watchlistChipsEl = document.getElementById("watchlist-chips");
const watchlistOnlyEl = document.getElementById("watchlist-only");
const featuredSection = document.getElementById("featured-section");
const featuredGrid = document.getElementById("featured-grid");
const scrollSentinel = document.getElementById("scroll-sentinel");
const scrollStatus = document.getElementById("scroll-status");

let watchlistKeywords = getWatchlist();
let displayLimit = PAGE_SIZE;
let suggestionActiveIndex = -1;
let quickTags = [];
let scrollObserver = null;

let SEARCH_TERMS = [];

function buildQuickTags() {
  quickTags = [...QUICK_TAGS];
}

function buildSearchTerms() {
  const terms = new Set(quickTags);
  for (const tool of AI_TOOLS) {
    terms.add(tool.name);
    tool.category.split(/\s+/).forEach((t) => terms.add(t));
    tool.tags.forEach((t) => terms.add(t));
    tool.keywords.forEach((t) => terms.add(t));
  }
  SEARCH_TERMS = [...terms].sort((a, b) => a.localeCompare(b, "zh-TW"));
}

function scoreTool(tool, query) {
  if (!query) return 0;

  const q = normalize(query);
  const terms = q.split(/\s+/).filter(Boolean);
  let score = 0;

  const fields = [
    { text: tool.name, weight: 10 },
    { text: tool.category, weight: 8 },
    { text: tool.description, weight: 5 },
    { text: tool.bestFor, weight: 6 },
    { text: tool.tags.join(" "), weight: 7 },
    { text: tool.keywords.join(" "), weight: 9 },
  ];

  for (const term of terms) {
    for (const { text, weight } of fields) {
      const normalized = normalize(text);
      if (normalized === term) score += weight * 3;
      else if (normalized.includes(term)) score += weight;
    }
  }

  return score;
}

function getMatchedTags(tool, query) {
  if (!query) return new Set();
  const q = normalize(query);
  const matched = new Set();
  for (const tag of tool.tags) {
    if (normalize(tag).includes(q) || q.includes(normalize(tag))) {
      matched.add(tag);
    }
  }
  for (const kw of tool.keywords) {
    if (normalize(kw).includes(q)) {
      matched.add(kw);
    }
  }
  return matched;
}

function searchTools(query, sortBy, watchlistOnly) {
  const trimmed = query.trim();
  const keywords = watchlistKeywords;

  let results = AI_TOOLS.map((tool) => ({
    tool,
    score: scoreTool(tool, trimmed),
    matchedTags: getMatchedTags(tool, trimmed),
    watchMatch: toolMatchesWatchlist(tool, keywords),
  }));

  if (watchlistOnly && keywords.length) {
    results = results.filter((r) => r.watchMatch);
  }

  if (trimmed) {
    results = results.filter((r) => r.score > 0);
    results.sort((a, b) => {
      if (sortBy === "rating") return b.tool.rating - a.tool.rating;
      if (sortBy === "name") return a.tool.name.localeCompare(b.tool.name, "zh-TW");
      return b.score - a.score || b.tool.rating - a.tool.rating;
    });
  } else {
    results.sort((a, b) => {
      if (sortBy === "rating") return b.tool.rating - a.tool.rating;
      if (sortBy === "name") return a.tool.name.localeCompare(b.tool.name, "zh-TW");
      return b.tool.rating - a.tool.rating;
    });
  }

  return results;
}

function getSuggestions(query) {
  const q = normalize(query);
  if (!q) return [];

  const scored = SEARCH_TERMS.map((term) => {
    const n = normalize(term);
    let score = 0;
    if (n.startsWith(q)) score += 10;
    else if (n.includes(q)) score += 5;
    else return null;
    return { term, score };
  }).filter(Boolean);

  scored.sort((a, b) => b.score - a.score || a.term.localeCompare(b.term, "zh-TW"));
  return scored.slice(0, 12).map((s) => s.term);
}

function highlightTerm(text, query) {
  const q = query.trim();
  if (!q) return text;
  const idx = normalize(text).indexOf(normalize(q));
  if (idx === -1) return text;
  return (
    text.slice(0, idx) +
    `<mark>${text.slice(idx, idx + q.length)}</mark>` +
    text.slice(idx + q.length)
  );
}

function renderSuggestions(query) {
  const suggestions = getSuggestions(query);
  suggestionActiveIndex = -1;

  if (!query.trim() || !suggestions.length) {
    searchSuggestionsEl.hidden = true;
    searchSuggestionsEl.innerHTML = "";
    return;
  }

  searchSuggestionsEl.innerHTML = suggestions
    .map(
      (term, i) =>
        `<li><button type="button" class="search-suggestion-item" data-term="${term}" data-index="${i}">${highlightTerm(term, query)}</button></li>`
    )
    .join("");
  searchSuggestionsEl.hidden = false;
}

function hideSuggestions() {
  searchSuggestionsEl.hidden = true;
  suggestionActiveIndex = -1;
}

function applySearch(term, saveToWatchlist = false) {
  searchInput.value = term;
  if (saveToWatchlist && term.trim()) {
    addWatchKeyword(term, { silent: true });
  }
  document.querySelectorAll(".tag-btn").forEach((b) => {
    b.classList.toggle("active", b.textContent === term.trim());
  });
  displayLimit = PAGE_SIZE;
  hideSuggestions();
  render(term);
  searchInput.focus();
}

function renderStars(rating) {
  return "★".repeat(Math.round(rating)) + " " + rating.toFixed(1);
}

function renderFeaturedCard(tool) {
  const ev = TOP_TIER_EVALUATIONS[tool.id];
  if (!ev) return "";

  const pros = ev.pros.map((p) => `<li>${p}</li>`).join("");
  const cons = ev.cons.map((c) => `<li>${c}</li>`).join("");

  return `
    <article class="featured-card">
      <div class="featured-card-header">
        <span class="featured-name">${tool.name}</span>
        <span class="tool-rating">${renderStars(tool.rating)}</span>
      </div>
      <p class="featured-source"><strong>官網重點：</strong>${ev.sourceSummary}</p>
      <p class="tool-desc">${tool.description}</p>
      <p><strong>優點</strong></p>
      <ul class="featured-eval-list">${pros}</ul>
      <p><strong>限制</strong></p>
      <ul class="featured-eval-list">${cons}</ul>
      <p class="featured-verdict">評估：${ev.verdict}</p>
      <div class="tool-actions">
        <a href="tool.html?id=${tool.id}" class="btn btn-secondary">查看詳情</a>
        <a href="${tool.url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">前往官網</a>
      </div>
    </article>
  `;
}

function renderFeatured() {
  const tools = TOP_TIER_IDS.map((id) => getToolById(id)).filter(Boolean);
  featuredGrid.innerHTML = tools.map(renderFeaturedCard).join("");
}

function renderCard({ tool, matchedTags, watchMatch }) {
  const tagsHtml = tool.tags
    .map((tag) => {
      const cls = matchedTags.has(tag) ? "tool-tag highlight" : "tool-tag";
      return `<span class="${cls}">${tag}</span>`;
    })
    .join("");

  const watchClass = watchMatch ? " tool-card-watched" : "";

  return `
    <article class="tool-card${watchClass}">
      <div class="tool-card-header">
        <span class="tool-name">${tool.name}</span>
        <span class="tool-rating">${renderStars(tool.rating)}</span>
      </div>
      <span class="tool-category">${tool.category}</span>
      <p class="tool-desc">${tool.description}</p>
      <div class="tool-tags">${tagsHtml}</div>
      <p class="tool-best-for">最適合：${tool.bestFor}</p>
      <div class="tool-footer">
        <span class="tool-pricing">${tool.pricing}</span>
      </div>
      <div class="tool-actions">
        <a href="tool.html?id=${tool.id}" class="btn btn-secondary">查看詳情</a>
        <a href="${tool.url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">前往官網</a>
      </div>
    </article>
  `;
}

function renderWatchlistChips() {
  watchlistChipsEl.innerHTML = watchlistKeywords
    .map(
      (kw) =>
        `<span class="watchlist-chip">
          <button type="button" class="watchlist-chip-label" data-kw="${kw}">${kw}</button>
          <button type="button" class="watchlist-remove" data-kw="${kw}" aria-label="移除 ${kw}">✕</button>
        </span>`
    )
    .join("");

  watchlistChipsEl.hidden = watchlistKeywords.length === 0;
}

function addWatchKeyword(raw, { silent = false } = {}) {
  const kw = raw.trim();
  if (!kw) return false;
  if (watchlistKeywords.includes(kw)) return false;
  if (watchlistKeywords.length >= WATCHLIST_MAX) {
    if (!silent) alert(`最多 ${WATCHLIST_MAX} 個追蹤關鍵字`);
    return false;
  }
  watchlistKeywords.push(kw);
  saveWatchlist(watchlistKeywords);
  renderWatchlistChips();
  render(searchInput.value);
  return true;
}

function removeWatchKeyword(kw) {
  watchlistKeywords = watchlistKeywords.filter((k) => k !== kw);
  saveWatchlist(watchlistKeywords);
  renderWatchlistChips();
  render(searchInput.value);
}

function loadMoreResults() {
  const sortBy = sortSelect.value;
  const watchlistOnly = watchlistOnlyEl.checked;
  const results = searchTools(searchInput.value, sortBy, watchlistOnly);
  if (displayLimit >= results.length) return false;
  displayLimit = Math.min(displayLimit + PAGE_SIZE, results.length);
  return true;
}

function setupInfiniteScroll() {
  if (!scrollSentinel) return;
  if (scrollObserver) scrollObserver.disconnect();

  scrollObserver = new IntersectionObserver(
    (entries) => {
      if (!entries[0]?.isIntersecting) return;
      const loaded = loadMoreResults();
      if (loaded) render(searchInput.value, { preserveScroll: true });
    },
    { root: null, rootMargin: "240px", threshold: 0 }
  );

  scrollObserver.observe(scrollSentinel);
}

function render(query, { preserveScroll = false } = {}) {
  const scrollY = preserveScroll ? window.scrollY : null;
  const sortBy = sortSelect.value;
  const watchlistOnly = watchlistOnlyEl.checked;
  const results = searchTools(query, sortBy, watchlistOnly);
  const trimmed = query.trim();
  const showFeatured = !trimmed && !watchlistOnly;

  featuredSection.hidden = !showFeatured;
  if (showFeatured) renderFeatured();

  const visible = results.slice(0, displayLimit);
  resultsGrid.innerHTML = visible.map(renderCard).join("");

  const count = results.length;
  const shown = visible.length;
  const hasMore = count > displayLimit;

  scrollStatus.hidden = !hasMore;
  scrollStatus.textContent = hasMore
    ? `向下捲動自動載入（已顯示 ${shown} / ${count}）`
    : "";
  scrollSentinel.hidden = !hasMore;

  if (watchlistOnly && watchlistKeywords.length) {
    resultsCount.innerHTML = `追蹤 <strong>${watchlistKeywords.join("、")}</strong>：顯示 <strong>${shown}</strong> / ${count} 個工具`;
  } else if (trimmed) {
    resultsCount.innerHTML = `找到 <strong>${count}</strong> 個與「${trimmed}」相關的工具（已顯示 ${shown}）`;
  } else if (shown >= count) {
    resultsCount.innerHTML = `顯示全部 <strong>${count}</strong> 個 AI 工具`;
  } else {
    resultsCount.innerHTML = `顯示 <strong>${shown}</strong> / ${count} 個 AI 工具 · 向下捲動載入更多`;
  }

  emptyState.hidden = count > 0;
  resultsGrid.hidden = count === 0;
  clearBtn.hidden = !trimmed;

  if (preserveScroll && scrollY !== null) {
    window.scrollTo(0, scrollY);
  }

  setupInfiniteScroll();
}

function initQuickTags() {
  quickTagsEl.querySelectorAll(".tag-btn").forEach((btn) => btn.remove());
  for (const tag of quickTags) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tag-btn";
    btn.textContent = tag;
    btn.addEventListener("click", () => {
      applySearch(tag, true);
    });
    quickTagsEl.appendChild(btn);
  }
}

function persistWatchlistInput() {
  const kw = watchlistInput.value.trim();
  if (!kw) return;
  if (addWatchKeyword(kw)) {
    watchlistInput.value = "";
  }
}

watchlistAddBtn.addEventListener("click", () => {
  persistWatchlistInput();
  watchlistInput.focus();
});

watchlistInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    persistWatchlistInput();
  }
});

watchlistInput.addEventListener("blur", () => {
  persistWatchlistInput();
});

watchlistChipsEl.addEventListener("click", (e) => {
  const removeBtn = e.target.closest(".watchlist-remove");
  if (removeBtn) {
    removeWatchKeyword(removeBtn.dataset.kw);
    return;
  }
  const labelBtn = e.target.closest(".watchlist-chip-label");
  if (labelBtn) {
    applySearch(labelBtn.dataset.kw, false);
  }
});

watchlistOnlyEl.addEventListener("change", () => {
  displayLimit = PAGE_SIZE;
  render(searchInput.value);
});

searchSuggestionsEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".search-suggestion-item");
  if (btn) applySearch(btn.dataset.term, true);
});

let debounceTimer;
searchInput.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    displayLimit = PAGE_SIZE;
    renderSuggestions(searchInput.value);
    document.querySelectorAll(".tag-btn").forEach((b) => {
      b.classList.toggle("active", b.textContent === searchInput.value.trim());
    });
    render(searchInput.value);
  }, 150);
});

searchInput.addEventListener("keydown", (e) => {
  const items = searchSuggestionsEl.querySelectorAll(".search-suggestion-item");

  if (e.key === "ArrowDown" && items.length) {
    e.preventDefault();
    suggestionActiveIndex = Math.min(suggestionActiveIndex + 1, items.length - 1);
    items.forEach((el, i) => el.classList.toggle("active", i === suggestionActiveIndex));
    return;
  }

  if (e.key === "ArrowUp" && items.length) {
    e.preventDefault();
    suggestionActiveIndex = Math.max(suggestionActiveIndex - 1, 0);
    items.forEach((el, i) => el.classList.toggle("active", i === suggestionActiveIndex));
    return;
  }

  if (e.key === "Enter") {
    if (suggestionActiveIndex >= 0 && items[suggestionActiveIndex]) {
      e.preventDefault();
      applySearch(items[suggestionActiveIndex].dataset.term, true);
      return;
    }
    const term = searchInput.value.trim();
    if (term) {
      addWatchKeyword(term, { silent: true });
      hideSuggestions();
    }
  }

  if (e.key === "Escape") hideSuggestions();
});

searchInput.addEventListener("focus", () => {
  renderSuggestions(searchInput.value);
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".search-box")) hideSuggestions();
});

clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  document.querySelectorAll(".tag-btn").forEach((b) => b.classList.remove("active"));
  displayLimit = PAGE_SIZE;
  hideSuggestions();
  render("");
  searchInput.focus();
});

sortSelect.addEventListener("change", () => render(searchInput.value));

function initApp() {
  buildQuickTags();
  buildSearchTerms();
  initQuickTags();
  renderFeatured();
  renderWatchlistChips();
  render("");
}

loadCatalog()
  .then(initApp)
  .catch(() => {
    resultsCount.textContent = "工具目錄載入失敗，請重新整理頁面";
    emptyState.hidden = false;
    emptyState.querySelector("h2").textContent = "無法載入工具資料";
    emptyState.querySelector("p").textContent = "請確認網路連線後重新整理";
  });
