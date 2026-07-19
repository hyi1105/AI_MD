# SEED

**長期關注產品或 KOL 知識的網站。**  
把專業累積成可分享的 **SEED（知識書）**。

> 線上：**https://hyi1105.github.io/AI_MD/**

## 文件（都在 `docs/`）

| 檔案 | 用途 |
|------|------|
| [docs/00-seed-platform.md](docs/00-seed-platform.md) | 產品是什麼 |
| [docs/01-idea.md](docs/01-idea.md) | 對話入檔 |
| [docs/02-idea-done.md](docs/02-idea-done.md) | 已完成對話 |
| [docs/03-checklist.md](docs/03-checklist.md) | 功能驗收（勾選真相） |
| [docs/smartdoc.md](docs/smartdoc.md) | SmartDoc 收集工具規格 |
| [prompts/AGENT-MASTER.md](prompts/AGENT-MASTER.md) | AI 規則 |

Cursor 機器規則（`.mdc`）連結見 [00 § AI 規則檔](docs/00-seed-platform.md)。

## 架構

| 層級 | 說明 |
|------|------|
| SEED 平台 | 關注、累積、分享知識書 |
| 收集工具 · AI 查詢 | `web/` + `catalog.json` |
| 收集工具 · SmartDoc | 程式在 `smartdoc-ai/`（不是子產品） |

## 本機

```powershell
cd web
.\start-local.ps1
```

```bash
cd smartdoc-ai && npm install && npm run build
```

## 與 AI

想法 → 只改 MD，寫入 `01`＋`03` → 你說「改程式」才改 code → 你說「發布」才上線。

MIT
