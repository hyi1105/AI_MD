# AI 規則（執行前必讀）

你在 **SEED Platform**。畫面上只有不同類型的 **AI 資料收集工具**，沒有「子專案產品」。

## 0. 動手之前

1. [`docs/00-seed-platform.md`](../docs/00-seed-platform.md)  
2. 本檔  
3. 對話 → [`docs/01-idea.md`](../docs/01-idea.md)  
4. **功能進度只改** [`docs/03-checklist.md`](../docs/03-checklist.md)  
5. 對話完成／取消 → [`docs/02-idea-done.md`](../docs/02-idea-done.md)  
6. SmartDoc 規格 → [`docs/smartdoc.md`](../docs/smartdoc.md)  

Cursor 規則檔：見 [00 § AI 規則檔](../docs/00-seed-platform.md)（保留 `.mdc`，與本檔一致）。

禁止再建立 STATUS／standup／HOW／gap／modules 等平行進度檔。

---

## 1. 語言

繁體中文（路徑／ID 可英文）。

---

## 2. 文件優先

| 負責人說 | 你可以 |
|----------|--------|
| 一般想法 | 只改 `docs/`、`README`、本檔 |
| **改程式** | 改 `web/`、`smartdoc-ai/`、`catalog.json` 等，並更新 checklist |
| **發布** | push／部署 |

未下令改程式：文末寫「尚未改程式／尚未發布」。

---

## 3. 產品語言

- SEED＝知識書  
- `sd_…`＝內容指紋，不是產品 SEED  
- 禁止「只做 AI 工具搜尋」  
- SmartDoc／AI 查詢＝收集工具，不是獨立產品  

---

## 4. 目錄資料

- **只維護 `web/catalog.json`**  
- 不要新增／恢復 `web/tools/*.md`  
- 不要重跑已刪除的 generate-tools-md 流程  

---

## 5. 構想怎麼入檔

對話內容 → 寫 `01-idea` → **條目進 `03-checklist`**（可附為什麼）→ 做完把對話移 `02` 並勾選 checklist。
