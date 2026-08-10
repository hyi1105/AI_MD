# SEED / Theme

**長期關注產品或 KOL 知識的網站。**  
主題說明見 [`docs/00-theme.md`](docs/00-theme.md)。  
**合作方式**見 [`prompts/AGENT-MASTER.md`](prompts/AGENT-MASTER.md)。

> 線上：**https://hyi1105.github.io/AI_MD/**

## 文件

| 檔案 | 用途 |
|------|------|
| [docs/00-theme.md](docs/00-theme.md) | 產品主題 |
| [docs/idea.md](docs/idea.md) | 進行中構想（對話整理後存放） |
| [docs/idea.history.md](docs/idea.history.md) | 已結案構想（分開以省查檔成本） |
| [docs/03-checklist.md](docs/03-checklist.md) | **現有功能查核表** |
| [docs/ai-doc.md](docs/ai-doc.md) | **AI Doc**：AI 改檔 + 顯示修改處 |
| [prompts/AGENT-MASTER.md](prompts/AGENT-MASTER.md) | 合作方式＋AI 規則 |

## 工具

| 工具 | 說明 |
|------|------|
| Portal | 首頁 `web/index.html`；按鈕選擇獨立功能 |
| AI 查詢 | `web/query.html` + `catalog.json` |
| **AI Doc** | 像 Cursor 改檔並顯示 Diff（程式在 `aidoc/` → `web/aidoc/`） |

## 本機

```powershell
cd web
.\start-local.ps1
```

```bash
cd aidoc && npm install && npm run build
```

想法 → `idea.md` → 改程式／發布成功 → 登記 `03-checklist` → 移 `idea.history`。

MIT
