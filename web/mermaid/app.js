import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";

const STORAGE_KEY = "seed-mermaid-source-v1";

const SAMPLES = {
  approval: `flowchart TD
  A[申請人填單] --> B{必填齊了?}
  B -->|否| A
  B -->|是| C[送出申請]
  C --> D[主管簽核]
  D --> E{通過?}
  E -->|退回| A
  E -->|通過| F{還要下一關?}
  F -->|是| D
  F -->|否| G[結案／入檔]`,
  sequence: `sequenceDiagram
  participant U as 使用者
  participant W as 網頁
  participant A as API
  U->>W: 送出申請
  W->>A: POST /submit
  A-->>W: 已受理
  W-->>U: 顯示已送出`,
  lr: `flowchart LR
  A[素材] --> B[整理]
  B --> C[知識書]
  C --> D[分享／關注]`,
};

const els = {
  source: document.getElementById("source"),
  preview: document.getElementById("preview"),
  status: document.getElementById("status"),
  meta: document.getElementById("render-meta"),
  sampleSelect: document.getElementById("sample-select"),
  btnLoad: document.getElementById("btn-load-sample"),
  btnRender: document.getElementById("btn-render"),
  btnCopy: document.getElementById("btn-copy"),
  btnClear: document.getElementById("btn-clear"),
};

let renderSeq = 0;
let debounceTimer = 0;

mermaid.initialize({
  startOnLoad: false,
  securityLevel: "strict",
  theme: "neutral",
  fontFamily: "Figtree, system-ui, sans-serif",
});

function setStatus(text, isError = false) {
  els.status.textContent = text;
  els.status.classList.toggle("error", isError);
}

function loadInitialSource() {
  const saved = localStorage.getItem(STORAGE_KEY);
  els.source.value = saved && saved.trim() ? saved : SAMPLES.approval;
}

async function renderDiagram() {
  const raw = els.source.value.trim();
  const seq = ++renderSeq;

  if (!raw) {
    els.preview.innerHTML = `<p class="placeholder">左側貼上 Mermaid 語法後會出現流程圖。</p>`;
    setStatus("尚未輸入內容");
    els.meta.textContent = "等待輸入";
    return;
  }

  localStorage.setItem(STORAGE_KEY, els.source.value);

  try {
    const id = `seed-mermaid-${seq}`;
    const { svg } = await mermaid.render(id, raw);
    if (seq !== renderSeq) return;
    els.preview.innerHTML = svg;
    setStatus("繪製完成");
    els.meta.textContent = "已更新";
  } catch (err) {
    if (seq !== renderSeq) return;
    const message = err?.str || err?.message || String(err);
    els.preview.innerHTML = `<pre class="error-box">語法有誤，無法繪製：\n${message}</pre>`;
    setStatus("語法錯誤", true);
    els.meta.textContent = "繪製失敗";
  }
}

function scheduleRender() {
  window.clearTimeout(debounceTimer);
  els.meta.textContent = "輸入中…";
  debounceTimer = window.setTimeout(() => {
    void renderDiagram();
  }, 350);
}

els.btnLoad.addEventListener("click", () => {
  const key = els.sampleSelect.value;
  els.source.value = SAMPLES[key] || SAMPLES.approval;
  void renderDiagram();
});

els.btnRender.addEventListener("click", () => {
  void renderDiagram();
});

els.btnCopy.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(els.source.value);
    setStatus("已複製語法");
  } catch {
    setStatus("複製失敗，請手動選取", true);
  }
});

els.btnClear.addEventListener("click", () => {
  els.source.value = "";
  localStorage.removeItem(STORAGE_KEY);
  void renderDiagram();
});

els.source.addEventListener("input", scheduleRender);

loadInitialSource();
void renderDiagram();
