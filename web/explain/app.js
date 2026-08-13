(() => {
  const STORAGE_KEY = "seed_explain_api_v1";

  const SYSTEM_PROMPT = `你是「說明法」閱讀引擎。用繁體中文。目的：讓人願意讀完、讀懂結構。

硬規則：
1. 輸出純文字樹狀結構（可用 ├── └── │），不要 Markdown 標題牆、不要房間／故事比喻。
2. 父層同行簡短介紹；子層同行用「—」旁註；語氣偏「都在這裡面／放這…」，不要職稱標籤腔。
3. 一次最多 5 條；下一批空一行再列，不要重複父層標題。
4. 讀程式／規格時，左邊盡量貼近原文（少用省略）；一層一層——先外層，不要一次倒完全部內層。
5. 若是流程圖／跨系統圖：先系統／角色欄，再時間或步驟圈，再跟一份檔／一條路徑走完。
6. 若是欄位血緣：先「從哪來」，再挑一條欄位從頭走到尾；名字不一致要標出。
7. 不要長篇前言；不要叫使用者「繼續」才給下一批——同則內可接 2～4 批（每批 ≤5）。
8. 若素材不足，只根據現有內容產出，並在最後一行用「（假設）…」標出假設。`;

  const els = {
    tabs: [...document.querySelectorAll(".tab")],
    panelText: document.getElementById("panel-text"),
    panelFile: document.getElementById("panel-file"),
    panelImage: document.getElementById("panel-image"),
    textInput: document.getElementById("text-input"),
    fileInput: document.getElementById("file-input"),
    fileName: document.getElementById("file-name"),
    filePreview: document.getElementById("file-preview"),
    imageInput: document.getElementById("image-input"),
    imageName: document.getElementById("image-name"),
    imagePreview: document.getElementById("image-preview"),
    imageNote: document.getElementById("image-note"),
    focusInput: document.getElementById("focus-input"),
    btnGenerate: document.getElementById("btn-generate"),
    btnNext: document.getElementById("btn-next"),
    btnClear: document.getElementById("btn-clear"),
    btnCopy: document.getElementById("btn-copy"),
    btnSettings: document.getElementById("btn-settings"),
    btnSettingsClose: document.getElementById("btn-settings-close"),
    settingsDialog: document.getElementById("settings-dialog"),
    settingsForm: document.getElementById("settings-form"),
    apiBase: document.getElementById("api-base"),
    apiKey: document.getElementById("api-key"),
    apiModel: document.getElementById("api-model"),
    status: document.getElementById("status"),
    output: document.getElementById("output"),
  };

  let activeTab = "text";
  let fileText = "";
  let fileLabel = "";
  let imageDataUrl = "";
  let imageLabel = "";
  let messages = [];

  function loadSettings() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data.base) els.apiBase.value = data.base;
      if (data.key) els.apiKey.value = data.key;
      if (data.model) els.apiModel.value = data.model;
    } catch (_) {
      /* ignore */
    }
  }

  function saveSettings() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        base: els.apiBase.value.trim().replace(/\/$/, ""),
        key: els.apiKey.value.trim(),
        model: els.apiModel.value.trim(),
      })
    );
  }

  function getSettings() {
    return {
      base: els.apiBase.value.trim().replace(/\/$/, "") || "https://api.openai.com/v1",
      key: els.apiKey.value.trim(),
      model: els.apiModel.value.trim() || "gpt-4o",
    };
  }

  function setStatus(text, isError = false) {
    els.status.textContent = text || "";
    els.status.classList.toggle("error", !!isError);
  }

  function setOutput(text) {
    els.output.textContent = text;
    els.btnCopy.disabled = !text || text.startsWith("還沒產生");
    els.btnNext.disabled = messages.length < 2;
  }

  function switchTab(name) {
    activeTab = name;
    els.tabs.forEach((t) => t.classList.toggle("active", t.dataset.tab === name));
    els.panelText.classList.toggle("hidden", name !== "text");
    els.panelFile.classList.toggle("hidden", name !== "file");
    els.panelImage.classList.toggle("hidden", name !== "image");
  }

  async function readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(reader.error || new Error("讀檔失敗"));
      reader.readAsText(file);
    });
  }

  async function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(reader.error || new Error("讀圖失敗"));
      reader.readAsDataURL(file);
    });
  }

  function buildUserContent({ nextLayer }) {
    const focus = els.focusInput.value.trim();
    const parts = [];

    if (nextLayer) {
      parts.push({
        type: "text",
        text: "請根據上一則說明法輸出，再往下一層展開（一次仍 ≤5 條一批，可接幾批）。左邊更貼近原文。不要重複已講過的外層長文。",
      });
      if (focus) {
        parts.push({ type: "text", text: `這一層焦點：${focus}` });
      }
      return parts.length === 1 ? parts[0].text : parts;
    }

    const header = [
      "請用說明法整理下列素材。",
      focus ? `焦點：${focus}` : "焦點：先給最外層，再往下。",
    ].join("\n");

    if (activeTab === "image") {
      if (!imageDataUrl) throw new Error("請先上傳圖片");
      const note = els.imageNote.value.trim();
      const textBits = [header, `圖片檔名：${imageLabel || "image"}`];
      if (note) textBits.push(`使用者想先看：${note}`);
      return [
        { type: "text", text: textBits.join("\n") },
        { type: "image_url", image_url: { url: imageDataUrl } },
      ];
    }

    let body = "";
    if (activeTab === "file") {
      if (!fileText.trim()) throw new Error("請先上傳文件");
      body = `檔名：${fileLabel}\n\n----- 文件內容 -----\n${fileText}`;
    } else {
      body = els.textInput.value.trim();
      if (!body) throw new Error("請先貼上文字");
    }

    const maxChars = 120000;
    if (body.length > maxChars) {
      body = body.slice(0, maxChars) + "\n\n（內容過長，已截斷）";
    }

    return `${header}\n\n${body}`;
  }

  async function callChat(userContent, { reset } = { reset: true }) {
    const { base, key, model } = getSettings();
    if (!key) {
      els.settingsDialog.showModal();
      throw new Error("請先在 API 設定填入金鑰");
    }

    if (reset) {
      messages = [{ role: "system", content: SYSTEM_PROMPT }];
    }

    messages.push({ role: "user", content: userContent });

    const endpoint = `${base}/chat/completions`;
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        messages,
      }),
    });

    const raw = await res.text();
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      throw new Error(`API 回傳不是 JSON（HTTP ${res.status}）`);
    }

    if (!res.ok) {
      const msg = data?.error?.message || data?.message || raw.slice(0, 240);
      throw new Error(`API 錯誤 ${res.status}：${msg}`);
    }

    const text = data?.choices?.[0]?.message?.content;
    if (!text) throw new Error("API 沒有回傳內容");

    messages.push({ role: "assistant", content: text });
    return text;
  }

  async function generate({ nextLayer }) {
    els.btnGenerate.disabled = true;
    els.btnNext.disabled = true;
    setStatus(nextLayer ? "正在展開下一層…" : "正在呼叫 AI…");
    try {
      const content = buildUserContent({ nextLayer });
      const text = await callChat(content, { reset: !nextLayer });
      setOutput(text);
      setStatus("完成。可按「下一層」繼續往下拆。");
    } catch (err) {
      setStatus(err?.message || String(err), true);
      if (!nextLayer) els.btnNext.disabled = true;
      else els.btnNext.disabled = messages.length < 2;
    } finally {
      els.btnGenerate.disabled = false;
    }
  }

  els.tabs.forEach((tab) => {
    tab.addEventListener("click", () => switchTab(tab.dataset.tab));
  });

  els.fileInput.addEventListener("change", async () => {
    const file = els.fileInput.files?.[0];
    if (!file) return;
    try {
      fileText = await readFileAsText(file);
      fileLabel = file.name;
      els.fileName.textContent = `${file.name}（${fileText.length} 字）`;
      els.filePreview.value = fileText.slice(0, 8000);
    } catch (err) {
      setStatus(err?.message || "讀檔失敗", true);
    }
  });

  els.imageInput.addEventListener("change", async () => {
    const file = els.imageInput.files?.[0];
    if (!file) return;
    try {
      if (file.size > 8 * 1024 * 1024) {
        throw new Error("圖片請小於 8MB（MVP）");
      }
      imageDataUrl = await readFileAsDataUrl(file);
      imageLabel = file.name;
      els.imageName.textContent = file.name;
      els.imagePreview.src = imageDataUrl;
      els.imagePreview.hidden = false;
    } catch (err) {
      setStatus(err?.message || "讀圖失敗", true);
    }
  });

  els.btnSettings.addEventListener("click", () => els.settingsDialog.showModal());
  els.btnSettingsClose.addEventListener("click", () => els.settingsDialog.close());
  els.settingsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    saveSettings();
    els.settingsDialog.close();
    setStatus("API 設定已存在本機。");
  });

  els.btnGenerate.addEventListener("click", () => generate({ nextLayer: false }));
  els.btnNext.addEventListener("click", () => generate({ nextLayer: true }));
  els.btnClear.addEventListener("click", () => {
    messages = [];
    setOutput("還沒產生。先在左側放素材，再按「產生說明法」。");
    setStatus("");
    els.btnNext.disabled = true;
  });

  els.btnCopy.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(els.output.textContent || "");
      setStatus("已複製到剪貼簿。");
    } catch {
      setStatus("複製失敗，請手動選取。", true);
    }
  });

  loadSettings();
  switchTab("text");
})();
