# 01 — 需求規格

> 更新：2026-07-18 | **F-01～F-10 為唯一 ID 對照表**

| ID | 需求 | MVP | 狀態 | 備註 |
|----|------|-----|------|------|
| F-01 | 工具列表（卡片） | 必做 | `done` | `web/` |
| F-02 | 關鍵字搜尋 | 必做 | `done` | `web/script.js` |
| F-03 | 分類篩選 UI | 延後 | `deferred` | 可用搜尋代替 |
| F-04 | 熱門標籤快捷搜尋 | 必做 | `done` | `web/` |
| F-05 | 排序（相關度/評分/名稱） | 必做 | `done` | `web/` |
| F-06 | 定價標記 | 必做 | `done` | `data.js` |
| F-07 | 外部連結至官網 | 必做 | `done` | 卡片可點 |
| F-08 | 自訂追蹤關鍵字 | **必做** | `done` | localStorage |
| F-09 | 工具 Markdown 詳情 | **必做** | `done` | `web/tools/` |
| F-10 | 公開上線 | 必做 | `done` | GitHub Actions → `web/` |

## 非功能 / 其他

| ID | 需求 | 狀態 | 備註 |
|----|------|------|------|
| N-01 | 介面繁體中文 | `partial` | 模板待統一 |
| N-02 | 說明可中英混合 | `partial` | |
| N-03 | 工具數量不限 | `ongoing` | 邊做邊加 |
| N-04 | MIT 授權 | `done` | `LICENSE` |
| N-05 | 登入同步追蹤 | `deferred` | v2 |

## 不做（v1）

- 登入、社群、金流、加密貨幣
- LLM 助手、自動爬蟲、使用者提交

## 技術決策

| 項目 | 決策 |
|------|------|
| 前端 | HTML + CSS + JS（`web/`） |
| 列表資料 | `web/data.js` |
| 詳情資料 | `content/tools/*.md` |
| 追蹤 v1 | localStorage |
| 追蹤 v2 | 登入同步（待定） |
| 運行 | **GitHub Pages**（`https://hyi1105.github.io/AI_MD/`） |
| 本機開發 | `web/start-local.ps1` |
| 維護 | 你 + Cursor AI |

## 變更紀錄

| 日期 | 摘要 |
|------|------|
| 2026-07-18 | 一問一答決策寫入；統一 F-ID；修正狀態 |
