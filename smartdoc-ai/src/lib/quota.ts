import type { PlanTier, QuotaState } from './types'

const STORAGE_KEY = 'smartdoc-quota-v1'
const FREE_MONTHLY = 15
const DEEP_LIMIT = 50

function monthKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function defaultQuota(): QuotaState {
  return {
    plan: 'free',
    monthlyAiUsed: 0,
    monthlyAiLimit: FREE_MONTHLY,
    paygCredits: 0,
    deepUsed: 0,
    deepLimit: DEEP_LIMIT,
    monthKey: monthKey(),
  }
}

export function loadQuota(): QuotaState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultQuota()
    const parsed = JSON.parse(raw) as QuotaState
    if (parsed.monthKey !== monthKey()) {
      return {
        ...parsed,
        monthlyAiUsed: 0,
        deepUsed: 0,
        monthKey: monthKey(),
        monthlyAiLimit: parsed.plan === 'pro' ? Number.POSITIVE_INFINITY : FREE_MONTHLY,
      }
    }
    return parsed
  } catch {
    return defaultQuota()
  }
}

export function saveQuota(q: QuotaState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(q))
}

export function remainingChats(q: QuotaState): number | '∞' {
  if (q.plan === 'pro') return '∞'
  return Math.max(0, q.monthlyAiLimit - q.monthlyAiUsed) + q.paygCredits
}

export function canUseAi(q: QuotaState): boolean {
  if (q.plan === 'pro') return true
  return q.monthlyAiUsed < q.monthlyAiLimit || q.paygCredits > 0
}

export function consumeAiCredit(q: QuotaState): QuotaState {
  if (q.plan === 'pro') return q
  if (q.monthlyAiUsed < q.monthlyAiLimit) {
    return { ...q, monthlyAiUsed: q.monthlyAiUsed + 1 }
  }
  if (q.paygCredits > 0) {
    return { ...q, paygCredits: q.paygCredits - 1 }
  }
  return q
}

export function buyPaygPack(q: QuotaState): QuotaState {
  return { ...q, plan: q.plan === 'pro' ? 'pro' : 'payg', paygCredits: q.paygCredits + 50 }
}

export function upgradePro(q: QuotaState): QuotaState {
  return {
    ...q,
    plan: 'pro',
    monthlyAiLimit: Number.POSITIVE_INFINITY,
  }
}

export function setPlan(q: QuotaState, plan: PlanTier): QuotaState {
  if (plan === 'pro') return upgradePro(q)
  if (plan === 'free') {
    return { ...q, plan: 'free', monthlyAiLimit: FREE_MONTHLY }
  }
  return { ...q, plan: 'payg', monthlyAiLimit: FREE_MONTHLY }
}

export function consumeDeep(q: QuotaState): { ok: boolean; next: QuotaState; reason?: string } {
  if (q.plan !== 'pro') {
    return { ok: true, next: q }
  }
  if (q.deepUsed >= q.deepLimit) {
    return {
      ok: false,
      next: q,
      reason: `本月深度分析已達上限（${q.deepLimit} 次）。`,
    }
  }
  return { ok: true, next: { ...q, deepUsed: q.deepUsed + 1 } }
}

export const PRICING = {
  payg: { label: 'NT$30 / 50 次對話', credits: 50, priceNtd: 30 },
  pro: { label: 'Pro NT$290–490／月', priceNtd: 290 },
  premium: { label: 'Premium NT$600／月', priceNtd: 600 },
} as const
