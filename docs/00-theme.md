# 00 — Theme（產品主題）

> 更新：2026-07-19  
> 一句話：**本站主題是長期關注某個產品或 KOL 的知識；把專業累積成可分享的知識書（產品語言仍可稱 SEED）。畫面上是不同類型的 AI 資料收集／輸出工具。**

| 文件 | 用途 |
|------|------|
| 本檔 `00-theme.md` | 產品主題是什麼 |
| [`01-idea.md`](./01-idea.md) | 每次對話／構想入檔（尚未上線） |
| [`02-idea-done.md`](./02-idea-done.md) | 已完成或已取消的構想归档 |
| [`03-checklist.md`](./03-checklist.md) | **已成功上線後**的驗收勾選（勿人工空想加條） |
| [`manuscript.md`](./manuscript.md) | **文稿**：同一份檔持續編修 → 輸出 A4 |
| [`../prompts/AGENT-MASTER.md`](../prompts/AGENT-MASTER.md) | AI 執行前規則 |
| [`../README.md`](../README.md) | 對外入口 |

---

## 1. 主題核心

| 名稱 | 意思 |
|------|------|
| **主題（Theme）** | 本站要成為什麼：長期關注 × 知識累積 × 可分享 |
| **知識書（SEED）** | 一個人／產品／KOL 長期累積的專業知識單位 |
| **讀者／關注者** | 長期追蹤某本知識書 |
| **編排者** | 在授權下整理、策展他人知識書 |
| **商業行為** | 訂閱、解鎖、分成、授權等（構想先寫 01，上線後才進 checklist） |

> 知識書（SEED）≠ 文稿工具裡的內容指紋 `sd_…`。

---

## 2. 網站要成為什麼

1. **產品（Product）** — 某產品的使用知識、決策、最佳實務  
2. **KOL／專家** — 個人專業的長期出版與更新  

路徑：**關注 → 累積 → 回訪 → 分享／購買**。

---

## 3. 工具（都是收集／輸出工具，沒有子專案）

```text
主題（Theme）
├── 工具：AI 查詢（catalog.json）— 發現／對照素材
├── 工具：文稿（程式資料夾暫為 smartdoc-ai/）— 同檔持續編修 → 輸出 A4
└── （構想中）知識書架 — 關注、編排、分享 → 先寫 01-idea，上線後才進 checklist
```

| 工具 | 說明 |
|------|------|
| AI 查詢 | 搜尋 `web/catalog.json`；詳情只靠 JSON |
| **文稿** | 規格見 [`manuscript.md`](./manuscript.md)；讓使用者一直編同一份檔，並可輸出 A4 |

---

## 4. 文件怎麼流轉（重要）

```text
對話／構想  →  01-idea.md
       ↓
  程式分析內容、實作、成功「發布」上線
       ↓
  寫入／更新 03-checklist.md（只記錄線上已存在的能力）
       ↓
  構想結案  →  整段移到 02-idea-done.md
```

- **禁止**在 checklist 裡人工空想加「以後可能做」的條目。  
- 未上線的構想只留在 `01-idea.md`。

---

## 5. AI 規則檔（`.mdc`）

| 規則檔 | 內容 |
|--------|------|
| [theme.mdc](../.cursor/rules/theme.mdc) | 產品主題（永遠套用） |
| [md-first-workflow.mdc](../.cursor/rules/md-first-workflow.mdc) | 預設只改 MD；改程式／發布觸發詞 |
| [catalog-updates.mdc](../.cursor/rules/catalog-updates.mdc) | 目錄只改 `catalog.json` |
| [ai-md-framework.mdc](../.cursor/rules/ai-md-framework.mdc) | 編輯 docs 時的架構提醒 |

完整說明：[`AGENT-MASTER.md`](../prompts/AGENT-MASTER.md)

---

## 6. 技術現況（摘要）

| 項目 | 現況 |
|------|------|
| 主站 | `web/`；GitHub Pages |
| 列表＋詳情 | **`web/catalog.json` only** |
| 文稿程式 | `smartdoc-ai/` → `web/smartdoc/`（資料夾名待改程式時再換） |
| 線上 | https://hyi1105.github.io/AI_MD/ |
| 授權 | MIT |
