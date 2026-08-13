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

  let asApprover = false;

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

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.remove("hidden");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.add("hidden"), 2200);
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
      <dt>職稱</dt><dd>${p.title}</dd>
      <dt>單位</dt><dd>${p.dept}</dd>
      <dt>信箱</dt><dd>${p.mail}</dd>
      <dt>電話</dt><dd>${p.phone}</dd>
    `;
    profile.classList.remove("hidden");
  }

  document.getElementById("sheet-close").addEventListener("click", () => {
    sheet.classList.add("hidden");
  });
  document.getElementById("profile-close").addEventListener("click", () => {
    profile.classList.add("hidden");
  });

  document.querySelectorAll(".node-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const role = btn.closest(".node").dataset.role;
      const action = btn.dataset.action;
      if (action === "self" || role === "applicant") {
        openSheet("申請人：王小明", "點自己／點標題可看資料或換代理", [
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
          { label: "退回申請", run: () => showToast("假畫面：已退回") },
          { label: "發通知請簽", run: () => showToast("假畫面：已通知請簽") },
        ]);
      }
    });
  });

  document.getElementById("btn-submit").addEventListener("click", () => {
    showToast("假畫面：已送出（尚未接後端）");
  });
  document.getElementById("btn-approve").addEventListener("click", () => {
    showToast("假畫面：已核准");
  });
  document.getElementById("btn-deny").addEventListener("click", () => {
    showToast("假畫面：已駁回");
  });
  document.getElementById("btn-return").addEventListener("click", () => {
    showToast("假畫面：已退回");
  });
  document.getElementById("btn-design").addEventListener("click", () => {
    showToast("假畫面：設計預覽（之後接 schema 編輯）");
  });

  document.getElementById("btn-as-approver").addEventListener("click", () => {
    asApprover = !asApprover;
    privateField.classList.toggle("hidden", asApprover);
    viewerRole.textContent = asApprover
      ? "檢視中：簽核人（個人欄不存在於此畫面）"
      : "檢視中：申請人（含個人欄）";
    document.getElementById("btn-as-approver").textContent = asApprover
      ? "切回申請人視角"
      : "切成簽核人視角";
    showToast(asApprover ? "簽核人看不到個人備註格" : "申請人看得到個人備註格");
  });

  document.getElementById("composer").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("msg");
    const text = input.value.trim();
    if (!text) return;
    const article = document.createElement("article");
    article.className = "box me";
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    article.innerHTML = `
      <header><strong>我</strong><time>${time}</time></header>
      <p></p>
      <footer class="bound">綁定欄：假別、天數（示範）</footer>
    `;
    article.querySelector("p").textContent = text;
    boxes.appendChild(article);
    boxes.scrollTop = boxes.scrollHeight;
    input.value = "";
  });
})();
