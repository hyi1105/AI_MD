# 00 — SEED Platform（產品是什麼）

> 更新：2026-07-19  
> 一句話：**SEED 是一本可累積、可分享、可商業化的「知識書」；本站是長期關注某個產品或 KOL 知識的地方。畫面上的東西都是不同類型的 AI 資料收集／輸出工具。**

| 文件 | 用途 |
|------|------|
| 本檔 | 產品是什麼 |
| [`01-idea.md`](./01-idea.md) | 每次對話入檔（前因後果） |
| [`02-idea-done.md`](./02-idea-done.md) | 已完成／已取消的對話 |
| [`03-checklist.md`](./03-checklist.md) | **功能是否完善（唯一勾選真相）** |
| [`smartdoc.md`](./smartdoc.md) | SmartDoc 這類收集工具的規格 |
| [`../prompts/AGENT-MASTER.md`](../prompts/AGENT-MASTER.md) | AI 執行前規則 |
| [`../README.md`](../README.md) | 對外入口 |

---

## 1. 什麼是 SEED

| 名稱 | 意思 |
|------|------|
| **SEED** | 一個人（或一個產品／KOL）長期累積的專業知識單位，像一本持續更新的書 |
| **讀者／關注者** | 長期追蹤某本 SEED |
| **編排者** | 在授權下整理、策展他人 SEED |
| **商業行為** | 訂閱、解鎖、分成、授權等（待拍板） |

SEED＝**知識資產輸出**，不是某一個按鈕或編輯器。

> **SEED（知識書）** ≠ 畫面裡的內容指紋 `sd_…`。

---

## 2. 網站要成為什麼

長期關注導向的知識站：

1. **產品（Product）** — 某產品的使用知識、決策、最佳實務  
2. **KOL／專家** — 個人專業的長期出版與更新  

路徑：**關注 → 累積 → 回訪 → 分享／購買**。

---

## 3. 工具怎麼摆（都是收集工具，沒有子專案）

本 repo **只有一個產品（SEED）**。底下是不同類型的 AI 資料收集工具，方便產出 SEED：

```text
SEED 平台
├── 工具：AI 查詢（catalog.json）— 發現／對照素材
├── 工具：SmartDoc（smartdoc-ai/ 程式資料夾）— 編修／輸出 .md
└── （未來）SEED 書架 — 關注、編排、分享知識書
```

| 工具 | 說明 |
|------|------|
| AI 查詢 | 搜尋 `web/catalog.json`；詳情**只靠 JSON 欄位** |
| SmartDoc | 規格見 [`smartdoc.md`](./smartdoc.md)；程式在 `smartdoc-ai/` 僅為實作位置 |

---

## 4. 商業與分享（方向）

- 開放章節／付費解鎖、編排策展、平台抽成等 — 細節見 checklist §4 拍板項  
- P2P／分紅若做，只服務「傳書」，服從 SEED 主線  

---

## 5. AI 規則檔（Cursor `.mdc`，已保留）

機器端規則在 `.cursor/rules/`；與 [`AGENT-MASTER.md`](../prompts/AGENT-MASTER.md) 一致。可直接開啟：

| 規則檔 | 內容 |
|--------|------|
| [seed-platform.mdc](../.cursor/rules/seed-platform.mdc) | 產品北極星（永遠套用） |
| [md-first-workflow.mdc](../.cursor/rules/md-first-workflow.mdc) | 預設只改 MD；改程式／發布觸發詞 |
| [catalog-updates.mdc](../.cursor/rules/catalog-updates.mdc) | 目錄只改 `catalog.json` |
| [ai-md-framework.mdc](../.cursor/rules/ai-md-framework.mdc) | 編輯 docs 時的架構提醒 |

---

## 6. 技術現況（摘要）

| 項目 | 現況 |
|------|------|
| 主站 | `web/`；GitHub Pages |
| 列表＋詳情資料 | **`web/catalog.json` only** |
| SmartDoc 程式 | `smartdoc-ai/` → 建置到 `web/smartdoc/` |
| 線上 | https://hyi1105.github.io/AI_MD/ |
| 授權 | MIT |
