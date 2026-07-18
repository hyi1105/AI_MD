---
status: draft
priority: P2
owner: hyi1105
updated: 2026-07-18
module: payment-service
---

# 模組：金流服務

## 1. 問題陳述

_待填：金流服務在整體生態的角色 — 訂閱 AI 工具？社群打賞？crypto 入金？_

## 2. 目標用戶

| persona | 描述 |
|---------|------|
| 付費使用者 | 購買 premium 功能 |
| 商家 / 創作者 | 收款 |
| 平台營運 | 對帳、報表 |

## 3. User Stories

| ID | Story | 優先級 | 狀態 |
|----|-------|--------|------|
| PAY-01 | As a 使用者, I want 信用卡付款, So that 購買服務 | P0 | `missing` |
| PAY-02 | As a 使用者, I want 查看訂單紀錄, So that 對帳 | P0 | `missing` |
| PAY-03 | As a 管理者, I want 退款, So that 處理客訴 | P1 | `missing` |

## 4. 功能需求

| ID | 功能 | 優先級 | 狀態 |
|----|------|--------|------|
| F-01 | 建立訂單 | P0 | `missing` |
| F-02 | 金流商 webhook 回调 | P0 | `missing` |
| F-03 | 訂單狀態機 | P0 | `missing` |
| F-04 | 發票（台灣電子發票） | P2 | `missing` |
| F-05 | 訂閱制 / 单次 | P1 | `missing` |

## 5. 金流商選型（待決）

| 商 | 用途 | 狀態 |
|----|------|------|
| Stripe | 國際卡 | `undecided` |
| 綠界 ECPay | 台灣本地 | `undecided` |
| 藍新 NewebPay | 台灣本地 | `undecided` |

> ⚠️ **缺口 G-102**：需商業登記、開立發票規劃

## 6. 合規

- PCI DSS（若自存卡號 — **建議不做，用金流商 hosted**）
- 個資法
- 反洗錢（若涉及 crypto 入金）

## 7. 依賴

- P-01 ~ P-04 → [01-requirements-master.md](../docs/01-requirements-master.md)
- 使用者 U-01

## 8. Open Questions

| # | 問題 | 決策 |
|---|------|------|
| Q1 | 第一個付費場景是什麼？ | _未定_ |
| Q2 | 平台抽成比例？ | _未定_ |
