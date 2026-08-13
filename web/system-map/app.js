(() => {
  const NODES = {
    sys: {
      id: "sys",
      name: "簽核／申請",
      depth: 0,
      hint: "整系統",
      children: ["flow", "data"],
      views: {
        flowchart: {
          kicker: "系統邊界",
          body: "外部：申請人提出請假；內部：流程控推進狀態，資料存保管單據與附件。",
        },
        sql: {
          kicker: "Schema 邊界",
          body: "一個業務庫：申請主檔、狀態歷程、附件索引；流程節點以狀態碼串起。",
          code: "-- domain: leave_approval\n-- tables: request, request_status, attachment",
        },
        powerautomate: {
          kicker: "解決方案",
          body: "一個 Solution：觸發來自表單／郵件，動作寫庫、通知、更新簽核鏈。",
        },
        enclosure: {
          kicker: "共用圍籬",
          body: "一個 Shared Enclosure：申請人、簽核人、附件與討論共置；權限隨角色切換。",
        },
      },
    },
    flow: {
      id: "flow",
      name: "流程控",
      depth: 1,
      hint: "誰批、到哪",
      children: ["flow-apply", "flow-approve", "flow-close", "flow-notify"],
      views: {
        flowchart: {
          kicker: "主幹 A",
          body: "提出申請 → 主管簽核 → 結案歸檔；旁路：通知／路由。",
        },
        sql: {
          kicker: "狀態機",
          body: "以 request.status 驅動：draft → pending → approved|rejected → closed。",
          code: "CHECK (status IN ('draft','pending','approved','rejected','closed'))",
        },
        powerautomate: {
          kicker: "控制流",
          body: "Condition／Approve 動作串：通過走核准路徑，退回回申請人。",
        },
        enclosure: {
          kicker: "責任動線",
          body: "圍籬內角色接力：申請人寫入 → 主管批示 → 系統封存；通知掛在邊上。",
        },
      },
    },
    data: {
      id: "data",
      name: "資料存",
      depth: 1,
      hint: "單據與狀態",
      children: ["data-form", "data-status", "data-attach"],
      views: {
        flowchart: {
          kicker: "主幹 B",
          body: "申請單本體、狀態歷程、附件三塊；流程每一步都讀寫這裡。",
        },
        sql: {
          kicker: "實體",
          body: "request（主檔）、request_status（歷程）、attachment（檔案索引）。",
          code: "request 1—N request_status\nrequest 1—N attachment",
        },
        powerautomate: {
          kicker: "資料動作",
          body: "Create／Update row、Get file、Compose 組出簽核卡內容。",
        },
        enclosure: {
          kicker: "共置物件",
          body: "圍籬內可見：紙本欄位、歷程時間線、附件匣；依角色隱藏個人備註。",
        },
      },
    },
    "flow-apply": {
      id: "flow-apply",
      name: "提出申請",
      depth: 2,
      hint: "申請人",
      children: [],
      views: {
        flowchart: { kicker: "起點", body: "申請人填單並送出；進入 pending。" },
        sql: {
          kicker: "INSERT",
          body: "寫入 request，並插一筆 request_status。",
          code: "INSERT INTO request (...)\nVALUES (...);\nINSERT INTO request_status (request_id, status, actor)\nVALUES (@id, 'pending', @applicant);",
        },
        powerautomate: {
          kicker: "Trigger",
          body: "When a form is submitted / When a row is created。",
        },
        enclosure: {
          kicker: "寫入席",
          body: "申請人座位：可編輯欄位＋個人備註；送出後鎖欄。",
        },
      },
    },
    "flow-approve": {
      id: "flow-approve",
      name: "主管簽核",
      depth: 2,
      hint: "簽核人",
      children: [],
      views: {
        flowchart: { kicker: "決策", body: "主管核准或退回；決定下一狀態。" },
        sql: {
          kicker: "UPDATE",
          body: "更新主檔狀態並追加歷程。",
          code: "UPDATE request SET status = @next WHERE id = @id;\nINSERT INTO request_status (...)",
        },
        powerautomate: {
          kicker: "Action",
          body: "Start and wait for an approval → Condition（Approve／Reject）。",
        },
        enclosure: {
          kicker: "批示席",
          body: "簽核人座位：看不到申請人個人備註；可換簽、退回、請簽。",
        },
      },
    },
    "flow-close": {
      id: "flow-close",
      name: "結案歸檔",
      depth: 2,
      hint: "系統",
      children: [],
      views: {
        flowchart: { kicker: "終點", body: "核准後歸檔；單據只讀。" },
        sql: {
          kicker: "CLOSE",
          body: "status = closed；必要時複製到 archive schema。",
          code: "UPDATE request SET status = 'closed', closed_at = NOW()\nWHERE id = @id;",
        },
        powerautomate: {
          kicker: "Terminate",
          body: "Update row → 寄結案通知 → Terminate（Succeeded）。",
        },
        enclosure: {
          kicker: "封存區",
          body: "物件移入封存匣；圍籬改為唯讀成員可視。",
        },
      },
    },
    "flow-notify": {
      id: "flow-notify",
      name: "通知／路由",
      depth: 2,
      hint: "旁路",
      children: [],
      views: {
        flowchart: { kicker: "旁路", body: "每步狀態變更觸發通知與下一簽核人路由。" },
        sql: {
          kicker: "查路由",
          body: "依部門／代理人查下一 approver。",
          code: "SELECT approver_id FROM routing\nWHERE dept = @dept AND active = 1;",
        },
        powerautomate: {
          kicker: "Notify",
          body: "Post message in Teams / Send an email；可並行於主路徑。",
        },
        enclosure: {
          kicker: "門鈴",
          body: "圍籬門鈴：@提及簽核人、對話室貼狀態變更。",
        },
      },
    },
    "data-form": {
      id: "data-form",
      name: "申請單",
      depth: 2,
      hint: "主檔",
      children: [],
      views: {
        flowchart: { kicker: "表單", body: "假別、起訖、事由、申請人；對應紙本欄位。" },
        sql: {
          kicker: "TABLE request",
          body: "主檔欄位。",
          code: "id, applicant_id, leave_type,\nstart_at, end_at, reason, status",
        },
        powerautomate: {
          kicker: "Compose",
          body: "Compose／Select 組出簽核卡顯示欄位。",
        },
        enclosure: {
          kicker: "紙本物件",
          body: "圍籬中央的格式卡：欄位即申請單；與簽核 Demo 格式卡對齊。",
        },
      },
    },
    "data-status": {
      id: "data-status",
      name: "狀態歷程",
      depth: 2,
      hint: "時間線",
      children: [],
      views: {
        flowchart: { kicker: "歷程", body: "每次簽核留下誰、何時、何結果。" },
        sql: {
          kicker: "TABLE request_status",
          body: "不可變歷程列。",
          code: "id, request_id, status, actor_id, note, created_at",
        },
        powerautomate: {
          kicker: "Append",
          body: "每次 Approve／Reject 後 Append to array 或寫列。",
        },
        enclosure: {
          kicker: "時間線牆",
          body: "圍籬側牆：簽名流水線／狀態泡泡。",
        },
      },
    },
    "data-attach": {
      id: "data-attach",
      name: "附件",
      depth: 2,
      hint: "檔案",
      children: [],
      views: {
        flowchart: { kicker: "附件", body: "證明文件掛在單據上，隨流程可見。" },
        sql: {
          kicker: "TABLE attachment",
          body: "檔案索引（本體可在物件儲存）。",
          code: "id, request_id, file_name, storage_url, uploaded_by",
        },
        powerautomate: {
          kicker: "Files",
          body: "Get file content／Create file；附加到核准請求。",
        },
        enclosure: {
          kicker: "附件匣",
          body: "圍籬內共享附件匣；成員依角色下載。",
        },
      },
    },
  };

  const VIEW_META = {
    flowchart: { label: "流程圖", blurb: "看步驟與箭頭" },
    sql: { label: "SQL", blurb: "看表與語句" },
    powerautomate: { label: "Power Automate", blurb: "看觸發與動作" },
    enclosure: { label: "Shared Enclosure", blurb: "看共置空間與席位" },
  };

  const FLOW_ORDER = ["flow-apply", "flow-approve", "flow-close"];
  const state = { view: "flowchart", focus: "sys" };

  const elTree = document.getElementById("tree");
  const elScene = document.getElementById("scene");
  const elViewLabel = document.getElementById("view-label");
  const elFocusLabel = document.getElementById("focus-label");

  function renderTree(id = "sys", container = elTree) {
    const node = NODES[id];
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tree-node" + (state.focus === id ? " is-focus" : "");
    btn.dataset.id = id;
    btn.innerHTML = `<span class="depth-mark">L${node.depth}</span><span class="name">${escapeHtml(node.name)}</span>${
      node.hint ? `<p class="hint">${escapeHtml(node.hint)}</p>` : ""
    }`;
    btn.addEventListener("click", () => {
      state.focus = id;
      sync();
    });
    container.appendChild(btn);
    if (node.children?.length) {
      const wrap = document.createElement("div");
      wrap.className = "tree-children";
      node.children.forEach((cid) => renderTree(cid, wrap));
      container.appendChild(wrap);
    }
  }

  function visibleIds() {
    const focus = NODES[state.focus];
    if (!focus) return ["sys"];
    if (focus.children?.length) return [focus.id, ...focus.children];
    return [focus.id];
  }

  function renderScene() {
    elScene.dataset.view = state.view;
    elScene.classList.remove("is-switching");
    void elScene.offsetWidth;
    elScene.classList.add("is-switching");
    elScene.innerHTML = "";

    const meta = VIEW_META[state.view];
    const title = document.createElement("p");
    title.className = "scene-title";
    title.textContent = `${meta.blurb} · 節點與左側層級對齊（焦點高亮）`;
    elScene.appendChild(title);

    if (state.view === "flowchart") renderFlowchart();
    else if (state.view === "sql") renderCards();
    else if (state.view === "powerautomate") renderPowerAutomate();
    else renderEnclosure();
  }

  function renderFlowchart() {
    if (state.focus === "flow" || state.focus === "sys" || FLOW_ORDER.includes(state.focus)) {
      const row = document.createElement("div");
      row.className = "flow-row";
      FLOW_ORDER.forEach((id, i) => {
        if (i) {
          const arrow = document.createElement("span");
          arrow.className = "flow-arrow";
          arrow.textContent = "→";
          row.appendChild(arrow);
        }
        const step = document.createElement("button");
        step.type = "button";
        step.className = "flow-step" + (state.focus === id ? " is-focus" : "");
        step.textContent = NODES[id].name;
        step.addEventListener("click", () => {
          state.focus = id;
          sync();
        });
        row.appendChild(step);
      });
      elScene.appendChild(row);
    }
    renderCards();
  }

  function renderCards() {
    const wrap = document.createElement("div");
    wrap.className = "cards";
    visibleIds().forEach((id) => {
      const node = NODES[id];
      const v = node.views[state.view];
      const card = document.createElement("article");
      card.className = "card" + (state.focus === id ? " is-focus" : "");
      card.tabIndex = 0;
      card.addEventListener("click", () => {
        state.focus = id;
        sync();
      });
      let html = `<p class="card-kicker">${escapeHtml(v.kicker)} · ${escapeHtml(node.id)}</p>
        <h3>${escapeHtml(node.name)}</h3>`;
      if (v.code) html += `<pre>${escapeHtml(v.code)}</pre>`;
      else html += `<p>${escapeHtml(v.body)}</p>`;
      if (v.code) html += `<p style="margin-top:0.55rem;color:var(--muted);font-size:0.84rem">${escapeHtml(v.body)}</p>`;
      html += `<div class="meta-row"><span class="chip">L${node.depth}</span><span class="chip">${escapeHtml(VIEW_META[state.view].label)}</span></div>`;
      card.innerHTML = html;
      wrap.appendChild(card);
    });
    elScene.appendChild(wrap);
  }

  function renderPowerAutomate() {
    const chain = document.createElement("div");
    chain.className = "pa-chain";
    const ids = visibleIds();
    ids.forEach((id) => {
      const node = NODES[id];
      const v = node.views.powerautomate;
      const kind =
        id === "flow-apply" || id === "sys"
          ? "Trigger"
          : id === "flow-close"
            ? "End"
            : "Action";
      const row = document.createElement("div");
      row.className = "pa-step" + (state.focus === id ? " is-focus" : "");
      row.innerHTML = `<div class="pa-kind">${kind}</div>
        <div>
          <p class="card-kicker">${escapeHtml(v.kicker)} · ${escapeHtml(id)}</p>
          <h3 style="margin:0 0 0.35rem;font-family:var(--display);font-size:1.02rem">${escapeHtml(node.name)}</h3>
          <p style="margin:0;font-size:0.88rem;line-height:1.45">${escapeHtml(v.body)}</p>
        </div>`;
      row.addEventListener("click", () => {
        state.focus = id;
        sync();
      });
      chain.appendChild(row);
    });
    elScene.appendChild(chain);
  }

  function renderEnclosure() {
    const board = document.createElement("div");
    board.className = "enc-board";
    visibleIds().forEach((id) => {
      const node = NODES[id];
      const v = node.views.enclosure;
      const slot = document.createElement("div");
      slot.className = "enc-slot" + (state.focus === id ? " is-focus" : "");
      slot.innerHTML = `<p class="card-kicker">${escapeHtml(v.kicker)}</p>
        <h3>${escapeHtml(node.name)}</h3>
        <p>${escapeHtml(v.body)}</p>`;
      slot.addEventListener("click", () => {
        state.focus = id;
        sync();
      });
      board.appendChild(slot);
    });
    elScene.appendChild(board);
  }

  function sync() {
    elTree.innerHTML = "";
    renderTree();
    elViewLabel.textContent = `視角：${VIEW_META[state.view].label}`;
    elFocusLabel.textContent = `焦點：${NODES[state.focus].name}`;
    renderScene();
    document.querySelectorAll(".view-btn").forEach((btn) => {
      const on = btn.dataset.view === state.view;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-selected", on ? "true" : "false");
    });
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.view = btn.dataset.view;
      sync();
    });
  });

  sync();
})();
