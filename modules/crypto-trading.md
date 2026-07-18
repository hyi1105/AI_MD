---
status: draft
priority: P3
owner: hyi1105
updated: 2026-07-18
module: crypto-trading
---

# 模組：加密貨幣交易網

> ⚠️ **高合規風險模組 — 規格完成度最低時不可開發**

## 1. 問題陳述

_待填：是中心化交易所、DEX 聚合、還是僅行情展示？_

## 2. 目標用戶

| persona | 描述 |
|---------|------|
| 交易者 | 买卖 crypto |
| 投资者 | 查看行情 |

## 3. User Stories

| ID | Story | 優先級 | 狀態 |
|----|-------|--------|------|
| CT-01 | As a 使用者, I want 查看即時行情, So that 決策 | P0 | `missing` |
| CT-02 | As a 使用者, I want 下單买卖, So that 交易 | P0 | `missing` |
| CT-03 | As a 使用者, I want 管理錢包, So that 存提 | P0 | `missing` |

## 4. 功能需求

| ID | 功能 | 優先級 | 狀態 |
|----|------|--------|------|
| F-01 | 行情（WebSocket） | P0 | `missing` |
| F-02 | 订单簿 / 撮合 | P0 | `missing` |
| F-03 | 钱包（热/冷） | P0 | `missing` |
| F-04 | KYC 身份验证 | P0 | `missing` |
| F-05 | 2FA | P0 | `missing` |

## 5. 合規（台湾 / 国际）

| 項目 | 狀態 | 備註 |
|------|------|------|
| 台湾金管会 VASP 法规 | `missing` | 需 legal review |
| KYC / AML | `missing` | 见 S-03 |
| Travel Rule | `missing` | |

> ⚠️ **缺口 G-103**

## 6. 不做（除非 legal OK）

- 不提供无 KYC 交易
- 不自建撮合引擎（MVP 可接 Binance API 只读行情）

## 7. 依賴

- payment-service（法币入金）
- S-03 → [01-requirements-master.md](../docs/01-requirements-master.md)

## 8. Open Questions

| # | 問題 | 決策 |
|---|------|------|
| Q1 | 只做行情还是 full 交易？ | _未定_ |
| Q2 | 服务台湾用户还是全球？ | _未定_ |
