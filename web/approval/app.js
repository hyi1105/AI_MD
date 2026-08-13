(() => {
  const toast = document.getElementById("toast");
  const sheet = document.getElementById("sheet");
  const sheetTitle = document.getElementById("sheet-title");
  const sheetDesc = document.getElementById("sheet-desc");
  const sheetActions = document.getElementById("sheet-actions");
  const profile = document.getElementById("profile");
  const profileTitle = document.getElementById("profile-title");
  const profileBody = document.getElementById("profile-body");
  const privateField = document.getElementById("private-field");
  const viewerRole = document.getElementById("viewer-role");
  const boxes = document.getElementById("boxes");
  const formatCard = document.getElementById("format-card");
  const cardMissing = document.getElementById("card-missing");
  const cardForm = document.getElementById("card-form");
  const primaryBtn = document.getElementById("btn-primary-action");
  const reasonSheet = document.getElementById("reason-sheet");
  const reasonTitle = document.getElementById("reason-title");
  const reasonDesc = document.getElementById("reason-desc");
  const reasonInput = document.getElementById("reason-input");

  let asApprover = false;
  let reasonCallback = null;
  let status = "draft"; // draft | submitted | approved | denied | returned

  const people = {
    applicant: {
      name: "王小明",
      title: "工程師",
      dept: "資訊部",
      mail: "ming@example.com",
      phone: "0912-000-111",
    },
    agent: {
      name: "陳美玲",
      title: "工程師",
      dept: "資訊部",
      mail: "mei@example.com",
      phone: "0912-000-222",
    },
    approver: {
      name: "林主管",
      title: "課長",
      dept: "資訊部",
      mail: "lin@example.com",
      phone: "0912-000-333",
    },
  };

  const seedMessages = [
    {
      kind: "chat",
      me: true,
      name: "王小明",
      time: "昨天 17:02",
      text: "請幫我簽一下，明天上午請假。",
    },
    {
      kind: "chat",
      me: false,
      name: "林主管",
      time: "昨天 17:10",
      text: "代理人確認過了嗎？",
    },
    {
      kind: "chat",
      me: true,
      name: "王小明",
      time: "昨天 17:12",
      text: "有，陳美玲已同意代理。",
    },
  ];

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.remove("hidden");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.add("hidden"), 2200);
  }

  function nowTime() {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function appendChat({ me, name, time, text }) {
    const article = document.createElement("article");
    article.className = me ? "box me" : "box";
    article.innerHTML = `
      <header><strong>${escapeHtml(name)}</strong><time>${escapeHtml(time)}</time></header>
      <p></p>
    `;
    article.querySelector("p").textContent = text;
    boxes.appendChild(article);
    boxes.scrollTop = boxes.scrollHeight;
  }

  function appendSystem({ title, body, actions }) {
    const article = document.createElement("article");
    article.className = "sys";
    const actionsHtml = (actions || [])
      .map(
        (a) =>
          `<button type="button" class="${a.className || "ghost"}" data-sys-action="${escapeHtml(a.id)}">${escapeHtml(a.label)}</button>`
      )
      .join("");
    article.innerHTML = `
      <div class="sys-card">
        <p class="sys-kicker">系統</p>
        <h4>${escapeHtml(title)}</h4>
        <p class="sys-body"></p>
        ${actionsHtml ? `<div class="sys-actions">${actionsHtml}</div>` : ""}
      </div>
    `;
    article.querySelector(".sys-body").textContent = body;
    article.querySelectorAll("[data-sys-action]").forEach((btn) => {
      btn.addEventListener("click", () => handleSysAction(btn.dataset.sysAction));
    });
    boxes.appendChild(article);
    boxes.scrollTop = boxes.scrollHeight;
  }

  function openSheet(title, desc, actions) {
    sheetTitle.textContent = title;
    sheetDesc.textContent = desc;
    sheetActions.innerHTML = "";
    actions.forEach(({ label, run }) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = label;
      btn.addEventListener("click", () => {
        sheet.classList.add("hidden");
        run();
      });
      li.appendChild(btn);
      sheetActions.appendChild(li);
    });
    sheet.classList.remove("hidden");
  }

  function openProfile(key) {
    const p = people[key];
    profileTitle.textContent = p.name;
    profileBody.innerHTML = `
      <dt>職稱</dt><dd>${escapeHtml(p.title)}</dd>
      <dt>單位</dt><dd>${escapeHtml(p.dept)}</dd>
      <dt>信箱</dt><dd>${escapeHtml(p.mail)}</dd>
      <dt>電話</dt><dd>${escapeHtml(p.phone)}</dd>
    `;
    profile.classList.remove("hidden");
  }

  function openReason(title, desc, onConfirm) {
    reasonTitle.textContent = title;
    reasonDesc.textContent = desc;
    reasonInput.value = "";
    reasonCallback = onConfirm;
    reasonSheet.classList.remove("hidden");
    reasonInput.focus();
  }

  function requiredGaps() {
    const gaps = [];
    cardForm.querySelectorAll("[data-required='true']").forEach((el) => {
      if (el.closest(".field.hidden")) return;
      const label = el.closest(".field")?.querySelector(".label")?.childNodes[0]?.textContent?.trim() || el.name;
      const val = String(el.value || "").trim();
      if (!val) gaps.push(label);
    });
    const needAgent = cardForm.elements.need_agent?.value === "是";
    if (needAgent && !String(cardForm.elements.agent?.value || "").trim()) {
      gaps.push("代理人");
    }
    return gaps;
  }

  function markMissing(gaps) {
    if (!gaps.length) {
      cardMissing.classList.add("hidden");
      cardMissing.textContent = "";
      cardForm.querySelectorAll(".field").forEach((f) => f.classList.remove("invalid"));
      return;
    }
    cardMissing.classList.remove("hidden");
    cardMissing.textContent = `尚缺：${gaps.join("、")}`;
    cardForm.querySelectorAll(".field").forEach((f) => {
      const input = f.querySelector("input, select");
      if (!input) return;
      const label = f.querySelector(".label")?.childNodes[0]?.textContent?.trim();
      f.classList.toggle("invalid", gaps.includes(label) || (gaps.includes("代理人") && input.name === "agent"));
    });
    formatCard.classList.add("open");
    document.body.classList.add("card-open");
  }

  function setFormEditable(editable) {
    cardForm.querySelectorAll("input, select").forEach((el) => {
      if (el.name === "applicant") {
        el.readOnly = true;
        return;
      }
      if (el.tagName === "SELECT") el.disabled = !editable;
      else el.readOnly = !editable;
    });
  }

  function refreshPrimaryAction() {
    if (asApprover) {
      primaryBtn.textContent = "核准";
      primaryBtn.className = "ok";
      primaryBtn.dataset.action = "approve";
      setFormEditable(false);
    } else {
      primaryBtn.textContent = "送出申請";
      primaryBtn.className = "primary";
      primaryBtn.dataset.action = "submit";
      setFormEditable(status === "draft" || status === "returned");
    }
  }

  function ensureApproverSystemCard() {
    const existing = boxes.querySelector("[data-approver-actions='1']");
    if (!asApprover) {
      existing?.remove();
      return;
    }
    if (existing) return;
    if (status === "approved" || status === "denied") return;
    appendSystem({
      title: "待你簽核",
      body: "這不是聊天。請看右側／手上格式卡後，核准、駁回或退回。",
      actions: [
        { id: "approve", label: "核准", className: "ok" },
        { id: "deny", label: "駁回", className: "danger" },
        { id: "return", label: "退回", className: "ghost" },
      ],
    });
    const last = boxes.lastElementChild;
    if (last) last.dataset.approverActions = "1";
  }

  function handleSysAction(id) {
    if (id === "approve") doApprove();
    else if (id === "deny") doDeny();
    else if (id === "return") doReturn();
  }

  function doSubmit() {
    const gaps = requiredGaps();
    if (gaps.length) {
      markMissing(gaps);
      showToast("格式卡尚有必填未完成");
      return;
    }
    markMissing([]);
    status = "submitted";
    appendSystem({
      title: "已送出申請（submit）",
      body: "申請人已送簽。格式卡鎖定；簽核人可核准／駁回／退回。",
    });
    showToast("submit：已送出申請");
    refreshPrimaryAction();
  }

  function doApprove() {
    if (!asApprover) {
      showToast("請切成簽核人視角再核准");
      return;
    }
    status = "approved";
    boxes.querySelector("[data-approver-actions='1']")?.remove();
    appendSystem({
      title: "已核准（approve）",
      body: "簽核人核准此張請假申請。",
    });
    showToast("approve：已核准");
    refreshPrimaryAction();
  }

  function doDeny() {
    if (!asApprover) {
      showToast("請切成簽核人視角再駁回");
      return;
    }
    openReason("駁回理由", "駁回會寫進對話的系統訊息（不是一般聊天）。", (reason) => {
      status = "denied";
      boxes.querySelector("[data-approver-actions='1']")?.remove();
      appendSystem({
        title: "已駁回",
        body: reason ? `理由：${reason}` : "（未填理由）",
      });
      showToast("已駁回");
      refreshPrimaryAction();
    });
  }

  function doReturn() {
    if (!asApprover) {
      showToast("請切成簽核人視角再退回");
      return;
    }
    openReason("退回理由", "退回後申請人可改格式卡再送出。", (reason) => {
      status = "returned";
      boxes.querySelector("[data-approver-actions='1']")?.remove();
      appendSystem({
        title: "已退回",
        body: reason ? `理由：${reason}` : "（未填理由）",
      });
      showToast("已退回");
      refreshPrimaryAction();
    });
  }

  document.getElementById("sheet-close").addEventListener("click", () => {
    sheet.classList.add("hidden");
  });
  document.getElementById("profile-close").addEventListener("click", () => {
    profile.classList.add("hidden");
  });
  document.getElementById("reason-cancel").addEventListener("click", () => {
    reasonSheet.classList.add("hidden");
    reasonCallback = null;
  });
  document.getElementById("reason-confirm").addEventListener("click", () => {
    const cb = reasonCallback;
    const val = reasonInput.value.trim();
    reasonSheet.classList.add("hidden");
    reasonCallback = null;
    if (cb) cb(val);
  });

  document.querySelectorAll(".node-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const role = btn.closest(".node").dataset.role;
      if (role === "applicant") {
        openSheet("申請人：王小明", "點人名可看資料或換代理", [
          { label: "查看個人資料", run: () => openProfile("applicant") },
          { label: "更換代理人", run: () => showToast("假畫面：開啟「更換代理人」") },
          { label: "發通知請簽", run: () => showToast("假畫面：已模擬通知簽核人") },
        ]);
      } else if (role === "agent") {
        openSheet("代理人：陳美玲", "可換人或查看資料", [
          { label: "查看個人資料", run: () => openProfile("agent") },
          { label: "更換代理人", run: () => showToast("假畫面：更換代理人") },
          { label: "通知代理人", run: () => showToast("假畫面：已通知代理人") },
        ]);
      } else {
        openSheet("簽核人：林主管", "可換簽核、退回或請簽", [
          { label: "查看個人資料", run: () => openProfile("approver") },
          { label: "更換簽核人", run: () => showToast("假畫面：更換簽核人") },
          { label: "退回申請", run: () => doReturn() },
          { label: "發通知請簽", run: () => showToast("假畫面：已通知請簽") },
        ]);
      }
    });
  });

  primaryBtn.addEventListener("click", () => {
    if (primaryBtn.dataset.action === "approve") doApprove();
    else doSubmit();
  });

  document.getElementById("btn-as-approver").addEventListener("click", () => {
    asApprover = !asApprover;
    privateField.classList.toggle("hidden", asApprover);
    viewerRole.textContent = asApprover
      ? "檢視中：簽核人 · 格式卡無個人欄"
      : "檢視中：申請人 · 聊天 ≠ 格式卡";
    document.getElementById("btn-as-approver").textContent = asApprover
      ? "切回申請人視角"
      : "切成簽核人視角";
    refreshPrimaryAction();
    ensureApproverSystemCard();
    showToast(asApprover ? "簽核人：聊天歸聊天，文件看格式卡" : "申請人：可改格式卡並送出");
  });

  document.getElementById("btn-toggle-card").addEventListener("click", () => {
    const open = !formatCard.classList.contains("open");
    formatCard.classList.toggle("open", open);
    document.body.classList.toggle("card-open", open);
  });
  document.getElementById("btn-close-card").addEventListener("click", () => {
    formatCard.classList.remove("open");
    document.body.classList.remove("card-open");
  });

  document.getElementById("composer").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("msg");
    const text = input.value.trim();
    if (!text) return;
    appendChat({
      me: true,
      name: asApprover ? "林主管" : "王小明",
      time: nowTime(),
      text,
    });
    input.value = "";
  });

  // seed
  seedMessages.forEach(appendChat);
  appendSystem({
    title: "使用說明",
    body: "左邊／上面是一般聊天（像打 LINE）。右邊／手上是格式卡（文件）。送出申請＝submit；核准＝approve。駁回／退回會出現在對話的系統訊息。",
  });
  refreshPrimaryAction();
  formatCard.classList.add("open");
  document.body.classList.add("card-open");
})();
