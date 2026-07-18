# AI 工具搜尋 — 本機 Web

## 本機預覽（推薦）

詳情頁要讀 Markdown，請用 **本地 HTTP 伺服器**（不要只雙擊 HTML）。

```powershell
cd C:\Users\Admin\Projects\AI_MD\web
python -m http.server 8080
```

瀏覽器開：**http://localhost:8080**

或執行：

```powershell
.\start-local.ps1
```

## 僅看列表（可雙擊）

雙擊 `index.html` 可看搜尋與追蹤；詳情頁 MD 可能改顯示 data.js 摘要。

## 檔案

| 檔案 | 說明 |
|------|------|
| `index.html` | 首頁 |
| `tool.html` | 詳情頁 |
| `tools/*.md` | 300 篇工具說明（由 `catalog.json` 產生） |
| `catalog.json` | 300 筆工具目錄（結構化資料） |
| `data.js` | 載入 catalog + 精選評估 |
| `shared.js` | 追蹤邏輯 |
| `script.js` | 搜尋邏輯 |

## 系統類別

首頁最上方可切換：

| 類別 | 路徑 | 說明 |
|------|------|------|
| AI 查詢工具 | `index.html` | 原有工具搜尋 |
| SmartDoc 編輯器 | `smartdoc/` | AI 修訂 + P2P（由 `smartdoc-ai/` 建置） |

本機若尚未建置 SmartDoc：

```bash
cd ../smartdoc-ai
npm install
npm run build
```

產出會寫入 `web/smartdoc/`。

## 線上網站

**https://hyi1105.github.io/AI_MD/**

- AI 查詢：https://hyi1105.github.io/AI_MD/
- SmartDoc：https://hyi1105.github.io/AI_MD/smartdoc/

GitHub Pages 來源：GitHub Actions（`.github/workflows/pages.yml` 會先建置 SmartDoc，再部署 `web/`）。詳見 `docs/03-implementation.md`。

## 內容更新（交給 Cursor）

**日常不用跑生成脚本。** 需要改工具列表时，在对话里直接说即可，例如：

- 「加 5 个新的编程 AI 工具」
- 「更新 ChatGPT 描述」
- 「发布到线上」

Agent 会直接改 `catalog.json` 并按需 push。详情页没有对应 `.md` 时，会自动用 catalog 字段显示。

仅在做**整批从 SEEDS 重建**时才需：

```powershell
& web\scripts\build_catalog.ps1
& web\scripts\generate-tools-md.ps1
```
