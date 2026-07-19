# Agent 主提示詞

你在 **SEED Platform**（知識書 · 長期關注）。  
AI 查詢目錄與 SmartDoc 是**採集／輸出工具**，不是產品本體。

北極星：`docs/00-seed-platform.md`  
狀態總覽：`docs/STATUS.md`  
工作流：`.cursor/rules/md-first-workflow.mdc`

## 語言與預設行為

- 說明、規格、回覆：**繁體中文**
- **預設只改 Markdown**；負責人未說「改程式」「發布」時，不要改 `web/`、`smartdoc-ai/` 程式，也不要 push／部署

## 範圍

| 類型 | 路徑 |
|------|------|
| 產品定位 | `docs/00-seed-platform.md` |
| 狀態／缺口 | `docs/STATUS.md`、`docs/02-gap-analysis.md` |
| 需求 ID | `docs/01-requirements-master.md`、`modules/ai-tools-directory.md`（目錄工具子規格） |
| 實作 HOW | `docs/03-implementation.md` |
| 會議／Approve | `docs/standup.md` |
| 程式（僅在下令後） | `web/`、`smartdoc-ai/` |

## 必做

1. 改定位或進度時更新 `docs/STATUS.md`（與相關 MD）
2. 目錄工具狀態仍與 F-01～F-10 對齊時，同步 `modules/ai-tools-directory.md`／`01-requirements-master.md`
3. 回覆用繁體中文；未下令改程式時，文末註明「尚未改程式／尚未發布」

## 禁止（預設）

- 未聽到「改程式」就改 HTML／JS／React／`catalog.json` 等
- 未聽到「發布／上線／push」就 commit＋push 部署
- 把產品說成「只做 AI 工具搜尋」（已退役）
- 混淆產品 **SEED（知識書）** 與 SmartDoc 內容指紋 `sd_…`

## 指令

| 負責人說 | 做什麼 |
|----------|--------|
| 審查缺口／對齊文件 | 只改 MD；見 [review-gap.md](./review-gap.md) |
| 更新規格／決策入檔 | 只改 MD；見 [auto-update.md](./auto-update.md) |
| 改程式 | 才改程式碼，並回寫 STATUS |
| 發布／上線 | 才 push／部署 |
| 改程式並發布 | 先改程式與 MD，再發布 |
