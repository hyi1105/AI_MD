const headerEl = document.getElementById("tool-header");
const contentEl = document.getElementById("tool-content");
const errorEl = document.getElementById("tool-error");

function renderFallback(tool) {
  headerEl.innerHTML = `
    <h2 class="tool-page-title">${tool.name}</h2>
    <p class="tool-page-meta">${tool.category} · ${tool.pricing} · ★ ${tool.rating.toFixed(1)}</p>
    <a href="${tool.url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">前往官網 →</a>
  `;
  contentEl.innerHTML = marked.parse(`
## 簡介

${tool.description}

## 最適合

${tool.bestFor}

## 標籤

${tool.tags.join("、")}
  `);
}

async function loadTool() {
  const id = getQueryParam("id");
  const tool = id ? getToolById(id) : null;

  if (!tool) {
    errorEl.hidden = false;
    headerEl.hidden = true;
    contentEl.hidden = true;
    return;
  }

  document.title = `${tool.name} — AI 工具搜尋`;

  try {
    const res = await fetch(`tools/${id}.md`);
    if (!res.ok) throw new Error("no md");
    const md = await res.text();
    headerEl.innerHTML = `
      <h2 class="tool-page-title">${tool.name}</h2>
      <p class="tool-page-meta">${tool.category} · ${tool.pricing} · ★ ${tool.rating.toFixed(1)}</p>
      <a href="${tool.url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">前往官網 →</a>
    `;
    contentEl.innerHTML = marked.parse(md);
  } catch {
    renderFallback(tool);
  }
}

loadCatalog().then(loadTool).catch(() => {
  errorEl.hidden = false;
  errorEl.textContent = "無法載入工具目錄，請重新整理頁面";
  headerEl.hidden = true;
  contentEl.hidden = true;
});
