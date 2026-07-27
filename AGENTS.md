# AGENTS.md

（本專案文件一律繁體中文。合作方式與規則見 `prompts/AGENT-MASTER.md`。）

## Cursor Cloud specific instructions

本 repo 是「純前端、無後端」的靜態網站 monorepo，包含兩個產品：

- `web/`：靜態網站（原生 HTML/CSS/JS，無建置）。資料來源是 `web/catalog.json`，透過 `fetch("catalog.json")` 載入，因此**必須用 HTTP 伺服器提供**，不能用 `file://` 直接開。
- `aidoc/`：React 19 + TypeScript + Vite 8 的 SPA（「AI Doc」）。`npm run build` 會輸出到 `../web/aidoc/`，於主站 `/aidoc/` 路徑呈現。

### 相依安裝
只有 `aidoc/` 有 Node 相依（`aidoc/package-lock.json`，用 `npm ci`）。CI 使用 Node 22（見 `.github/workflows/pages.yml`）。`web/` 沒有任何相依，不需安裝。啟動環境時 update script 已自動執行 `npm ci`。

### 執行服務（開發模式）
- AI Doc 開發伺服器：`cd aidoc && npm run dev`（Vite，預設 `http://localhost:5173`）。
- 主站靜態伺服器：`cd web && python3 -m http.server 8080`（`http://localhost:8080`）。`start-local.ps1` 只是 Windows/PowerShell 版本。

### Lint / Build
- Lint（僅 `aidoc/`）：`cd aidoc && npm run lint`（oxlint）。
- Build：`cd aidoc && npm run build`（`tsc -b && vite build`，輸出到 `web/aidoc/`）。注意：build 會覆寫已 commit 的 `web/aidoc/` 產物；除非要「發布」，否則不要 commit build 產物（見工作區規則：改程式才改 code、發布才 push）。

### 重要提醒（非顯而易見）
- AI Doc 的「AI」是 `aidoc/src/lib/aiEngine.ts` 內的**本地規則式模擬**，不是真正的 LLM，也沒有任何網路/API 呼叫。輸入自然語言指令後產生的 diff 是模擬結果，不會真正照字面理解指令——這是預期行為，測試時不要當成 bug。
- 整個 repo 沒有後端、資料庫、密鑰或 `.env`；不需任何外部服務即可完整測試。
