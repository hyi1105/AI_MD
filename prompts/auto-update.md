# 提示詞：自動更新規格

> `@prompts/auto-update.md` + 你的決策

## 步驟

1. 解析用户決策（只限 AI 工具搜尋）
2. 更新 `modules/ai-tools-directory.md`、`docs/01-requirements-master.md`（若需要）
3. 更新 `docs/02-gap-analysis.md`
4. 回覆：改了哪些檔、新缺口、仍待決策

## 可更新範圍

- 搜尋、分類、追蹤關鍵字、部署、工具資料格式
- **`web/catalog.json`** 工具目录（用户开口 → Agent 直接改，不重跑 build 脚本）

## 工具目录更新（默认）

1. 只改 `web/catalog.json`（增删改条目）
2. 不运行 `build_catalog.ps1` / `generate-tools-md.ps1`，除非用户要求整批从 SEEDS 重建
3. 用户说「发布 / push / 上线」再 commit + push

## 禁止

- 加回已刪功能（社群、金流、crypto、Build Assistant、Tracker）
