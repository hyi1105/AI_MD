const QUICK_TAGS = ["寫程式", "繪圖", "寫作", "影片", "翻譯", "配音", "簡報", "搜尋"];

const searchInput = document.getElementById("search-input");
const clearBtn = document.getElementById("clear-btn");
const resultsGrid = document.getElementById("results-grid");
const resultsCount = document.getElementById("results-count");
const emptyState = document.getElementById("empty-state");
const sortSelect = document.getElementById("sort-select");
const quickTagsEl = document.getElementById("quick-tags");
const watchlistInput = document.getElementById("watchlist-input");
const watchlistAddBtn = document.getElementById("watchlist-add-btn");
const watchlistChipsEl = document.getElementById("watchlist-chips");
const watchlistOnlyEl = document.getElementById("watchlist-only");

let watchlistKeywords = getWatchlist();

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

function renderStars(rating) {
  return "★".repeat(Math.round(rating)) + " " + rating.toFixed(1);
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
        `<span class="watchlist-chip">${kw}<button type="button" class="watchlist-remove" data-kw="${kw}" aria-label="移除 ${kw}">✕</button></span>`
    )
    .join("");

  watchlistChipsEl.hidden = watchlistKeywords.length === 0;
}

function addWatchKeyword(raw) {
  const kw = raw.trim();
  if (!kw) return;
  if (watchlistKeywords.includes(kw)) return;
  if (watchlistKeywords.length >= WATCHLIST_MAX) {
    alert(`最多 ${WATCHLIST_MAX} 個追蹤關鍵字`);
    return;
  }
  watchlistKeywords.push(kw);
  saveWatchlist(watchlistKeywords);
  renderWatchlistChips();
  render(searchInput.value);
}

function removeWatchKeyword(kw) {
  watchlistKeywords = watchlistKeywords.filter((k) => k !== kw);
  saveWatchlist(watchlistKeywords);
  renderWatchlistChips();
  render(searchInput.value);
}

function render(query) {
  const sortBy = sortSelect.value;
  const watchlistOnly = watchlistOnlyEl.checked;
  const results = searchTools(query, sortBy, watchlistOnly);

  resultsGrid.innerHTML = results.map(renderCard).join("");

  const count = results.length;
  const trimmed = query.trim();

  if (watchlistOnly && watchlistKeywords.length) {
    resultsCount.innerHTML = `追蹤 <strong>${watchlistKeywords.join("、")}</strong>：顯示 <strong>${count}</strong> 個工具`;
  } else if (trimmed) {
    resultsCount.innerHTML = `找到 <strong>${count}</strong> 個與「${trimmed}」相關的工具`;
  } else {
    resultsCount.innerHTML = `顯示全部 <strong>${count}</strong> 個 AI 工具`;
  }

  emptyState.hidden = count > 0;
  resultsGrid.hidden = count === 0;
  clearBtn.hidden = !trimmed;
}

function initQuickTags() {
  for (const tag of QUICK_TAGS) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tag-btn";
    btn.textContent = tag;
    btn.addEventListener("click", () => {
      searchInput.value = tag;
      document.querySelectorAll(".tag-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      render(tag);
      searchInput.focus();
    });
    quickTagsEl.appendChild(btn);
  }
}

watchlistAddBtn.addEventListener("click", () => {
  addWatchKeyword(watchlistInput.value);
  watchlistInput.value = "";
  watchlistInput.focus();
});

watchlistInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addWatchKeyword(watchlistInput.value);
    watchlistInput.value = "";
  }
});

watchlistChipsEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".watchlist-remove");
  if (btn) removeWatchKeyword(btn.dataset.kw);
});

watchlistOnlyEl.addEventListener("change", () => render(searchInput.value));

let debounceTimer;
searchInput.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    document.querySelectorAll(".tag-btn").forEach((b) => {
      b.classList.toggle("active", b.textContent === searchInput.value.trim());
    });
    render(searchInput.value);
  }, 200);
});

clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  document.querySelectorAll(".tag-btn").forEach((b) => b.classList.remove("active"));
  render("");
  searchInput.focus();
});

sortSelect.addEventListener("change", () => render(searchInput.value));

initQuickTags();
renderWatchlistChips();
render("");
