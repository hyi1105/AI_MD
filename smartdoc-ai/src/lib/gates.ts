import type { GateResult } from './types'

const MIN_CHARS = 2
const RATE_LIMIT_MS = 5000

let lastSendAt = 0

export function validateInput(text: string): GateResult {
  const trimmed = text.trim()
  if (trimmed.length < MIN_CHARS) {
    return { ok: false, reason: '請輸入有效內容（至少 2 個字），避免觸發無效請求。' }
  }
  return { ok: true }
}

export function checkRateLimit(now = Date.now()): GateResult {
  if (now - lastSendAt < RATE_LIMIT_MS) {
    const wait = Math.ceil((RATE_LIMIT_MS - (now - lastSendAt)) / 1000)
    return { ok: false, reason: `請勿頻繁發送，請再等待 ${wait} 秒。` }
  }
  return { ok: true }
}

export function markSend(now = Date.now()) {
  lastSendAt = now
}

export function remainingCooldown(now = Date.now()): number {
  return Math.max(0, RATE_LIMIT_MS - (now - lastSendAt))
}

export { MIN_CHARS, RATE_LIMIT_MS }
