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
| `tools/*.md` | 24 篇工具說明 |
| `data.js` | 列表資料 |
| `shared.js` | 追蹤邏輯 |
| `script.js` | 搜尋邏輯 |

## 線上網站

**https://hyi1105.github.io/AI_MD/**

GitHub Pages 來源：`main` 分支、`/web` 資料夾。詳見 `docs/03-implementation.md`。
