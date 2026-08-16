# Theme（產品主題）

> 更新：2026-08-15  
> 一句話：**本站主題是長期關注某個產品或 KOL 的知識；把專業累積成可分享的知識書（產品語言仍可稱 SEED）。畫面上是不同類型的 AI 資料收集／輸出工具。**  
> 文件分類見 [`README.md`](./README.md)；合作方式見 [`../prompts/AGENT-MASTER.md`](../prompts/AGENT-MASTER.md)。

---

## 1. 主題核心

| 名稱 | 意思 |
|------|------|
| **主題（Theme）** | 本站要成為什麼：長期關注 × 知識累積 × 可分享 |
| **知識書（SEED）** | 一個人／產品／KOL 長期累積的專業知識單位 |
| **讀者／關注者** | 長期追蹤某本知識書 |
| **編排者** | 在授權下整理、策展他人知識書 |
| **商業行為** | 訂閱、解鎖、分成、授權等（構想寫 idea；做成後列入 checklist 查核） |

> 知識書（SEED）≠ AI Doc 裡的內容指紋 `sd_…`。

---

## 2. 網站要成為什麼

1. **產品（Product）** — 某產品的使用知識、決策、最佳實務  
2. **KOL／專家** — 個人專業的長期出版與更新  

路徑：**關注 → 累積 → 回訪 → 分享／購買**。

---

## 3. 工具（獨立 idea＝獨立資料夾＝首頁按鈕）

登錄表：[`../web/apps.json`](../web/apps.json)（首頁只認這份）。  
分類：`tool` 工具｜`demo` 示範。細節見 [`README.md`](./README.md)。

```text
主題（Theme）
├── 工具 tool
│   ├── AI 查詢 — query.html + catalog.json
│   ├── 說明法 — web/explain/
│   └── AI Doc — aidoc/ → web/aidoc/
└── 示範 demo
    ├── 簽核 Demo — web/approval/
    └── 系統地圖 — web/system-map/
```

| 工具 | 說明 |
|------|------|
| AI 查詢 | 搜尋 `web/catalog.json`；詳情只靠 JSON |
| **說明法** | 文字／文件／圖片 → 說明法樹；真 AI（BYOK）；`/explain/` |
| **AI Doc** | 規格見 [`specs/ai-doc.md`](./specs/ai-doc.md)；AI 像 Cursor 改每一份檔，產出後顯示修改處 |
| 簽核 Demo | LINE 對話＋獨立格式卡；`/approval/` |
| 系統地圖 | 簽核積木磁貼四視角換皮（流程圖／SQL／PA／Shared Enclosure）：`/system-map/` |

---

## 4. 技術現況（摘要）

| 項目 | 現況 |
|------|------|
| 主站 | `web/`；GitHub Pages |
| 列表＋詳情 | **`web/catalog.json` only** |
| AI Doc 程式 | `aidoc/` → 建置到 `web/aidoc/` |
| 線上 | https://hyi1105.github.io/AI_MD/ · AI Doc：`/aidoc/` |
| 授權 | MIT |
