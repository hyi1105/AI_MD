# AI 規則（執行前必讀）

## 0. 三份文件定位（先讀懂）

| 檔案 | 定位 |
|------|------|
| [`docs/01-idea.md`](../docs/01-idea.md) | **進行中**構想（寫清楚 Why／What／How／Pros／Cons） |
| [`docs/02-idea-done.md`](../docs/02-idea-done.md) | **已結案**構想归档；與 01 分開＝**查檔少載入、省成本** |
| [`docs/03-checklist.md`](../docs/03-checklist.md) | **現有功能查核表**；改版後對照現況，發現缺漏功能 |

另：[`docs/00-theme.md`](../docs/00-theme.md) 主題 · [`docs/ai-doc.md`](../docs/ai-doc.md) AI Doc 規格 · `.mdc` 見 00-theme。

禁止再新建 STATUS／HOW／gap。  
禁止把「還沒做過的空想」塞進 checklist。

---

## 1. 語言（一律繁體中文）

- 回覆、文件、構想整理：**繁體中文**。  
- 語音轉文字若英／簡／錯字：入檔時改寫正確繁中。  
- 僅路徑／API／ID 可英文。  

---

## 2. 文件優先

| 負責人說 | 你可以 |
|----------|--------|
| 一般構想 | 只改 MD；寫入 `01-idea`（完整欄位） |
| **查核／對照 checklist** | 讀 `03-checklist`＋線上／程式，回報缺漏；消失項標 `[!]` |
| **改程式** | 改 code |
| **發布** | push／部署；成功後把**新具備的功能**登記進 `03-checklist`；該則構想移 `02` |

---

## 3. 命名

| 名稱 | 意思 |
|------|------|
| Theme | `00-theme.md` |
| 文稿／AI Doc | **AI Doc**：像 Cursor 改檔並顯示修改處（舊稱 SmartDoc／文稿） |
| Lister／查核 | 依 checklist 自動對照現況、找缺功能 |

---

## 4. 目錄

只維護 `web/catalog.json`。

---

## 5. 流轉

```text
構想 → 01-idea（清楚條列）
  → 改程式／發布成功
  → 登記功能到 03-checklist（供日後查核）
  → 該則構想移到 02-idea-done（讓 01 保持精簡、省成本）
```

---

## 6. 寫入 Idea 的品質（必守）

每則 `01-idea` 至少含：Why／What／How／Pros／Cons／替代方案／完成後列入 checklist 的查核句／待拍板。
