# 提示詞：缺口審查（像 Code Review 一樣）

> 使用方式：在 Cursor 輸入  
> `@prompts/review-gap.md 審查整體缺口`  
> 或 `@prompts/review-gap.md 審查 modules/ai-tools-directory.md`

---

## 任務

對 AI_MD 專案做 **規格 Code Review**。找出不足、矛盾、遺漏，並 **直接更新文件**。

## 執行步驟

### Step 1 — 讀取

依序讀：

1. [docs/00-vision.md](../docs/00-vision.md)
2. [docs/01-requirements-master.md](../docs/01-requirements-master.md)
3. [docs/02-gap-analysis.md](../docs/02-gap-analysis.md)
4. 所有 [modules/*.md](../modules/)（或用户指定的單一 module）
5. [prompts/AGENT-MASTER.md](./AGENT-MASTER.md)

### Step 2 — 跑 Checklist

對每份 module MD 檢查（見 gap-analysis §審查 Checklist）：

- frontmatter 完整？
- User Story ≥ 3 且格式正确？
- 每條 P0 story 有 Acceptance Criteria？
- 功能需求表有 priority + status？
- Out of scope 有写？
- 與 01-requirements-master 的 ID 有交叉引用？
- Open Questions 有 owner？

### Step 3 — 交叉比對

| 檢查 | 動作 |
|------|------|
| vision 说 P0 是 ai-tools，但 module 最空 | 标 🔴 blocking |
| master 有 U-01，social module 没对应 | 新增缺口 |
| 两文件 priority 矛盾 | 列出矛盾，建议以 vision 为准 |
| 某功能需要 payment 但 payment 未 ready | 标依賴風險 |

### Step 4 — 更新 [02-gap-analysis.md](../docs/02-gap-analysis.md)

必須更新：

1. **整體完成度** 百分比（誠實估算）
2. **缺口清單** — 新增/关闭项目（关閉要寫原因）
3. **本輪審查建議** — 3 条「现在该做什么」+「不要做什么」
4. **變更紀錄** — 一行摘要

缺口 ID 规则：`G-0xx` blocking, `G-1xx` major, `G-2xx` minor

### Step 5 — 回覆用户

用以下格式回复（繁體中文）：

```markdown
## 審查摘要
- 綜合完成度：X%
- 🔴 Blocking：N 項
- 🟡 Major：N 項

## 最缺的三件事
1. ...
2. ...
3. ...

## 我已更新的文件
- docs/02-gap-analysis.md
- （其他有改的文件）

## 建议你下一步
...
```

## 審查標準（嚴格）

- 没有 Acceptance Criteria 的 P0 story = **Major 缺口**
- 没有 architecture 决策 = **Blocking**（若用户问能否写 code）
- crypto / payment 缺合规 = **Blocking** for those modules only
- README 少于 20 行有效内容 = **Minor**

## 不要

- 只列问题不改文件
- 把完成度高估（有 `missing` 的 section 不能算 100%）
- 建议同时开发四个产品
