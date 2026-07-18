# 03 — 實作決策（HOW）

> 更新：2026-07-18 | 上線方式：**GitHub Pages**

本文件補齊規格裡沒寫的「怎麼做」。**實作以本文為準。**

---

## 技術棧（一句話）

**純 HTML + CSS + JS + Markdown 檔 + GitHub Pages**，無框架、無建置步驟。

| 項目 | 選擇 | 原因 |
|------|------|------|
| 前端 | 原生 HTML/CSS/JS | 最簡單、Cursor 最好改 |
| 列表資料 | `web/data.js` | 已有，搜尋快 |
| 詳情 | `web/tools/{id}.md` | 本機 HTTP 伺服器可 fetch |
| MD 渲染 | [marked.js](https://marked.js.org/) CDN | 最流行的輕量 MD 解析 |
| 追蹤 | `localStorage` | 免登入、業界常用 |
| **上線** | **GitHub Pages** | 公開 repo 免費 |
| **本機開發** | `web/start-local.ps1` | 改 code 時用 |

> 線上網址：**https://hyi1105.github.io/AI_MD/**

---

## F-08 追蹤關鍵字

| 決策 | 內容 |
|------|------|
| UI 位置 | 首頁搜尋框下方「我的追蹤」區 |
| 操作 | 輸入框 +「新增」；標籤 chip 可 ✕ 刪除 |
| 篩選 | 勾選「只顯示追蹤」= 只列出匹配工具 |
| 未勾選 | 全部工具，**匹配的卡片加高亮框** |
| localStorage key | `ai_md_watchlist` |
| 格式 | `{ "keywords": ["攝影", "繪圖"] }` |
| 上限 | 20 個關鍵字 |
| 匹配欄位 | name, category, description, bestFor, tags, keywords（同搜尋邏輯） |

---

## F-09 Markdown 詳情

| 決策 | 內容 |
|------|------|
| URL | `tool.html?id=chatgpt` |
| 卡片 | **兩個按鈕**：「查看詳情」「前往官網」 |
| MD 路徑 | `web/tools/{id}.md` |
| 無 MD 時 | 用 `data.js` 資料顯示基本詳情 |
| 維護 | 列表改 `data.js`；長文改 `web/tools/*.md`（你 + Cursor） |

**注意**：詳情頁讀 MD 需 **本機 HTTP 伺服器**（直接雙擊 `file://` 可能無法 fetch MD，會自動 fallback 到 data.js）。

---

## F-10 部署（GitHub Pages）

| 決策 | 內容 |
|------|------|
| 平台 | **GitHub Pages**（GitHub Actions 部署 `web/`） |
| 來源 | `main` 分支 push → `.github/workflows/pages.yml` |
| 網址 | **https://hyi1105.github.io/AI_MD/** |
| 設定 | Repo → Settings → Pages → Source **GitHub Actions** |
| 必要檔 | `web/.nojekyll`（已加，避免 Jekyll 忽略 `_` 開頭檔） |

### 本機開發（PowerShell）

```powershell
cd C:\Users\Admin\Projects\AI_MD\web
python -m http.server 8080
# 瀏覽器開：http://localhost:8080
```

若沒有 Python，可雙擊 `web/start-local.ps1`（會嘗試自動啟動）。

---

## 新增工具流程

1. 在 `web/data.js` 加一筆
2. 複製 `templates/tool-entry.md` → `web/tools/{id}.md` 並填寫
3. 本機伺服器重新整理頁面即可預覽

---

## 變更紀錄

| 日期 | 摘要 |
|------|------|
| 2026-07-18 | 初版 HOW |
| 2026-07-18 | 啟用 GitHub Pages；F-10 完成 |
| 2026-07-18 | 正式營運前改為本機；F-10 上線延後 |
