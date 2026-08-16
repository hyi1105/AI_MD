# SEED / Theme

**長期關注產品或 KOL 知識的網站。**  
每個獨立 idea → 獨立資料夾 → 首頁一個按鈕（登錄 [`web/apps.json`](web/apps.json)）。

文件地圖：[`docs/README.md`](docs/README.md) · 主題：[`docs/theme.md`](docs/theme.md) · 合作：[`prompts/AGENT-MASTER.md`](prompts/AGENT-MASTER.md)。

> 線上：**https://hyi1105.github.io/AI_MD/**

## 文件

| 檔案 | 用途 |
|------|------|
| [docs/README.md](docs/README.md) | **架構地圖**（含整庫分類） |
| [docs/theme.md](docs/theme.md) | 產品主題 |
| [docs/idea.md](docs/idea.md) | 進行中構想 |
| [docs/idea.history.md](docs/idea.history.md) | 已結案構想 |
| [docs/checklist.md](docs/checklist.md) | 現有功能查核表 |
| [docs/specs/ai-doc.md](docs/specs/ai-doc.md) | AI Doc 規格 |
| [web/apps.json](web/apps.json) | 首頁按鈕登錄表 |
| [prompts/AGENT-MASTER.md](prompts/AGENT-MASTER.md) | 合作方式＋說明法 |

## 首頁分類

| 類 | 現有 |
|----|------|
| **工具** | AI 查詢、說明法、AI Doc |
| **示範** | 簽核 Demo、系統地圖 |

## 本機

```powershell
cd web
.\start-local.ps1
```

```bash
cd aidoc && npm install && npm run build
```

想法 → `idea.md` → **直接開發並發布**（`web/<slug>/` + `apps.json`）→ 登記 `checklist` → 移 `idea.history`。

MIT
