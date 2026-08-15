# Docs 架構

> 這份是 **唯一** 的文件分類地圖。各檔只做一件事，流程細節只在 `prompts/AGENT-MASTER.md`。

## 怎麼讀

```text
先看什麼
├── docs/README.md — 你現在在這：分類地圖
├── docs/theme.md — 產品要成為什麼
├── prompts/AGENT-MASTER.md — 跟 AI 怎麼合作（含說明法）
├── docs/idea.md — 還沒做完的構想
├── docs/checklist.md — 現在線上該有哪些功能
└── docs/specs/ — 單一工具的規格書
```

## 三層分工（文件）

| 層 | 放哪 | 做什麼 | 不做什麼 |
|----|------|--------|----------|
| **產品** | `theme.md` | 主題、知識書、工具清單、技術現況摘要 | 不寫合作流程、不寫構想細節 |
| **流轉** | `idea.md` → `checklist.md` → `idea.history.md` | 構想 → 上線查核 → 結案归档 | 不重複寫主題長文 |
| **規格** | `specs/` | 單一工具「該長怎樣」 | 不放流程規則、不放構想匣 |
| **規則** | `prompts/AGENT-MASTER.md`＋`.cursor/rules/` | 合作方式、說明法、目錄／MD 優先 | 不放產品願景長文 |

## 整庫分類（程式／站）

你的工作方式：**隨時丟獨立 idea → 做成獨立資料夾 → 首頁一個按鈕**。  
對應規則如下（**不要**再拆成很多互相依賴的子專案）：

```text
/
├── docs/          — 腦（主題／idea／查核／規格）
├── prompts/       — AI 怎麼合作
├── .cursor/rules/ — 開新對話自動套用的短規則
├── aidoc/         — 唯一例外：需要 build 的原始碼（產出進 web/aidoc/）
└── web/           — 臉（GitHub Pages 根）
    ├── index.html     — 首頁＝按鈕牆
    ├── apps.json      — **所有獨立 idea 的登錄表**（首頁只認這份）
    ├── catalog.json   — 「AI 查詢」用的外部工具名單（≠ 本站 apps）
    ├── query.html …   — AI 查詢殼（無獨立資料夾的特例）
    ├── <slug>/        — 每個 idea 一個獨立資料夾（自含 html/css/js）
    ├── assets/        — 共用靜態圖
    ├── schema/        — 表單規格範例（示範用）
    └── tools/         — 空著；禁止放工具 .md（資料只靠 catalog.json）
```

### 兩個「名單」不要搞混

| 檔案 | 是什麼 |
|------|--------|
| `web/apps.json` | **本站**自己做的獨立頁／Demo（首頁按鈕） |
| `web/catalog.json` | **外面** AI 產品目錄（給「AI 查詢」搜的） |

### 首頁按鈕分類（`apps.json` 的 category）

| category | 中文 | 什麼時候用 |
|----------|------|------------|
| `tool` | 工具 | 真的給人用、可重複打開做事 |
| `demo` | 示範 | 假畫面／教學／驗證互動（可先丟、可後汰） |

### 新 idea 上線三步（確認細節後）

```text
1. 建 web/<slug>/（獨立資料夾，自含頁面）
2. 在 web/apps.json 加一筆（title／href／category）
3. 登記 docs/checklist.md；構想移 idea.history
   （若有規格長文 → docs/specs/<slug>.md）
```

路徑維持扁平 `web/<slug>/`，**不要**再包一層 `web/apps/`——獨立資料夾＋穩定網址最重要。

## 檔案一覽

| 路徑 | 一句話 |
|------|--------|
| [`theme.md`](./theme.md) | 產品主題（SEED／知識書） |
| [`idea.md`](./idea.md) | 進行中構想 |
| [`idea.history.md`](./idea.history.md) | 已結案／已取消構想（省載入） |
| [`checklist.md`](./checklist.md) | 現有功能查核表 |
| [`specs/ai-doc.md`](./specs/ai-doc.md) | AI Doc 工具規格 |
| [`../web/apps.json`](../web/apps.json) | 首頁按鈕登錄表 |
| [`../prompts/AGENT-MASTER.md`](../prompts/AGENT-MASTER.md) | 合作方式＋說明法 |
| [`../README.md`](../README.md) | 對外入口 |

## 流轉（細節見 AGENT-MASTER）

```text
想法 → idea.md → 確認細節 → 開發並發布（資料夾＋apps.json＋按鈕）→ 登記 checklist → 移 idea.history
```

禁止再新建 STATUS／HOW／gap 類文件。  
checklist 禁止塞未上線空想。
