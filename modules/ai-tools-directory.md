---
status: review
updated: 2026-07-19
module: ai-tools-directory
---

# AI 查詢工具 — 產品規格（採集工具子規格）

> 在 SEED Platform 中的角色：發現／對照素材，幫助產出 **SEED（知識書）**。  
> 平台北極星：[`docs/00-seed-platform.md`](../docs/00-seed-platform.md)  
> 可運行原型：`web/index.html`  
> **本文件 F-01～F-10 與 [01-requirements-master.md](../docs/01-requirements-master.md) 應對齊**

## 問題

使用者難以在大量 AI 工具中找到適合的中文說明，也難以長期追蹤自己關心的領域。

## User Stories

| ID | Story | MVP | 狀態 |
|----|-------|-----|------|
| AT-01 | 關鍵字搜尋工具 | 必做 | `done` |
| AT-02 | 點卡片前往官網 | 必做 | `done` |
| AT-03 | 自訂追蹤關鍵字並保存 | 必做 | `done` |
| AT-04 | 閱讀工具 Markdown 詳情 | 必做 | `done` |
| AT-05 | 依分類按鈕篩選 | 延後 | `deferred` |

## 功能對照（F-01～F-10）

| ID | 功能 | MVP | 狀態 |
|----|------|-----|------|
| F-01 | 工具列表 | 必做 | `done` |
| F-02 | 全文搜尋 | 必做 | `done` |
| F-03 | 分類篩選 UI | 延後 | `deferred` |
| F-04 | 熱門標籤 | 必做 | `done` |
| F-05 | 排序 | 必做 | `done` |
| F-06 | 定價標記 | 必做 | `done` |
| F-07 | 外部連結 | 必做 | `done` |
| F-08 | 追蹤關鍵字 | **必做** | `done` |
| F-09 | Markdown 詳情 | **必做** | `done` |
| F-10 | 公開上線 | 必做 | `done` |

## 驗收標準

| Story | Given | When | Then | 狀態 |
|-------|-------|------|------|------|
| AT-01 | 站上有 24+ 工具 | 搜尋「繪圖」 | 顯示 Midjourney 等相關結果；無結果有提示 | `done` |
| AT-02 | 工具卡片可見 | 點擊卡片 | 新分頁開啟官網 | `done` |
| AT-03 | 在追蹤設定 | 新增「攝影」並重新整理 | 關鍵字仍保留；相關工具有標示或篩選 | `done` |
| AT-04 | 工具已有 MD 檔 | 點工具詳情 | 顯示 Markdown 內容（優缺點、定價等） | `done` |
| AT-05 | — | — | v1 不做；可用搜尋代替 | `deferred` |

## 資料

| 用途 | 位置 | 維護 |
|------|------|------|
| 列表 / 搜尋 | `web/catalog.json`（`data.js` 的 `loadCatalog()`） | 負責人下令「改目錄／改程式」後由 Cursor 改 |
| 精選評估 | `web/data.js`（`TOP_TIER_*`） | 同上 |
| 詳情 | `web/tools/{id}.md`（無 MD 時 fallback catalog 欄位） | 同上 |
| 追蹤 v1 | localStorage | 瀏覽器本地 |
| 追蹤 v2 | 帳號同步 | 待做 |

**工具數量**：不限，邊做邊加。

## 不做（v1）

- 登入、社群、金流、crypto
- LLM 助手、自動爬蟲
- 使用者提交工具

## 決策紀錄（Open Questions → 已關閉）

| 問題 | 決策 |
|------|------|
| 部署方式？ | **GitHub Pages 已上線**（`https://hyi1105.github.io/AI_MD/`） |
| 分類篩選 MVP？ | **延後**，搜尋代替 |
| 追蹤關鍵字 MVP？ | **必做** |
| MD 詳情 MVP？ | **必做** |
| 追蹤存哪？ | **v1 localStorage → v2 登入** |
| 語言？ | **介面繁中，說明可中英混合** |
| 誰維護資料？ | **你 + Cursor AI** |
| 授權？ | **MIT** |
| 工具數量？ | **不限，功能優先** |

## 變更紀錄

| 日期 | 摘要 |
|------|------|
| 2026-07-19 | 對齊 SEED；F-10=`done`；列表來源改為 catalog.json |
| 2026-07-18 | 正式營運前改本機；F-10 延後（之後已上線，見上列） |
