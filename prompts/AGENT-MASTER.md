# AI 規則（執行前必讀）

## 0. 合作方式（負責人 ↔ AI）

```text
你分享想法／對話
  → AI 整理成清楚條目
  → 寫入 docs/idea.md
  → AI 列出「待確認細節」跟你對過

你確認細節（確認／OK／就這樣／沒意見…）
  → AI **直接開發並發布**（不必再說「改程式」「發布」）
  → 成功後登記 docs/03-checklist.md
  → 該則構想從 idea.md 移到 docs/idea.history.md

之後改版時說「查核 checklist」
  → AI 對照線上／程式，找出缺漏功能
```

| 你做什麼 | AI 做什麼 |
|----------|-----------|
| 分享想法、聊天、語音轉文字 | 改寫繁中、補齊欄位、**只改 MD**，存進 `idea.md`；並列出待確認細節 |
| **確認細節**（確認／OK／就這樣／沒意見等） | **直接開發並發布**上線；成功後登記 checklist，構想移 `idea.history` |
| 說「查核／對照 checklist」 | 讀 `03-checklist`＋現況，回報缺漏 |
| （可選）仍說「改程式」／「發布」 | 同等觸發開發／上線（舊詞仍有效） |

**硬規則**：細節**未**跟負責人確認前，只改 MD、不動 code、不上線。確認後不必再等第二次口令。

---

## 1. 文件定位

| 檔案 | 定位 |
|------|------|
| [`docs/idea.md`](../docs/idea.md) | **進行中**構想（對話整理後存放處） |
| [`docs/idea.history.md`](../docs/idea.history.md) | **已結案**構想归档（舊名 `02-idea-done`）；與 idea 分開＝少載入、省成本 |
| [`docs/03-checklist.md`](../docs/03-checklist.md) | **現有功能查核表**；改版後對照現況，發現缺漏 |

另：[`docs/00-theme.md`](../docs/00-theme.md) 主題 · [`docs/ai-doc.md`](../docs/ai-doc.md) AI Doc 規格 · `.mdc` 見 00-theme。

禁止再新建 STATUS／HOW／gap。  
禁止把「還沒做過的空想」塞進 checklist。

---

## 2. 語言（一律繁體中文）

- 回覆、文件、構想整理：**繁體中文**。  
- 語音轉文字若英／簡／錯字：入檔時改寫正確繁中。  
- 僅路徑／API／ID 可英文。  

---

## 3. 命名

| 名稱 | 意思 |
|------|------|
| Theme | `00-theme.md` |
| Idea | `idea.md`（進行中）／`idea.history.md`（已結案） |
| 文稿／AI Doc | **AI Doc**：像 Cursor 改檔並顯示修改處（舊稱 SmartDoc／文稿） |
| Lister／查核 | 依 checklist 自動對照現況、找缺功能 |

---

## 4. 目錄

只維護 `web/catalog.json`。  
目錄變更：負責人說「改目錄」，或**已確認細節的開發**本身需要改目錄時才改。

---

## 5. 流轉

```text
對話／想法 → AI 整理 → idea.md → 列出待確認細節
  → 負責人確認細節
  → AI 直接開發並發布
  → 登記功能到 03-checklist.md（供日後查核）
  → 該則構想移到 idea.history.md（讓 idea.md 保持精簡）
```

---

## 6. 寫入 Idea 的品質（必守）

每則 `idea.md` 至少含：Why／What／How／Pros／Cons／替代方案／完成後列入 checklist 的查核句／待拍板（待確認細節）。
