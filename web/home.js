(function () {
  const root = document.getElementById("hello-apps");
  if (!root) return;

  function btnClass(app) {
    return app.primary ? "hello-btn hello-btn--primary" : "hello-btn hello-btn--ghost";
  }

  function render(data) {
    root.textContent = "";
    const byCat = new Map((data.categories || []).map((c) => [c.id, { ...c, apps: [] }]));
    for (const app of data.apps || []) {
      const bucket = byCat.get(app.category);
      if (bucket) bucket.apps.push(app);
      else {
        if (!byCat.has(app.category)) {
          byCat.set(app.category, { id: app.category, label: app.category, blurb: "", apps: [] });
        }
        byCat.get(app.category).apps.push(app);
      }
    }

    let delay = 0;
    for (const cat of byCat.values()) {
      if (!cat.apps.length) continue;
      const section = document.createElement("section");
      section.className = "hello-group";
      section.style.setProperty("--hello-group-delay", `${0.28 + delay * 0.1}s`);

      const head = document.createElement("div");
      head.className = "hello-group__head";
      const title = document.createElement("h2");
      title.className = "hello-group__title";
      title.textContent = cat.label;
      head.appendChild(title);
      if (cat.blurb) {
        const blurb = document.createElement("p");
        blurb.className = "hello-group__blurb";
        blurb.textContent = cat.blurb;
        head.appendChild(blurb);
      }
      section.appendChild(head);

      const actions = document.createElement("div");
      actions.className = "hello-actions";
      for (const app of cat.apps) {
        const a = document.createElement("a");
        a.className = btnClass(app);
        a.href = app.href;
        a.textContent = app.primary ? `進入 ${app.title}` : app.title;
        actions.appendChild(a);
      }
      section.appendChild(actions);
      root.appendChild(section);
      delay += 1;
    }
  }

  fetch("apps.json", { cache: "no-cache" })
    .then((r) => {
      if (!r.ok) throw new Error("apps.json " + r.status);
      return r.json();
    })
    .then(render)
    .catch(() => {
      root.innerHTML =
        '<p class="hello-apps-fallback">載入 apps.json 失敗。請直接開 <a href="query.html">AI 查詢</a>。</p>';
    });
})();
