# 03 — 實作決策（HOW）

> 更新：2026-07-19 | 上線方式：**GitHub Pages**

本文件補齊規格裡沒寫的「怎麼做」。**實作以本文為準。**  
未聽到「改程式」前，Agent 只更新本類 Markdown，不動 `web/` 程式。

---

## 技術棧（一句話）

**主站仍是純 HTML + CSS + JS + Markdown**；另嵌 **SmartDoc**（Vite/React，建置進 `web/smartdoc/`）供系統類別切換。

| 項目 | 選擇 | 原因 |
|------|------|------|
| 前端 | 原生 HTML/CSS/JS | 最簡單、Cursor 最好改 |
| 系統類別 | 頂部 nav：`AI 查詢` / `SmartDoc 編修` | 共用 GitHub Pages 發佈 |
| 列表資料 | `web/catalog.json` | 站上真實列表；`data.js` 的 `loadCatalog()` 載入 |
| 精選評估 | `web/data.js` | `TOP_TIER_*` 等，不是完整列表 |
| 詳情 | `web/tools/{id}.md` | 無 MD 時 fallback catalog 欄位 |
| MD 渲染 | [marked.js](https://marked.js.org/) CDN | 最流行的輕量 MD 解析 |
| 追蹤 | `localStorage` | 免登入、業界常用 |
| SmartDoc | `smartdoc-ai/` → `web/smartdoc/` | Pages workflow 建置 |
| **上線** | **GitHub Pages** | 公開 repo 免費；須負責人說「發布」 |
| **本機開發** | `web/start-local.ps1` | 改 code 時用 |

> 線上網址：**https://hyi1105.github.io/AI_MD/**  
> SmartDoc：**https://hyi1105.github.io/AI_MD/smartdoc/**

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
| 無 MD 時 | 用 `catalog.json` 欄位顯示基本詳情 |
| 維護 | 列表改 `catalog.json`；長文改 `web/tools/*.md`（須「改程式／改目錄」） |

**注意**：詳情頁讀 MD 需 **本機 HTTP 伺服器**（直接雙擊 `file://` 可能無法 fetch MD，會自動 fallback 到 catalog）。

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

## 新增工具流程（須負責人說「改目錄」或「改程式」）

1. 在 `web/catalog.json` 加一筆（勿重跑 bulk 腳本，除非要求整批重建）
2. （可選）複製 `templates/tool-entry.md` → `web/tools/{id}.md`；無 MD 也可靠 catalog fallback
3. 本機伺服器重新整理頁面即可預覽
4. 負責人說「發布」後再 push

---

## 變更紀錄

| 日期 | 摘要 |
|------|------|
| 2026-07-19 | 列表改 catalog.json；文件優先協作；釐清 F-10 已上線 |
| 2026-07-18 | 初版 HOW |
| 2026-07-18 | 啟用 GitHub Pages；F-10 完成 |
| 2026-07-18 | 曾短暫改本機延後上線；之後已恢復 Pages（以現況為準） |
