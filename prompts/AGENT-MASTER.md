# AI 規則（執行前必讀）

你在 **SEED Platform**。  
AI 查詢目錄與 SmartDoc 是**採集／輸出工具**，不是產品本體。

## 0. 每次動手之前

1. 讀 [`docs/00-seed-platform.md`](../docs/00-seed-platform.md)（產品是什麼）  
2. 讀本檔（工作方式）  
3. 有待辦／進度 → 更新 [`docs/01-idea.md`](../docs/01-idea.md)  
4. 完成或取消 → 移到 [`docs/02-idea-done.md`](../docs/02-idea-done.md)  
5. 驗收項目變化 → 更新 [`docs/03-checklist.md`](../docs/03-checklist.md)  

**不要**再建立平行的 STATUS／standup／requirements／gap 檔來當進度真相。

---

## 1. 語言

- 規格、回覆、文件敘述：**繁體中文**  
- 路徑、ID、API 名可保留英文  

---

## 2. 文件優先（預設）

| 負責人說 | 你才可以 |
|----------|----------|
| （一般想法／對齊／整理） | **只改 Markdown** |
| **改程式**／改 code／實作到網站 | 改 `web/`、`smartdoc-ai/`、`catalog.json` 等，並回寫 01／02／03 |
| **發布**／上線／push／部署 | commit＋push（或依指示部署） |
| **改程式並發布** | 先改程式與 MD，再發布 |

未下令改程式時，回覆結尾註明：**尚未改程式／尚未發布**。

可改（預設）：`docs/**/*.md`、`README.md`、本檔、必要時 `.cursor/rules/*.mdc`（須與本檔一致）。

---

## 3. 產品語言

- **SEED**＝知識書（產品概念）  
- SmartDoc 的 `sd_…`＝內容指紋／edition id，**不要叫成產品 SEED**  
- 禁止說「本專案只做 AI 工具搜尋」（已退役）  
- 功能敘述順序：發現 → 採集 → 編修 → 發布／分享一本 SEED  

---

## 4. 對話如何入檔（01 / 02）

每次負責人提出想法或需求：

1. 在 `01-idea.md` 新增一筆 `IDEA-xxx`（來源日期、為什麼、要做什麼）  
2. 若已可操作驗收，在 `03-checklist.md` 加對應勾選項  
3. 實作完成或明確取消後，**整段移到** `02-idea-done.md`（標 done／cancelled）  

---

## 5. 指令速查

| 負責人說 | 做什麼 |
|----------|--------|
| 整理文件／歸檔構想 | 只改 00～03、README、本檔 |
| 審查缺口 | 對照 00＋01＋03；更新 01／03；繁中回覆 |
| 改程式 | 改 code＋回寫 01／02／03 |
| 發布 | 才 push／部署 |

---

## 6. 目錄資料（僅在允許改程式／改目錄時）

- 列表真相：`web/catalog.json`  
- `web/data.js` 只負責載入＋精選評估，不是完整列表  
- 日常改目錄：直接改 JSON；不要重跑 bulk 腳本，除非負責人要求整批重建  
- 詳情無 MD 時用 catalog 欄位 fallback  

---

## 7. 程式路徑（下令後）

| 區域 | 路徑 |
|------|------|
| 主站／目錄 | `web/` |
| SmartDoc 原始碼 | `smartdoc-ai/` → 建置到 `web/smartdoc/` |

SmartDoc 長篇規格：`smartdoc-ai/docs/PRD.md`（子專案內；是否併入 docs/ 由負責人決定）。
