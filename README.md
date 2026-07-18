# AI_MD

**AI 工具搜尋** — 中文介面，快速找到適合的 AI 工具。

> 線上：**https://hyi1105.github.io/AI_MD/**

## 功能

- [x] 工具列表、搜尋、熱門標籤、排序
- [x] 自訂追蹤關鍵字（localStorage）
- [x] 每工具 Markdown 詳情（`web/tools/`）
- [x] GitHub Pages 公開上線

## 線上網站

**https://hyi1105.github.io/AI_MD/**

## 本機開發

```powershell
cd C:\Users\Admin\Projects\AI_MD\web
.\start-local.ps1
# 或：python -m http.server 8080
# 開啟 http://localhost:8080
```

## 可延後

- [ ] 分類篩選 UI
- [ ] 登入後跨裝置同步追蹤（v2）

## 決策摘要

| 項目 | 決策 |
|------|------|
| 運行 | **GitHub Pages**（`web/`） |
| 追蹤 | localStorage |
| 語言 | 介面繁中，說明可中英混合 |
| 資料 | 你 + Cursor AI |
| 授權 | MIT |

## 文件

- [docs/03-implementation.md](docs/03-implementation.md) — 實作 HOW
- [docs/02-gap-analysis.md](docs/02-gap-analysis.md) — 缺口
