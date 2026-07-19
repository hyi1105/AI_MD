/**
 * Paragraph-level CRDT-style merge for MVP demos.
 * Production target: Yjs or Automerge (see docs/PRD.md).
 *
 * Strategy: split by blank-line blocks; union unique blocks preserving
 * base order, then append peer-only blocks. Concurrent edits to the
 * "same" block (fuzzy match) prefer the longer / newer revision.
 */

function blocks(md: string): string[] {
  return md
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean)
}

function fingerprint(block: string): string {
  const heading = block.match(/^#{1,3}\s+(.+)$/m)?.[1]?.trim()
  if (heading) return `h:${heading}`
  return `t:${block.slice(0, 48).replace(/\s+/g, ' ')}`
}

export interface MergeResult {
  merged: string
  addedFromPeer: string[]
  conflictResolved: number
}

export function mergeOfflineBranches(base: string, peer: string): MergeResult {
  const baseBlocks = blocks(base)
  const peerBlocks = blocks(peer)
  const peerMap = new Map(peerBlocks.map((b) => [fingerprint(b), b]))

  const mergedList: string[] = []
  const seen = new Set<string>()
  let conflictResolved = 0
  const addedFromPeer: string[] = []

  for (const b of baseBlocks) {
    const key = fingerprint(b)
    const peerVersion = peerMap.get(key)
    if (peerVersion && peerVersion !== b) {
      const pick = peerVersion.length >= b.length ? peerVersion : b
      mergedList.push(pick)
      conflictResolved += 1
    } else {
      mergedList.push(b)
    }
    seen.add(key)
  }

  for (const b of peerBlocks) {
    const key = fingerprint(b)
    if (seen.has(key)) continue
    mergedList.push(b)
    addedFromPeer.push(b)
    seen.add(key)
  }

  return {
    merged: mergedList.join('\n\n') + '\n',
    addedFromPeer,
    conflictResolved,
  }
}

/** Simulate a remote peer editing a different section while offline. */
export function simulatePeerOfflineEdit(markdown: string): string {
  if (markdown.includes('## 第五條 保密義務') && !markdown.includes('離線協作補充')) {
    return markdown.replace(
      /(## 第五條 保密義務[\s\S]*?)(\n## )/,
      `$1

> **離線協作補充（Peer）**：雙方應在可行範圍內以區域網路或藍牙同步最新 Seed，確保斷網期間版本可追查。
$2`,
    )
  }
  if (!markdown.includes('## 附錄 離線協作備忘')) {
    return `${markdown.trimEnd()}\n\n## 附錄 離線協作備忘\n\n本段由離線 Peer 節點新增，待 CRDT 合併後顯示於主文件。\n`
  }
  return `${markdown.trimEnd()}\n\n> Peer ping @ ${new Date().toISOString()}\n`
}
