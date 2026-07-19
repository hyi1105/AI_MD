# SEED

**長期關注產品或 KOL 知識的網站。**  
把專業累積成可分享的 **SEED（知識書）**；他人可關注、編排、分享，並可延伸商業行為。

> 線上：**https://hyi1105.github.io/AI_MD/**

---

## 文件架構（只看這些）

| 檔案 | 用途 |
|------|------|
| [docs/00-seed-platform.md](docs/00-seed-platform.md) | 產品是什麼 |
| [docs/01-idea.md](docs/01-idea.md) | 待辦構想＋前因後果 |
| [docs/02-idea-done.md](docs/02-idea-done.md) | 已完成／已取消 |
| [docs/03-checklist.md](docs/03-checklist.md) | 使用者操作驗收 |
| [prompts/AGENT-MASTER.md](prompts/AGENT-MASTER.md) | **AI 規則**（執行前必讀） |

---

## 架構（給協作者）

| 層級 | 路徑 | 角色 |
|------|------|------|
| **SEED 平台** | 本站整體 | 關注、累積、分享知識書 |
| 採集工具 · AI 查詢 | `web/` | 發現與對照素材 |
| 採集工具 · SmartDoc | `smartdoc-ai/` → `web/smartdoc/` | 編修 Markdown，輸出 SEED |

現有編輯器／P2P／目錄搜尋都是 **工具**，目的是產出 SEED，不是產品本體。

## 線上入口

| 入口 | 網址 |
|------|------|
| 平台首頁 | https://hyi1105.github.io/AI_MD/ |
| SmartDoc | https://hyi1105.github.io/AI_MD/smartdoc/ |

## 本機開發

```powershell
cd web
.\start-local.ps1
# 或：python -m http.server 8080
```

```bash
cd smartdoc-ai
npm install
npm run build   # 輸出到 web/smartdoc/
```

## 與 AI 怎麼配合

1. 你說想法 → AI **只改 Markdown（繁中）**，寫進 `01-idea`／`00`／`03`  
2. 你說「**改程式**」→ 才改 `web/`／`smartdoc-ai/`  
3. 你說「**發布**」→ 才 push／上線  
4. 完成或取消的項目 → 移到 `02-idea-done.md`  

詳見 [prompts/AGENT-MASTER.md](prompts/AGENT-MASTER.md)。

| 項目 | 決策 |
|------|------|
| 產品 | **SEED**＝可累積的知識書 |
| 運行 | GitHub Pages（`web/`） |
| 授權 | MIT |
