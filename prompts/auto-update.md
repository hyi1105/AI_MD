# 提示詞：自動更新規格

> 使用方式：  
> `@prompts/auto-update.md 我決定 AI 工具資料用 Git MD 管理，首批 50 個工具`  
> `@prompts/auto-update.md 更新 social 模組：要支持圖文貼文`

---

## 任務

根据用户 **新決策 / 新需求 / 新描述**，自动更新相关 MD 文件，并同步缺口分析。

## 執行步驟

### Step 1 — 解析用户输入

提取：

- **决策**：例如技术选型、MVP 范围
- **目标 module**：ai-tools / social / payment / crypto / 全局
- **变更类型**：新增 / 修改 / 删除 / 决策关闭

### Step 2 — 找出受影响文件

| 变更类型 | 需更新 |
|----------|--------|
| 模块功能 | `modules/<name>.md` |
| 跨模块需求 | `docs/01-requirements-master.md` |
| 优先级 / 愿景 | `docs/00-vision.md` |
| 技术架构 | `docs/02-architecture.md`（若无则创建） |
| 任何变更 | `docs/02-gap-analysis.md` |

### Step 3 — 更新规则

1. **frontmatter `updated`** 改为今天日期
2. 相关需求 **status**：`missing` → `partial` 或 `draft`
3. Open Questions：若用户已回答 → 填入「決策」欄，并考虑删除或标 closed
4. 在 module 底部加 **變更紀錄**（若无则新建 §變更紀錄）

### Step 4 — 更新 gap-analysis

- 已解决的缺口 → `status: closed` + 原因
- 新产生的缺口 → 新增 ID
- 重算 **整體完成度**

### Step 5 — 檢查一致性

更新后自动跑一轮 mini review：

- 新内容与 vision 优先级是否冲突？
- 新功能是否缺 Acceptance Criteria？→ 补 placeholder 或标 G-104
- 是否引入新依赖未记录？

### Step 6 — 回覆用户

```markdown
## 已更新
| 文件 | 变更摘要 |
|------|----------|

## 新关闭的缺口
- G-xxx：...

## 新产生的缺口
- G-xxx：...

## 仍待你決策
- Qx：...
```

## 範例映射

| 用户说 | 应更新 |
|--------|--------|
| 「MVP 只做 AI 工具站」 | vision, gap G-001 closed |
| 「用 Next.js + Postgres」 | 新建/更新 architecture, master §技术决策 |
| 「工具用 YAML frontmatter」 | templates, ai-tools §資料模型, G-003 closed |
| 「暂不做 crypto」 | crypto module status, vision 优先级 |

## 不要

- 用户没说的功能不要擅自加
- 不要把 `draft` 改成 `ready` 除非用户明确说「规格完成了」
- 不要改 `.git` 或删文件
