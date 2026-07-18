# 02 — 缺口分析（Gap Analysis）

> **本文件由 AI 在審查時自動更新。** 人工修改後，請在「變更紀錄」留一行。
> 狀態：`draft` | 最後審查：2026-07-18

## 如何使用

1. 編輯任一 `modules/*.md` 或 `docs/*.md`
2. 在 Cursor 輸入：`@prompts/review-gap.md 審查整體缺口`
3. Agent 比對本文件 checklist，更新下方表格與建議

---

## 整體完成度

| 區塊 | 完成度 | 說明 |
|------|--------|------|
| 願景與優先級 | 40% | 四大模組已列出，缺里程碑日期 |
| 總需求 | 15% | 多數項目仍為 `missing` |
| 模組規格 | 10% | 骨架已建，內容待填 |
| 架構設計 | 0% | `02-architecture.md` 尚未建立 |
| 提示詞 / 自動化 | 50% | prompts 與 Cursor rule 已建 |
| 測試 / 驗收標準 | 0% | 無 acceptance criteria |

**綜合評分：約 19% — 仍處「框架期」，不可開始寫 business code。**

---

## 缺口清單（按嚴重度）

### 🔴 阻塞（Blocking）— 沒有就無法開工

| ID | 缺口 | 影響模組 | 建議補齊位置 | 狀態 |
|----|------|----------|--------------|------|
| G-001 | **MVP 未鎖定**：四個產品同時規劃，資源分散 | 全部 | [00-vision.md](./00-vision.md) | open |
| G-002 | **AI 工具網核心 user story 未寫** | ai-tools | [modules/ai-tools-directory.md](../modules/ai-tools-directory.md) | open |
| G-003 | **frontmatter / 元資料標準未定** | 全部 MD | [templates/module-spec.md](../templates/module-spec.md) | open |
| G-004 | **技術棧未決** | 全部 | 需新建 `docs/02-architecture.md` | open |

### 🟡 重要（Major）— 可并行補，但应在 coding 前完成

| ID | 缺口 | 影響模組 | 建議補齊位置 | 狀態 |
|----|------|----------|--------------|------|
| G-101 | 使用者系統規格空白 | social, 全部 | modules/social-platform.md | open |
| G-102 | 金流合規與金流商選型未定 | payment | modules/payment-service.md | open |
| G-103 | 加密貨幣法規與 KYC 流程未定 | crypto | modules/crypto-trading.md | open |
| G-104 | 無驗收標準（Acceptance Criteria） | 全部 | 各 module §驗收 | open |
| G-105 | 模組間依賴關係未畫 | 全部 | docs/02-architecture.md | open |

### 🟢 次要（Minor）— 可後補

| ID | 缺口 | 影響模組 | 建議補齊位置 | 狀態 |
|----|------|----------|--------------|------|
| G-201 | 無 CONTRIBUTING.md | repo | 根目錄 | open |
| G-202 | 無 LICENSE | repo | 根目錄 | open |
| G-203 | 無部署 / CI 說明 | 全部 | docs/04-deployment.md | open |
| G-204 | README 過於簡略 | repo | README.md | open |

---

## 審查 Checklist（Agent 每次必跑）

對每一份 `modules/*.md` 檢查：

- [ ] 有 frontmatter（status, priority, owner, updated）
- [ ] 有「問題陳述 / 目標用戶」
- [ ] 至少 3 條 User Story（As a / I want / So that）
- [ ] 功能需求表（含優先級 P0-P3）
- [ ] 非功能需求（效能、安全、可用性）
- [ ] 明確 **不做** 清單（Out of scope）
- [ ] 依賴其他模組已標註
- [ ] 驗收標準可測試
- [ ] 開放問題（Open Questions）有 owner
- [ ] 與 [01-requirements-master.md](./01-requirements-master.md) ID 交叉引用

---

## 本輪審查建議（自動生成）

### 你現在應該做的 3 件事

1. **專心填 `modules/ai-tools-directory.md`**  
   這是 P0；寫完 5 條 user story + 10 個功能項再碰其他模組。

2. **回答 Open Questions**（見各 module 底部）  
   例如：工具資料誰維護？純人工 curated 還是允許 user submit？

3. **執行架構決策**  
   新建 `docs/02-architecture.md`，至少決定：Next.js + PostgreSQL + Vercel。

### 不要現在做的事

- 不要寫 crypto 交易 code（合規缺口 G-103）
- 不要接金流 API（G-102）
- 不要同時開四個前端專案

---

## 變更紀錄

| 日期 | 動作 | 摘要 |
|------|------|------|
| 2026-07-18 | 初版審查 | 建立框架；綜合完成度 ~19% |
