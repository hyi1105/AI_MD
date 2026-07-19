import type { ContributionState, DownloadAttempt, GateResult } from './types'
import { isPlatformSigned } from './seed'

const STORAGE_KEY = 'smartdoc-contribution-v1'
const REVENUE_SHARE = 0.1

export function loadContribution(): ContributionState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as ContributionState
  } catch {
    // fallthrough
  }
  return {
    points: 0,
    uploadedBytes: 0,
    onlineMinutes: 0,
    seeding: false,
    monthRevenueNtd: 100_000, // demo assumed platform revenue
    rejectedAttempts: 0,
  }
}

export function saveContribution(state: ContributionState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function poolAmount(revenueNtd: number): number {
  return revenueNtd * REVENUE_SHARE
}

/** V_point = A / P_total — demo uses local points as stand-in for network total. */
export function pointValueNtd(state: ContributionState, networkTotalPoints?: number): number {
  const a = poolAmount(state.monthRevenueNtd)
  const p = Math.max(1, networkTotalPoints ?? Math.max(state.points, 1))
  return a / p
}

export function estimatedPayoutNtd(state: ContributionState, networkTotalPoints?: number): number {
  return state.points * pointValueNtd(state, networkTotalPoints)
}

export function validateSeedDownload(attempt: DownloadAttempt): GateResult {
  const text = attempt.content.trim()
  if (text.length < 2) {
    return { ok: false, reason: '輸入驗證失敗：內容過短，不計入貢獻點數。' }
  }
  if (!/[\u4e00-\u9fffA-Za-z]/.test(text)) {
    return { ok: false, reason: '輸入驗證失敗：無效字元，不計入貢獻點數。' }
  }
  if (attempt.sameLanOrIp) {
    return { ok: false, reason: '防刷量：同一 LAN／IP 互傳下載不予發放點數。' }
  }
  if (!isPlatformSigned(attempt.signature)) {
    return { ok: false, reason: '合法文件驗證失敗：未通過平台簽章，流量無效。' }
  }
  if (attempt.bytes < 32) {
    return { ok: false, reason: '有效流量過低，略過點數發放。' }
  }
  return { ok: true }
}

/** ~1 point per 1KB effective upload, plus optional online bonus. */
export function awardUploadPoints(state: ContributionState, bytes: number): ContributionState {
  const gained = Math.max(1, Math.round(bytes / 1024))
  return {
    ...state,
    points: state.points + gained,
    uploadedBytes: state.uploadedBytes + bytes,
  }
}

export function tickOnlineContribution(state: ContributionState, minutes = 1): ContributionState {
  if (!state.seeding) return state
  return {
    ...state,
    onlineMinutes: state.onlineMinutes + minutes,
    points: state.points + minutes, // 1 point / online minute while seeding
  }
}

export const TOKENOMICS_COPY = {
  share: '平台總營收 × 10% → 貢獻者獎金池',
  formula: 'V_point = A / P_total',
} as const
