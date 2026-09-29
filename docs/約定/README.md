# 約定（省 token 入口）

> **目的：** 個人／學習／系統記憶按需載入。禁止整包讀完。  
> **最後更新：** 2026-09-29  
> **產品構想**不在這裡 → [`../idea.md`](../idea.md)＋[`../../prompts/AGENT-MASTER.md`](../../prompts/AGENT-MASTER.md)

## 架構

```text
docs/約定/
├── README.md     ← 你在讀：觸發表（何時加讀）
├── 核心.md       ← 個性／教學／記憶法（短；非產品流）
├── 個人/         ← 口味、英語
├── 學習/         ← 關卡節奏、教材進度、可貼版
└── 系統/         ← 主線、簽核產品記憶

.cursor/skills/system-map/  ← 陌生系統 Skill（按需；含 references/）
```

**不放這裡（避免重複、省 token）：** idea／history、SEED 主題、AI Doc 規格、構想流 → 本庫 `docs/`＋`prompts/` 已有。

## 讀取表（強制）

| 時機 | 加讀 | 不要讀 |
|------|------|--------|
| 一般產品開發 | （無；跟 AGENT-MASTER／theme） | 本目錄其餘 |
| 回覆風格／個性／「都可以」 | [`核心.md`](./核心.md) | — |
| 想更合口味 | + [`個人/口味累積.md`](./個人/口味累積.md) | — |
| 在教／開關卡 | + [`學習/節奏與工具.md`](./學習/節奏與工具.md) | — |
| NotebookLM 語音 | + [`學習/NotebookLM.md`](./學習/NotebookLM.md) | — |
| 續 dive-into-llms | + [`學習/dive-into-llms.md`](./學習/dive-into-llms.md) | — |
| 英語郵件 | + [`個人/英語.md`](./個人/英語.md) | — |
| 談／做簽核產品記憶 | + [`系統/簽核.md`](./系統/簽核.md) | — |
| 主線對齊 | + [`系統/主線.md`](./系統/主線.md) | — |
| 陌生系統／衝擊 | + [`.cursor/skills/system-map/SKILL.md`](../../.cursor/skills/system-map/SKILL.md)；需要再讀 `references/` | — |
| 貼外站 Agent | 只用 [`學習/給其他Agent可貼版.md`](./學習/給其他Agent可貼版.md) | 整庫 |

## 怎麼改

1. 只改**對應那一個小檔**；檔頂更新日期。  
2. 禁止併回單一巨檔。  
3. 「以後都這樣」→ [`個人/口味累積.md`](./個人/口味累積.md)（一行一條）。  
4. 產品奇想 → [`../idea.md`](../idea.md)，不要寫進口味。  
5. 影響每次回覆的硬規則 → 才改 [`核心.md`](./核心.md)（保持短）＋同步 `.cursor/rules/約定.mdc` 摘要。
