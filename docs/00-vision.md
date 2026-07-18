# 00 — 專案願景

> 狀態：`draft` | 最後更新：2026-07-18 | 負責：hyi1105

## 一句話描述

以 **Markdown 規格驅動** 的多產品平台藍圖：先寫清楚需求，再逐步實作；AI 協助審查缺口並同步更新文件。

## 產品線（四大模組）

| 模組 | 檔案 | 優先級 | 說明 |
|------|------|--------|------|
| AI 工具查詢網 | [modules/ai-tools-directory.md](../modules/ai-tools-directory.md) | **P0** | 最先落地；目錄、搜尋、Markdown 說明 |
| 社群平台 | [modules/social-platform.md](../modules/social-platform.md) | P1 | 使用者、貼文、互動、通知 |
| 金流服務 | [modules/payment-service.md](../modules/payment-service.md) | P2 | 付款、訂單、退款、對帳 |
| 加密貨幣交易 | [modules/crypto-trading.md](../modules/crypto-trading.md) | P3 | 行情、下單、錢包、合規 |

## 核心原則

1. **Spec First**：任何功能先寫進 `.md`，通過缺口審查後才寫 code。
2. **模組獨立、共享基礎**：各模組可獨立 repo / 部署，但共用使用者、金流、通知等底層（待 `docs/02-architecture.md` 定義）。
3. **AI 可讀可改**：每份 MD 結構固定，方便 Agent 審查、補齊、更新。
4. **缺口可追蹤**：所有不足記錄在 [02-gap-analysis.md](./02-gap-analysis.md)，不可只口頭討論。

## 成功指標（第一階段）

- [ ] 四大模組皆有 **完整規格骨架**（非空白模板）
- [ ] [01-requirements-master.md](./01-requirements-master.md) 與各模組 **交叉引用一致**
- [ ] 缺口分析 **零個「未分類」項目**
- [ ] AI 工具查詢網 MVP 規格 **達 `review` 狀態**

## 非目標（現階段不做）

- 直接寫 production code（除非某模組規格達 `ready`）
- 一次做完四個產品
- 未經缺口審查就新增功能描述

## 相關文件

- [01-requirements-master.md](./01-requirements-master.md) — 跨模組總需求
- [02-gap-analysis.md](./02-gap-analysis.md) — 缺口清單（自動維護）
- [INDEX.md](../INDEX.md) — 全 repo 文件索引
