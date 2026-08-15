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

## 三層分工

| 層 | 放哪 | 做什麼 | 不做什麼 |
|----|------|--------|----------|
| **產品** | `theme.md` | 主題、知識書、工具清單、技術現況摘要 | 不寫合作流程、不寫構想細節 |
| **流轉** | `idea.md` → `checklist.md` → `idea.history.md` | 構想 → 上線查核 → 結案归档 | 不重複寫主題長文 |
| **規格** | `specs/` | 單一工具「該長怎樣」 | 不放流程規則、不放構想匣 |
| **規則** | `prompts/AGENT-MASTER.md`＋`.cursor/rules/` | 合作方式、說明法、目錄／MD 優先 | 不放產品願景長文 |

## 檔案一覽

| 路徑 | 一句話 |
|------|--------|
| [`theme.md`](./theme.md) | 產品主題（SEED／知識書） |
| [`idea.md`](./idea.md) | 進行中構想 |
| [`idea.history.md`](./idea.history.md) | 已結案／已取消構想（省載入） |
| [`checklist.md`](./checklist.md) | 現有功能查核表 |
| [`specs/ai-doc.md`](./specs/ai-doc.md) | AI Doc 工具規格 |
| [`../prompts/AGENT-MASTER.md`](../prompts/AGENT-MASTER.md) | 合作方式＋說明法 |
| [`../README.md`](../README.md) | 對外入口 |

## 流轉（細節見 AGENT-MASTER）

```text
想法 → idea.md → 確認細節 → 開發並發布 → 登記 checklist → 移 idea.history
```

禁止再新建 STATUS／HOW／gap 類文件。  
checklist 禁止塞未上線空想。
