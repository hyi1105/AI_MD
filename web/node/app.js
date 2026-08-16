(() => {
  const DB_NAME = "seed-personal-node";
  const DB_VER = 1;
  const STORE = "bundle";
  const KEY = "main";

  const els = {
    nodeId: document.getElementById("node-id"),
    deviceRole: document.getElementById("device-role"),
    storeStat: document.getElementById("store-stat"),
    status: document.getElementById("status"),
    caseStatus: document.getElementById("case-status"),
    thread: document.getElementById("thread"),
    leaveType: document.getElementById("leave-type"),
    msgInput: document.getElementById("msg-input"),
    btnExport: document.getElementById("btn-export"),
    importFile: document.getElementById("import-file"),
    btnReset: document.getElementById("btn-reset"),
    btnSend: document.getElementById("btn-send"),
    btnSubmit: document.getElementById("btn-submit"),
    btnApprove: document.getElementById("btn-approve"),
    btnReturn: document.getElementById("btn-return"),
  };

  const STATUS_LABEL = {
    draft: "草稿",
    submitted: "已送出",
    approved: "已核准",
    returned: "已退回",
  };

  function uid(prefix) {
    return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function setStatus(text, isError = false) {
    els.status.textContent = text;
    els.status.classList.toggle("error", isError);
  }

  function openDb() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VER);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function loadBundle() {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).get(KEY);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  async function saveBundle(bundle) {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).put(bundle, KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async function clearBundle() {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).delete(KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  function freshBundle() {
    return {
      schema: "seed-personal-node/v1",
      nodeId: uid("node"),
      deviceRole: "daily",
      updatedAt: nowIso(),
      case: {
        status: "draft",
        leaveType: "",
        messages: [
          {
            id: uid("msg"),
            kind: "system",
            text: "節點已建立。簽核與對話只存在這台裝置；平台伺服器沒有這份資料。",
            at: nowIso(),
          },
        ],
      },
    };
  }

  let state = null;

  function render() {
    els.nodeId.textContent = state.nodeId;
    els.deviceRole.value = state.deviceRole || "daily";
    els.leaveType.value = state.case.leaveType || "";
    els.caseStatus.textContent = STATUS_LABEL[state.case.status] || state.case.status;
    els.storeStat.textContent = `${state.case.messages.length} 則訊息 · 更新 ${state.updatedAt}`;

    els.thread.replaceChildren();
    for (const m of state.case.messages) {
      const div = document.createElement("div");
      div.className = m.kind === "system" ? "bubble system" : "bubble";
      if (m.kind === "system") {
        div.textContent = m.text;
      } else {
        const who = document.createElement("span");
        who.className = "who";
        who.textContent = m.who || "成員";
        const body = document.createElement("span");
        body.textContent = m.text;
        const when = document.createElement("span");
        when.className = "when";
        when.textContent = m.at;
        div.append(who, body, when);
      }
      els.thread.appendChild(div);
    }
    els.thread.scrollTop = els.thread.scrollHeight;
  }

  async function persist(note) {
    state.updatedAt = nowIso();
    await saveBundle(state);
    render();
    if (note) setStatus(note);
  }

  function pushSystem(text) {
    state.case.messages.push({
      id: uid("msg"),
      kind: "system",
      text,
      at: nowIso(),
    });
  }

  function pushUser(who, text) {
    state.case.messages.push({
      id: uid("msg"),
      kind: "user",
      who,
      text,
      at: nowIso(),
    });
  }

  els.deviceRole.addEventListener("change", () => {
    state.deviceRole = els.deviceRole.value;
    void persist(
      state.deviceRole === "always-on"
        ? "已標成常開存取機（適合一直開著的過期手機）"
        : "已標成日常手機"
    );
  });

  els.leaveType.addEventListener("change", () => {
    state.case.leaveType = els.leaveType.value;
    void persist("假別已寫入本機節點");
  });

  els.btnSend.addEventListener("click", () => {
    const text = els.msgInput.value.trim();
    if (!text) {
      setStatus("請先輸入訊息", true);
      return;
    }
    pushUser("申請人", text);
    els.msgInput.value = "";
    void persist("訊息已存進本機節點（未上傳伺服器）");
  });

  els.btnSubmit.addEventListener("click", () => {
    if (!state.case.leaveType) {
      setStatus("請先選假別", true);
      return;
    }
    state.case.status = "submitted";
    pushSystem(`申請已送出（假別：${state.case.leaveType}）。狀態只在節點上。`);
    void persist("已送出申請（本機）");
  });

  els.btnApprove.addEventListener("click", () => {
    if (state.case.status !== "submitted") {
      setStatus("要先送出申請才能核准", true);
      return;
    }
    state.case.status = "approved";
    pushUser("簽核人", "核准");
    pushSystem("案件已核准。整段紀錄仍只在節點庫。");
    void persist("已核准（本機）");
  });

  els.btnReturn.addEventListener("click", () => {
    if (state.case.status !== "submitted") {
      setStatus("要先送出申請才能退回", true);
      return;
    }
    state.case.status = "returned";
    pushUser("簽核人", "退回，請修改後再送");
    pushSystem("案件已退回。");
    void persist("已退回（本機）");
  });

  els.btnExport.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `seed-node-${state.nodeId}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    setStatus("已匯出同步包——可拿到常開的過期手機／另一瀏覽器匯入");
  });

  els.importFile.addEventListener("change", async () => {
    const file = els.importFile.files?.[0];
    els.importFile.value = "";
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!data?.schema || !data?.nodeId || !data?.case) {
        throw new Error("格式不符");
      }
      state = data;
      await persist("已匯入同步包到本機節點");
    } catch (err) {
      setStatus(`匯入失敗：${err.message || err}`, true);
    }
  });

  els.btnReset.addEventListener("click", async () => {
    if (!window.confirm("確定清空這台裝置上的節點資料？")) return;
    await clearBundle();
    state = freshBundle();
    await persist("已重建空節點（僅本機）");
  });

  (async () => {
    try {
      const existing = await loadBundle();
      state = existing?.nodeId ? existing : freshBundle();
      if (!existing?.nodeId) await saveBundle(state);
      render();
      setStatus("已載入本機節點。平台連線層不持有主資料。");
    } catch (err) {
      setStatus(`無法開啟本機庫：${err.message || err}`, true);
    }
  })();
})();
