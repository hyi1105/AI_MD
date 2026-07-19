# 提示詞：自動更新規格（文件優先）

> `@prompts/auto-update.md` + 你的決策

## 步驟

1. 解析負責人決策（繁體中文紀錄）
2. 預設**只更新 Markdown**：
   - 定位 → `docs/00-seed-platform.md`
   - 進度／風險 → `docs/STATUS.md`
   - 需求 ID → `docs/01-requirements-master.md`（必要時 `modules/ai-tools-directory.md`）
   - HOW → `docs/03-implementation.md`
   - 會議 → `docs/standup.md`
3. 回覆：改了哪些 MD、新缺口、仍待決策；並註明「尚未改程式／尚未發布」
4. 僅當負責人說「改程式」「發布」時，才動程式或 push（見 `md-first-workflow.mdc`）

## 可更新範圍（預設＝文件）

- 產品定位、商業方向、書架／關注敘述
- 搜尋、分類、追蹤、部署方式等**規格文字**
- 真／假能力表、Approve 清單
- 目錄欄位 schema 的**文件說明**（實際改 `catalog.json` 要等「改程式」或明確「改目錄」）

## 禁止（預設）

- 未下令就改程式或部署
- 加回已明確刪除、且負責人未重新批准的功能敘述當「已完成」
- 英文覆寫整份規格（識別字除外）
