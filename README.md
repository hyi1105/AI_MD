# AI_MD

AI 工具查詢與 Markdown 知識庫 — 以 **Markdown 規格驅動** 的多產品平台藍圖。

## 功能（第一版）

- [x] AI 工具列表（名稱、分類、連結、簡介）— 見 `web/`
- [x] 依分類 / 關鍵字搜尋 — 見 `web/index.html`
- [ ] user 可以建立自己要長期追蹤的關鍵字，例如攝影、繪圖
- [ ] 每個工具一篇 Markdown 說明
- [ ] 簡單首頁展示（正式版）

## 技術

- 目前原型：HTML + CSS + JS（`web/`）
- 計劃：Next.js + Markdown
- 部署：Vercel（之後）

## 快速開始

```text
1. 預覽原型：雙擊 web/index.html
2. 讀 docs/00-vision.md          → 了解四大模組與優先級
3. 填 modules/ai-tools-directory.md → P0 第一個產品
4. 在 Cursor 輸入：
   @prompts/review-gap.md 審查整體缺口
```

## 目錄結構

```text
AI_MD/
├── docs/                 # 全局規格
│   ├── 00-vision.md
│   ├── 01-requirements-master.md
│   └── 02-gap-analysis.md    ← 缺口清單（AI 自動維護）
├── modules/              # 四大產品模組
├── prompts/              # 給 Cursor Agent 的提示詞
├── templates/            # 複製用模板
├── web/                  # ★ AI 工具搜尋原型（可開 index.html 預覽）
├── content/tools/        # 各 AI 工具的 MD 条目
└── .cursor/rules/        # Cursor 自動套用規則
```

## 四大模組

| 優先級 | 模組 | 說明 |
|--------|------|------|
| **P0** | AI 工具查詢網 | 目錄、搜尋、Markdown 說明 |
| P1 | 社群平台 | 貼文、互動、通知 |
| P2 | 金流服務 | 付款、訂單、退款 |
| P3 | 加密貨幣交易 | 行情、交易、合規 |

## 給 Cursor 的指令

| 想做什麼 | 指令 |
|----------|------|
| 審查缺什麼 | `@prompts/review-gap.md 審查整體缺口` |
| 更新規格 | `@prompts/auto-update.md` + 你的決策描述 |
| 填某模組 | `@modules/ai-tools-directory.md 幫我补 user story 和驗收標準` |

## 目前狀態

- **Web 原型**：`web/index.html` — 24 個 AI 工具、關鍵字搜尋、排序（桌面測試版已整合）
- 框架完成度：~25%（见 [docs/02-gap-analysis.md](docs/02-gap-analysis.md)）
- **下一步**：完善 `modules/ai-tools-directory.md` 的 User Story 與驗收標準

## 授權

待定（见缺口 G-202）
