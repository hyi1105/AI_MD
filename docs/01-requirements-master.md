# 01 — 總需求規格

> 狀態：`draft` | 最後更新：2026-07-18

本文件定義 **跨模組共用** 的需求。各模組專屬需求見 `modules/`。

---

## 1. 使用者與身分（跨模組）

| ID | 需求 | 優先級 | 狀態 | 備註 |
|----|------|--------|------|------|
| U-01 | 使用者註冊（Email / OAuth） | P1 | `missing` | 未定 OAuth 提供者 |
| U-02 | 登入 / 登出 / Session | P1 | `missing` | 未定 JWT vs Session |
| U-03 | 個人資料與頭像 | P2 | `missing` | |
| U-04 | 角色與權限（RBAC） | P2 | `missing` | admin / user / merchant? |
| U-05 | 多語系（zh-TW 優先） | P2 | `missing` | |

## 2. 內容與 Markdown

| ID | 需求 | 優先級 | 狀態 | 備註 |
|----|------|--------|------|------|
| C-01 | Markdown 撰寫與預覽 | P0 | `partial` | 本 repo 已用 MD，未定义渲染規則 |
| C-02 |  frontmatter 元資料標準 | P0 | `missing` | 見 [templates/module-spec.md](../templates/module-spec.md) |
| C-03 | 版本修訂紀錄 | P1 | `missing` | |
| C-04 | 全文搜尋 | P1 | `missing` | AI 工具網必需 |

## 3. 金流（跨模組，詳見 payment-service）

| ID | 需求 | 優先級 | 狀態 | 備註 |
|----|------|--------|------|------|
| P-01 | 支援台灣本地支付（綠界 / 藍新） | P2 | `missing` | 需商業登記 |
| P-02 | 國際卡（Stripe） | P2 | `missing` | |
| P-03 | 訂單狀態機 | P2 | `missing` | |
| P-04 | 退款與爭議 | P3 | `missing` | |

## 4. 安全與合規

| ID | 需求 | 優先級 | 狀態 | 備註 |
|----|------|--------|------|------|
| S-01 | HTTPS 強制 | P0 | `missing` | 部署階段 |
| S-02 | 個資法 / GDPR 告知 | P1 | `missing` | |
| S-03 | 加密貨幣 KYC / AML | P3 | `missing` | 僅 crypto 模組 |
| S-04 | API Rate Limit | P2 | `missing` | |

## 5. 營運與可觀測性

| ID | 需求 | 優先級 | 狀態 | 備註 |
|----|------|--------|------|------|
| O-01 | 錯誤監控（Sentry 等） | P2 | `missing` | |
| O-02 | 分析（GA / Plausible） | P2 | `missing` | |
| O-03 | 管理後台 | P2 | `missing` | |
| O-04 | 備份與還原策略 | P3 | `missing` | |

## 6. 技術決策（待 architecture 文件）

| 決策 | 選項 | 狀態 |
|------|------|------|
| 前端框架 | Next.js / Nuxt / 純 MD | `undecided` |
| 資料庫 | PostgreSQL / SQLite | `undecided` |
| 部署 | Vercel / VPS / AWS | `undecided` |
| Monorepo vs 多 repo | 單 repo MD + 多 code repo | `undecided` |

---

## 模組對照

| 總需求 ID | 相關模組 |
|-----------|----------|
| C-01, C-02, C-04 | ai-tools-directory |
| U-01 ~ U-05 | social-platform, 全部 |
| P-01 ~ P-04 | payment-service, crypto-trading |
| S-03 | crypto-trading |

## 變更紀錄

| 日期 | 變更 | 作者 |
|------|------|------|
| 2026-07-18 | 初版骨架 | Agent |
