---
status: draft
priority: P0
owner: hyi1105
updated: 2026-07-18
module: ai-tools-directory
---

# 模組：AI 工具查詢網

> **優先級 P0 — 建議第一個實作的產品**

## 1. 問題陳述

使用者難以在大量 AI 工具中快速找到適合自己情境的工具；現有列表站点多為英文、分类混乱、缺中文说明。

## 2. 目標用戶

|  persona | 描述 | 核心需求 |
|----------|------|----------|
| 一般使用者 | 想试用 ChatGPT 替代品、图像工具 | 快速比较、中文说明 |
| 开发者 | 需要 API、SDK 信息 | 技术规格、定价 |
| 内容创作者 | 写作、视频、设计 | 按场景分类 |

## 3. User Stories

| ID | Story | 優先級 | 狀態 |
|----|-------|--------|------|
| AT-01 | As a 使用者, I want 依分類瀏覽工具, So that 快速縮小範圍 | P0 | `missing` |
| AT-02 | As a 使用者, I want 關鍵字搜尋, So that 找到特定功能工具 | P0 | `missing` |
| AT-03 | As a 使用者, I want 每工具一頁 Markdown 說明, So that 了解優缺點與定價 | P0 | `missing` |
| AT-04 | As a 使用者, I want 收藏工具, So that 下次快速访问 | P1 | `missing` |
| AT-05 | As a 管理者, I want 新增/編輯工具条目, So that 保持目錄更新 | P1 | `missing` |

> ⚠️ **缺口**：目前 0 條 story 有驗收標準。請補 §7。

## 4. 功能需求

| ID | 功能 | 優先級 | 狀態 | 備註 |
|----|------|--------|------|------|
| F-01 | 工具列表頁（卡片 UI） | P0 | `missing` | |
| F-02 | 分類篩選（寫作/圖像/程式/語音…） | P0 | `missing` | 分類 taxonomy 未定 |
| F-03 | 全文搜尋 | P0 | `missing` | 對應 C-04 |
| F-04 | 工具詳情頁（MD 渲染） | P0 | `missing` | |
| F-05 | 標籤（tags） | P1 | `missing` | |
| F-06 | 外部連結（官網、定價） | P0 | `missing` | |
| F-07 | 免费/付费/ freemium 標記 | P1 | `missing` | |
| F-08 | 使用者提交新工具 | P2 | `missing` | 需審核流程 |
| F-09 | 評分 / 評論 | P2 | `missing` | 需 U-01 使用者系統 |
| F-10 | SEO（每工具独立 URL） | P1 | `missing` | |

## 5. 非功能需求

| 項目 | 目標 | 狀態 |
|------|------|------|
| 首頁載入 | < 2s (LCP) | `missing` |
| 可用性 | 99% (MVP) | `missing` |
| 語系 | zh-TW 優先，en 可選 | `partial` |
| 資料更新 | 工具 MD 可 Git 管理 | `partial`（本 repo） |

## 6. 資料模型（草案）

```yaml
Tool:
  id: string          # slug
  name: string
  category: string[]
  tags: string[]
  pricing: free | freemium | paid
  url: string
  description: string  # 短描述
  content: markdown    # 詳細說明檔
  updated_at: date
```

> ⚠️ **缺口 G-003**：需與 [templates/module-spec.md](../templates/module-spec.md) frontmatter 對齊。

## 7. 驗收標準（Acceptance Criteria）

| Story ID | 驗收條件 | 狀態 |
|----------|----------|------|
| AT-01 | _待填_ | `missing` |
| AT-02 | _待填_ | `missing` |
| AT-03 | _待填_ | `missing` |

## 8. 不做（Out of Scope）— MVP

- 不做工具本身 hosting
- 不做 affiliate 分潤（v2 再议）
- 不做 AI 自动爬蟲（v1 人工 curated）

## 9. 依賴

| 依賴 | 模組 / 文件 | 狀態 |
|------|-------------|------|
| Markdown 標準 | templates/module-spec.md | partial |
| 使用者（收藏） | social-platform U-01 | missing |
| 搜尋引擎 | 02-architecture.md | missing |

## 10. Open Questions

| # | 問題 | Owner | 決策 |
|---|------|-------|------|
| Q1 | 工具資料放 repo MD 還是 DB？ | hyi1105 | _未定_ |
| Q2 | 首批收录多少工具？ | hyi1105 | _未定_ |
| Q3 | 是否需要英文版？ | hyi1105 | _未定_ |

## 11. 相關總需求

- C-01, C-02, C-04 → [01-requirements-master.md](../docs/01-requirements-master.md)
