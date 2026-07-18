import type { PeerDocRecord } from './types'

const DOC_KEY = 'smartdoc-local-doc-v2'
const INDEX_KEY = 'smartdoc-seed-index-v2'

export function loadLocalMarkdown(fallback: string): string {
  try {
    return localStorage.getItem(DOC_KEY) ?? fallback
  } catch {
    return fallback
  }
}

export function saveLocalMarkdown(markdown: string) {
  try {
    localStorage.setItem(DOC_KEY, markdown)
  } catch {
    // quota / private mode — ignore
  }
}

export function loadSeedIndex(): Record<string, PeerDocRecord> {
  try {
    const raw = localStorage.getItem(INDEX_KEY)
    return raw ? (JSON.parse(raw) as Record<string, PeerDocRecord>) : {}
  } catch {
    return {}
  }
}

export function saveSeedIndex(index: Record<string, PeerDocRecord>) {
  try {
    localStorage.setItem(INDEX_KEY, JSON.stringify(index))
  } catch {
    // ignore
  }
}

export function upsertSeedRecord(
  index: Record<string, PeerDocRecord>,
  record: PeerDocRecord,
): Record<string, PeerDocRecord> {
  return { ...index, [record.seed]: record }
}
