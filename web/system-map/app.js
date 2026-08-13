(() => {
  const NODES = {
    sys: {
      id: "sys",
      name: "簽核／申請",
      depth: 0,
      hint: "整系統大板",
      children: ["flow", "data"],
      span: 12,
      trunk: true,
      short: {
        flowchart: "邊界：申請進、結果出",
        sql: "一個業務庫",
        powerautomate: "一個 Solution",
        enclosure: "一個共用圍籬",
      },
      badge: {
        flowchart: "系統",
        sql: "SCHEMA",
        powerautomate: "Solution",
        enclosure: "Enclosure",
      },
    },
    flow: {
      id: "flow",
      name: "流程控",
      depth: 1,
      hint: "誰批、到哪",
      children: ["flow-apply", "flow-approve", "flow-close", "flow-notify"],
      span: 6,
      trunk: true,
      short: {
        flowchart: "申請 → 簽核 → 結案",
        sql: "status 狀態機",
        powerautomate: "Condition 控制流",
        enclosure: "角色接力動線",
      },
      badge: {
        flowchart: "主幹 A",
        sql: "STATE",
        powerautomate: "Control",
        enclosure: "動線",
      },
    },
    data: {
      id: "data",
      name: "資料存",
      depth: 1,
      hint: "單據與狀態",
      children: ["data-form", "data-status", "data-attach"],
      span: 6,
      trunk: true,
      short: {
        flowchart: "單據 · 歷程 · 附件",
        sql: "三張核心表",
        powerautomate: "資料動作區",
        enclosure: "共置物件區",
      },
      badge: {
        flowchart: "主幹 B",
        sql: "TABLES",
        powerautomate: "Data",
        enclosure: "物件",
      },
    },
    "flow-apply": {
      id: "flow-apply",
      name: "提出申請",
      depth: 2,
      hint: "申請人",
      children: [],
      span: 3,
      short: {
        flowchart: "起點送出",
        sql: "INSERT request",
        powerautomate: "Trigger",
        enclosure: "寫入席",
      },
      badge: {
        flowchart: "起點",
        sql: "INSERT",
        powerautomate: "Trigger",
        enclosure: "席位",
      },
    },
    "flow-approve": {
      id: "flow-approve",
      name: "主管簽核",
      depth: 2,
      hint: "簽核人",
      children: [],
      span: 3,
      short: {
        flowchart: "核准／退回",
        sql: "UPDATE status",
        powerautomate: "Approve",
        enclosure: "批示席",
      },
      badge: {
        flowchart: "決策",
        sql: "UPDATE",
        powerautomate: "Action",
        enclosure: "席位",
      },
    },
    "flow-close": {
      id: "flow-close",
      name: "結案歸檔",
      depth: 2,
      hint: "系統",
      children: [],
      span: 3,
      short: {
        flowchart: "終點封存",
        sql: "closed",
        powerautomate: "Terminate",
        enclosure: "封存區",
      },
      badge: {
        flowchart: "終點",
        sql: "CLOSE",
        powerautomate: "End",
        enclosure: "匣",
      },
    },
    "flow-notify": {
      id: "flow-notify",
      name: "通知／路由",
      depth: 2,
      hint: "旁路",
      children: [],
      span: 3,
      short: {
        flowchart: "旁路通知",
        sql: "查下一簽",
        powerautomate: "Notify",
        enclosure: "門鈴",
      },
      badge: {
        flowchart: "旁路",
        sql: "SELECT",
        powerautomate: "Notify",
        enclosure: "門鈴",
      },
    },
    "data-form": {
      id: "data-form",
      name: "申請單",
      depth: 2,
      hint: "主檔",
      children: [],
      span: 4,
      short: {
        flowchart: "假別與事由",
        sql: "request",
        powerautomate: "Compose",
        enclosure: "格式卡",
      },
      badge: {
        flowchart: "表單",
        sql: "TABLE",
        powerautomate: "Compose",
        enclosure: "卡",
      },
    },
    "data-status": {
      id: "data-status",
      name: "狀態歷程",
      depth: 2,
      hint: "時間線",
      children: [],
      span: 4,
      short: {
        flowchart: "誰何時何結果",
        sql: "request_status",
        powerautomate: "Append",
        enclosure: "時間線牆",
      },
      badge: {
        flowchart: "歷程",
        sql: "TABLE",
        powerautomate: "Append",
        enclosure: "牆",
      },
    },
    "data-attach": {
      id: "data-attach",
      name: "附件",
      depth: 2,
      hint: "檔案",
      children: [],
      span: 4,
      short: {
        flowchart: "證明文件",
        sql: "attachment",
        powerautomate: "Files",
        enclosure: "附件匣",
      },
      badge: {
        flowchart: "附件",
        sql: "TABLE",
        powerautomate: "Files",
        enclosure: "匣",
      },
    },
  };

  const VIEW_META = {
    flowchart: { label: "流程圖", hint: "箭頭軌道圖塊 · 換皮不換位" },
    sql: { label: "SQL", hint: "表／欄位圖塊 · 換皮不換位" },
    powerautomate: { label: "Power Automate", hint: "觸發－動作積木 · 換皮不換位" },
    enclosure: { label: "Shared Enclosure", hint: "空間席位圖塊 · 換皮不換位" },
  };

  const FLOW_ORDER = ["flow-apply", "flow-approve", "flow-close"];
  const state = { view: "flowchart", focus: "sys" };

  const elTree = document.getElementById("tree");
  const elBoard = document.getElementById("board");
  const elViewLabel = document.getElementById("view-label");
  const elFocusLabel = document.getElementById("focus-label");

  const GLYPHS = {
    flowchart: {
      sys: iconSystem,
      flow: iconTrack,
      data: iconStack,
      "flow-apply": iconPlay,
      "flow-approve": iconDecision,
      "flow-close": iconFlag,
      "flow-notify": iconBell,
      "data-form": iconForm,
      "data-status": iconTimeline,
      "data-attach": iconClip,
    },
    sql: {
      sys: iconDb,
      flow: iconCheck,
      data: iconTables,
      "flow-apply": iconInsert,
      "flow-approve": iconUpdate,
      "flow-close": iconLock,
      "flow-notify": iconSelect,
      "data-form": iconTable,
      "data-status": iconTable,
      "data-attach": iconTable,
    },
    powerautomate: {
      sys: iconBox,
      flow: iconBranch,
      data: iconGear,
      "flow-apply": iconBolt,
      "flow-approve": iconHand,
      "flow-close": iconStop,
      "flow-notify": iconMail,
      "data-form": iconCard,
      "data-status": iconPlus,
      "data-attach": iconFile,
    },
    enclosure: {
      sys: iconFence,
      flow: iconPath,
      data: iconRoom,
      "flow-apply": iconSeat,
      "flow-approve": iconSeat,
      "flow-close": iconArchive,
      "flow-notify": iconDoor,
      "data-form": iconPaper,
      "data-status": iconWall,
      "data-attach": iconBin,
    },
  };

  function svg(paths) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
  }
  function iconSystem() { return svg('<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M4 10h16M10 4v16"/>'); }
  function iconTrack() { return svg('<path d="M4 12h12"/><path d="M14 8l4 4-4 4"/><circle cx="6" cy="12" r="2"/>'); }
  function iconStack() { return svg('<rect x="5" y="4" width="14" height="5" rx="1"/><rect x="5" y="10" width="14" height="5" rx="1"/><rect x="5" y="16" width="14" height="4" rx="1"/>'); }
  function iconPlay() { return svg('<circle cx="12" cy="12" r="8"/><path d="M10 8l6 4-6 4z" fill="currentColor" stroke="none"/>'); }
  function iconDecision() { return svg('<path d="M12 3l8 9-8 9-8-9z"/>'); }
  function iconFlag() { return svg('<path d="M6 21V4"/><path d="M6 4h10l-2 3 2 3H6"/>'); }
  function iconBell() { return svg('<path d="M6 16h12l-1-2V9a5 5 0 0 0-10 0v5l-1 2"/><path d="M10 19a2 2 0 0 0 4 0"/>'); }
  function iconForm() { return svg('<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>'); }
  function iconTimeline() { return svg('<circle cx="6" cy="6" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="6" cy="18" r="2"/><path d="M10 6h8M10 12h8M10 18h5"/>'); }
  function iconClip() { return svg('<path d="M15 7H8a3 3 0 0 0 0 6h8a2 2 0 0 0 0-4H9"/>'); }
  function iconDb() { return svg('<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6"/><path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/>'); }
  function iconCheck() { return svg('<path d="M5 12l4 4L19 6"/>'); }
  function iconTables() { return svg('<rect x="3" y="5" width="8" height="14" rx="1"/><rect x="13" y="5" width="8" height="8" rx="1"/>'); }
  function iconInsert() { return svg('<path d="M12 5v14M5 12h14"/>'); }
  function iconUpdate() { return svg('<path d="M4 12a8 8 0 0 1 14-5"/><path d="M20 12a8 8 0 0 1-14 5"/><path d="M18 4v4h-4M6 20v-4h4"/>'); }
  function iconLock() { return svg('<rect x="6" y="11" width="12" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'); }
  function iconSelect() { return svg('<path d="M4 7h16M4 12h10M4 17h7"/>'); }
  function iconTable() { return svg('<rect x="4" y="5" width="16" height="14" rx="1"/><path d="M4 10h16M10 5v14"/>'); }
  function iconBox() { return svg('<path d="M3 8l9-4 9 4-9 4-9-4z"/><path d="M3 8v8l9 4 9-4V8"/>'); }
  function iconBranch() { return svg('<circle cx="6" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="12" r="2"/><path d="M6 8v8M8 6h4l6 6"/>'); }
  function iconGear() { return svg('<circle cx="12" cy="12" r="3"/><path d="M12 3v2M12 19v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M3 12h2M19 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'); }
  function iconBolt() { return svg('<path d="M13 2L4 14h7l-1 8 10-14h-7l0-6z"/>'); }
  function iconHand() { return svg('<path d="M8 13V7a1.5 1.5 0 0 1 3 0v4"/><path d="M11 11V6a1.5 1.5 0 0 1 3 0v5"/><path d="M14 11V7.5a1.5 1.5 0 0 1 3 0V14c0 4-2 6-5 6H9a5 5 0 0 1-5-5v-2"/>'); }
  function iconStop() { return svg('<rect x="6" y="6" width="12" height="12" rx="2"/>'); }
  function iconMail() { return svg('<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 8l9 6 9-6"/>'); }
  function iconCard() { return svg('<rect x="4" y="6" width="16" height="12" rx="2"/><path d="M4 10h16"/>'); }
  function iconPlus() { return svg('<circle cx="12" cy="12" r="8"/><path d="M12 8v8M8 12h8"/>'); }
  function iconFile() { return svg('<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/>'); }
  function iconFence() { return svg('<path d="M4 20V8l4-3 4 3 4-3 4 3v12"/><path d="M4 12h16"/>'); }
  function iconPath() { return svg('<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M7.5 16.5C10 10 14 14 16.5 7.5"/>'); }
  function iconRoom() { return svg('<rect x="4" y="5" width="16" height="14" rx="2"/><path d="M4 14h16"/>'); }
  function iconSeat() { return svg('<path d="M6 14V9a3 3 0 0 1 6 0v5"/><path d="M4 14h14v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3"/><path d="M18 10v7"/>'); }
  function iconArchive() { return svg('<rect x="4" y="4" width="16" height="5" rx="1"/><path d="M6 9v10h12V9"/><path d="M10 13h4"/>'); }
  function iconDoor() { return svg('<rect x="7" y="3" width="10" height="18" rx="1"/><circle cx="14" cy="12" r="1" fill="currentColor"/>'); }
  function iconPaper() { return svg('<path d="M7 3h8l4 4v14H7z"/><path d="M15 3v4h4"/><path d="M9 12h6M9 16h4"/>'); }
  function iconWall() { return svg('<path d="M4 6h16v4H4zM4 14h10v4H4z"/>'); }
  function iconBin() { return svg('<path d="M4 8h16l-1.5 12H5.5L4 8z"/><path d="M9 8V5h6v3"/>'); }

  function glyphFor(id) {
    const map = GLYPHS[state.view] || GLYPHS.flowchart;
    const fn = map[id] || iconSystem;
    return fn();
  }

  function renderTree(id = "sys", container = elTree) {
    const node = NODES[id];
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tree-node" + (state.focus === id ? " is-focus" : "");
    btn.innerHTML = `<span class="tree-swatch">${glyphFor(id)}</span><span class="name">${escapeHtml(node.name)}</span>${
      node.hint ? `<p class="hint">${escapeHtml(node.hint)}</p>` : ""
    }`;
    btn.querySelector(".tree-swatch").style.color = "var(--skin, var(--accent))";
    btn.addEventListener("click", () => {
      state.focus = id;
      sync({ flip: false });
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
    // leaf: show siblings under parent trunk for mosaic feel
    if (focus.depth === 2) {
      const parent = Object.values(NODES).find((n) => n.children?.includes(focus.id));
      if (parent) return [parent.id, ...parent.children];
    }
    return [focus.id];
  }

  function makeTile(id) {
    const node = NODES[id];
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className =
      `tile tile-span-${node.span || 4}` +
      (node.trunk ? " is-trunk" : "") +
      (state.focus === id ? " is-focus" : "");
    btn.dataset.id = id;
    const badge = node.badge[state.view];
    const short = node.short[state.view];
    btn.innerHTML = `
      <div class="tile-top">
        <span class="glyph">${glyphFor(id)}</span>
        <span class="tile-meta">
          <span class="badge">${escapeHtml(badge)}</span>
          <span class="depth">L${node.depth} · ${escapeHtml(id)}</span>
        </span>
      </div>
      <h3>${escapeHtml(node.name)}</h3>
      <p class="short">${escapeHtml(short)}</p>
      <div class="skin-rail" aria-hidden="true"></div>`;
    btn.addEventListener("click", () => {
      state.focus = id;
      sync({ flip: false });
    });
    return btn;
  }

  function renderBoard() {
    elBoard.dataset.view = state.view;
    elBoard.innerHTML = "";

    const hint = document.createElement("p");
    hint.className = "board-hint";
    hint.textContent = VIEW_META[state.view].hint;
    elBoard.appendChild(hint);

    const mosaic = document.createElement("div");
    mosaic.className = "mosaic";

    const ids = visibleIds();
    const showFlowConnector =
      state.view === "flowchart" &&
      ids.some((id) => FLOW_ORDER.includes(id) || id === "flow" || id === "sys");

    if (showFlowConnector && (state.focus === "sys" || state.focus === "flow" || FLOW_ORDER.includes(state.focus))) {
      const row = document.createElement("div");
      row.className = "connector-row";
      FLOW_ORDER.forEach((id, i) => {
        if (i) {
          const arrow = document.createElement("span");
          arrow.className = "connector-arrow";
          arrow.textContent = "→";
          row.appendChild(arrow);
        }
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "connector-chip" + (state.focus === id ? " is-focus" : "");
        chip.textContent = NODES[id].name;
        chip.addEventListener("click", (e) => {
          e.stopPropagation();
          state.focus = id;
          sync({ flip: false });
        });
        row.appendChild(chip);
      });
      mosaic.appendChild(row);
    }

    ids.forEach((id) => mosaic.appendChild(makeTile(id)));
    elBoard.appendChild(mosaic);
  }

  function sync({ flip = false } = {}) {
    document.documentElement.style.setProperty(
      "--skin",
      ({
        flowchart: "var(--flow)",
        sql: "var(--sql)",
        powerautomate: "var(--pa)",
        enclosure: "var(--enc)",
      })[state.view]
    );

    elTree.innerHTML = "";
    renderTree();
    elViewLabel.textContent = `視角：${VIEW_META[state.view].label}`;
    elFocusLabel.textContent = `焦點：${NODES[state.focus].name}`;

    if (flip) {
      elBoard.classList.add("is-flipping");
      window.setTimeout(() => {
        renderBoard();
        window.setTimeout(() => elBoard.classList.remove("is-flipping"), 480);
      }, 180);
    } else {
      renderBoard();
    }

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
      if (btn.dataset.view === state.view) return;
      state.view = btn.dataset.view;
      sync({ flip: true });
    });
  });

  sync();
})();
