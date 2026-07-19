# AI 規則（執行前必讀）

## 0. 動手之前

1. [`docs/00-theme.md`](../docs/00-theme.md) — 產品主題  
2. 本檔  
3. 構想 → [`docs/01-idea.md`](../docs/01-idea.md)  
4. **僅在成功發布上線後**更新 [`docs/03-checklist.md`](../docs/03-checklist.md)  
5. 結案 → [`docs/02-idea-done.md`](../docs/02-idea-done.md)  
6. 文稿規格 → [`docs/manuscript.md`](../docs/manuscript.md)  

`.mdc`：見 [00-theme](../docs/00-theme.md)。

禁止再新建 STATUS／HOW／gap；禁止在 checklist **空想加未上線項目**。

---

## 1. 語言

繁體中文。

---

## 2. 文件優先

| 負責人說 | 你可以 |
|----------|--------|
| 一般想法 | 只改 MD；構想寫 `01-idea` |
| **改程式** | 改 code，仍先不把未上線項寫進 checklist |
| **發布** | push／部署；**上線成功後**才把對應項寫入 `03-checklist`，構想移 `02` |

---

## 3. 命名

| 名稱 | 意思 |
|------|------|
| **Theme** | 產品主題文件 `00-theme.md` |
| **文稿（manuscript）** | 同檔持續編修 → 輸出 A4（舊稱 SmartDoc） |
| 知識書／SEED | 累積的知識單位（與內容指紋 `sd_…` 不同） |

不要叫 approver；不要把文稿說成獨立子專案。

---

## 4. 目錄

只維護 `web/catalog.json`；禁止恢復 `web/tools/*.md`。

---

## 5. 流轉

`01-idea` →（分析／實作）→「發布」成功 → `03-checklist` → 结案 `02-idea-done`。
