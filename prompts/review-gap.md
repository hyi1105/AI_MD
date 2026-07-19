# 提示詞：缺口審查

> `@prompts/review-gap.md 審查缺口`

## 步驟

1. 讀 `docs/00-seed-platform.md`、`docs/STATUS.md`、`docs/00-vision.md`、必要時 `modules/ai-tools-directory.md` 與 `web/`（只讀）
2. 比對：北極星 vs 現況 vs 規格 status
3. 更新 `docs/STATUS.md`（主）；摘要可寫入 `docs/02-gap-analysis.md`
4. 用**繁體中文**回覆：平台缺口、目錄工具狀態、SmartDoc 真／假能力、建議下一步 3 項、已改哪些 MD
5. **不要改程式、不要發布**（除非負責人另有下令）

## Checklist

- [ ] 是否仍把「目錄搜尋」誤當成整個產品？
- [ ] SEED 書架／關注／商業是否標成未做（若仍未做）
- [ ] SmartDoc：真能力 vs 模擬（AI／P2P／金流）是否與 STATUS 一致
- [ ] F-01～F-10 與 `modules/ai-tools-directory.md` 是否打架（例如 F-10）
- [ ] 資料來源敘述是否仍誤寫 `data.js` 為完整列表（實際為 `catalog.json`）

## 禁止

- 預設直接改 `web/` 或 `smartdoc-ai/` 程式
- 用過時的「只做 AI 工具搜尋」當產品邊界
