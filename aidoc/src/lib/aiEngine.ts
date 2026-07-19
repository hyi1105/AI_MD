import { createProposal } from './diffEngine'
import type { ModelTier, Proposal } from './types'

const DEEP_KEYWORDS = [
  '漏洞',
  '風險',
  '完整審查',
  '法律審查',
  '架構',
  '重構',
  '全面',
  '深度',
  '合規',
]

export function routeModel(prompt: string): ModelTier {
  return DEEP_KEYWORDS.some((k) => prompt.includes(k)) ? 'deep' : 'economy'
}

export function extractMentions(prompt: string): string[] {
  const matches = prompt.match(/@([^\s@，。,.]+)/g)
  if (!matches) return []
  return matches.map((m) => m.slice(1))
}

function raisePenalty(md: string, target = '千分之一'): string {
  return md
    .replace(/千分之零點五/g, target)
    .replace(/千分之\d+/g, target)
    .replace(/百分之[\d零一二三四五六七八九十點]+/g, target)
}

function plainLanguageFees(md: string): string {
  return md.replace(
    /## 第三條 服務費用[\s\S]*?(?=\n## )/,
    `## 第三條 服務費用

用白話說明收費方式：

1. **免費試用**：每個月可以跟 AI 對話 15 次，渲染與紅綠色修訂追蹤都可完整使用。
2. **臨時加購**：額度用完又急著改文件時，可以花 NT$30 再買 50 次對話。
3. **商業訂閱**：每月 NT$290～490（高階 NT$600），可無限對話，並一鍵匯出 Markdown（.md）。

`,
  )
}

function addBackupClause(md: string): string {
  if (md.includes('資料備份')) return md
  return md.replace(
    /(## 第二條 服務範圍[\s\S]*?)(\n## )/,
    `$1
4. 提供定期資料備份與災難復原機制，確保文件版本可追溯。
$2`,
  )
}

function legalReview(md: string): string {
  let next = md
  if (!next.includes('不可抗力')) {
    next = next.replace(
      /(## 第八條 準據法|## 第七條 準據法)/,
      `## 不可抗力條款

因天災、戰爭、政府行為或非可歸責於雙方之事由致無法履約，該方不負違約責任，但應盡速通知他方並協力減損。

$1`,
    )
  }
  next = next.replace(
    /應於書面通知後十四日內改善/,
    '應於書面通知後七日內改善；逾期未改善，他方得終止本約並請求損害賠償',
  )
  if (!next.includes('智慧財產權')) {
    next = next.replace(
      /(## 第五條 保密義務[\s\S]*?)(\n## )/,
      `$1

雙方因本約產出之文件範本、提示詞與衍生智慧財產權歸屬，應另以書面確認；未約定者推定為共同持有。
$2`,
    )
  }
  return next
}

function polishTone(md: string): string {
  return md
    .replace(/應依本約約定提供穩定、安全之服務。/, '應依本約提供穩定、安全且可稽核之服務。')
    .replace(/不得對外揭露。/, '不得對外揭露，並應採取合理之資訊安全措施。')
}

function applyMentionFocus(md: string, mentions: string[], prompt: string): string | null {
  if (!mentions.length) return null
  const mention = mentions[0]
  const headingRe = new RegExp(`(##[^\\n]*${mention}[^\\n]*\\n)([\\s\\S]*?)(?=\\n## |$)`)
  if (!headingRe.test(md)) return null

  if (prompt.includes('白話') || prompt.includes('簡化')) {
    return md.replace(headingRe, `$1\n（依您提及的「${mention}」已改寫為較易讀版本）\n\n$2`)
  }
  return md.replace(
    headingRe,
    `$1\n> AI 註記：已依您提及的 @${mention} 加強本段表述清晰度與可執行性。\n\n$2`,
  )
}

export interface AiEditResult {
  proposal: Proposal
  reply: string
  model: ModelTier
  mentions: string[]
}

export async function generateEdit(markdown: string, prompt: string): Promise<AiEditResult> {
  const model = routeModel(prompt)
  const mentions = extractMentions(prompt)

  await new Promise((r) => setTimeout(r, model === 'deep' ? 900 : 450))

  let next = markdown
  let summary = '已依您的指示產生修改建議'

  const focused = applyMentionFocus(next, mentions, prompt)
  if (focused) {
    next = focused
    summary = `已針對提及章節（${mentions.join('、')}）調整`
  }

  if (/違約金|千分之/.test(prompt)) {
    const m = prompt.match(/千分之[\d零一二三四五六七八九十點]+/)
    next = raisePenalty(next, m?.[0] ?? '千分之一')
    summary = `已將違約金調整為${m?.[0] ?? '千分之一'}`
  } else if (/白話|好懂|簡化/.test(prompt) && /費用|第三條|收費/.test(prompt)) {
    next = plainLanguageFees(next)
    summary = '已將費用條款改寫為白話'
  } else if (/備份|第二條|新增/.test(prompt)) {
    next = addBackupClause(next)
    summary = '已於服務範圍新增資料備份條款'
  } else if (model === 'deep' || /漏洞|審查|風險|合規/.test(prompt)) {
    next = legalReview(next)
    summary = '已完成深度條款補強（不可抗力、改善期限、智財）'
  } else {
    next = polishTone(next)
    summary = '已潤飾合約用語並微調關鍵句'
  }

  if (next === markdown) {
    next = `${markdown.trimEnd()}\n\n---\n\n> **AI 修訂註記**：${prompt.trim()}\n`
    summary = '已附加修訂註記（未找到可自動套用的規則時）'
  }

  const proposal = createProposal(markdown, next, summary, model)
  const modelLabel =
    model === 'deep' ? 'Claude 3.5 Sonnet（深度）' : 'Gemini Flash / GPT-4o-mini（平價）'

  const reply = [
    `已用 **${modelLabel}** 讀取底層 Markdown 並產出建議。`,
    `${summary}。`,
    proposal.hunks.length
      ? `共 ${proposal.hunks.length} 處差異，請在主畫面以紅／綠標記檢視，並逐段 Accept 或 Reject。`
      : '內容與原文相同，沒有可套用的差異。',
    mentions.length ? `已納入提及章節：${mentions.map((m) => `@${m}`).join('、')}` : '',
  ]
    .filter(Boolean)
    .join('\n\n')

  return { proposal, reply, model, mentions }
}
