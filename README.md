# SEED Platform

**長期關注產品或 KOL 知識的網站。**  
每個人／每個產品累積的專業知識，打包成一本可分享的 **SEED（知識書）**；他人可關注、編排、分享，並可延伸商業行為。

> 線上：**https://hyi1105.github.io/AI_MD/**

- 北極星：[docs/00-seed-platform.md](docs/00-seed-platform.md)  
- **狀態總覽（問題／未做／你要留意）**：[docs/STATUS.md](docs/STATUS.md)

## 架構（給協作者）

| 層級 | 路徑 | 角色 |
|------|------|------|
| **SEED 平台** | 本站整體 | 關注、累積、分享知識書 |
| 採集工具 · AI 查詢 | `web/` | 發現與對照素材 |
| 採集工具 · SmartDoc | `smartdoc-ai/` → `web/smartdoc/` | 編修 Markdown，輸出 SEED 內容 |

現有編輯器／P2P／目錄搜尋都是 **工具**，目的是產出 SEED，不是產品本體。

## 線上入口

| 入口 | 網址 |
|------|------|
| 平台首頁（含系統／工具切換） | https://hyi1105.github.io/AI_MD/ |
| SmartDoc 編修工具 | https://hyi1105.github.io/AI_MD/smartdoc/ |

## 本機開發

```powershell
cd web
.\start-local.ps1
# 或：python -m http.server 8080
```

改 SmartDoc 原始碼後：

```bash
cd smartdoc-ai
npm install
npm run build   # 輸出到 web/smartdoc/
```

## 決策摘要

| 項目 | 決策 |
|------|------|
| 產品 | **SEED**＝可累積的知識書 |
| 網站 | 長期關注 Product / KOL 知識 |
| 工具 | AI 查詢、SmartDoc（採集／輸出） |
| 運行 | GitHub Pages（`web/`） |
| 授權 | MIT |

## 文件

- [docs/00-seed-platform.md](docs/00-seed-platform.md) — 定位（必讀）
- [docs/03-implementation.md](docs/03-implementation.md) — 實作 HOW
- [INDEX.md](INDEX.md) — 文件索引
