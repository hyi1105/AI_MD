# 00 — Theme（產品主題）

> 更新：2026-07-19  
> 一句話：**本站主題是長期關注某個產品或 KOL 的知識；把專業累積成可分享的知識書（產品語言仍可稱 SEED）。畫面上是不同類型的 AI 資料收集／輸出工具。**

| 文件 | 用途 |
|------|------|
| 本檔 `00-theme.md` | 產品主題是什麼 |
| [`01-idea.md`](./01-idea.md) | **進行中／未結案**的構想（寫清楚 Why／What／How／優缺點） |
| [`02-idea-done.md`](./02-idea-done.md) | **已結案**構想归档（與 01 分開，查資料時少載入、省成本） |
| [`03-checklist.md`](./03-checklist.md) | **現有功能查核表**：改版時對照線上／程式，發現「少了什麼功能」 |
| [`ai-doc.md`](./ai-doc.md) | **AI Doc**：像 Cursor 一樣用 AI 改檔，並顯示修改處 |
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
| **商業行為** | 訂閱、解鎖、分成、授權等（構想寫 01；做成後列入 checklist 查核） |

> 知識書（SEED）≠ AI Doc 裡的內容指紋 `sd_…`。

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
├── 工具：AI Doc（程式資料夾 `aidoc/`）— AI 改檔 + 顯示 Diff
└── （構想中）知識書架 — 關注、編排、分享 → 先寫 01-idea
```

| 工具 | 說明 |
|------|------|
| AI 查詢 | 搜尋 `web/catalog.json`；詳情只靠 JSON |
| **AI Doc** | 規格見 [`ai-doc.md`](./ai-doc.md)；AI 像 Cursor 改每一份檔，產出後顯示修改處 |

---

## 4. 三份文件怎麼分工（重要）

| 檔案 | 像什麼 | 用途 |
|------|--------|------|
| `01-idea` | 待辦構想匣 | 你說的新想法；寫清楚 Why／What／How／Pros／Cons |
| `02-idea-done` | 舊構想倉庫 | 已做完或已取消的 idea；**與 01 拆開是為了查檔時少讀資料、省成本** |
| `03-checklist` | **功能查核表** | 記錄「產品現在應該具備哪些功能」；改版後 AI 對照線上／程式，發現缺漏 |

```text
新構想  →  01-idea.md（寫清楚）
實作並發布成功後
       →  把該能力登記進 03-checklist.md（供日後查核）
構想結案
       →  該則從 01 移到 02-idea-done.md（01 保持精簡）
```

**Checklist 查核（Lister）**：負責人說「查核／對照 checklist」時，AI 應讀 `03-checklist` 與現況（頁面／程式），回報哪幾項消失或變半真。

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
| AI Doc 程式 | `aidoc/` → 建置到 `web/aidoc/` |
| 線上 | https://hyi1105.github.io/AI_MD/ · AI Doc：`/aidoc/` |
| 授權 | MIT |
