import { diffLines, type Change } from 'diff'
import { v4 as uuid } from 'uuid'
import type { DiffHunk, Proposal } from './types'

function lineCount(value: string): number {
  if (!value) return 0
  return value.endsWith('\n') ? value.split('\n').length - 1 : value.split('\n').length
}

function toLines(value: string): string[] {
  if (!value) return []
  const trimmed = value.endsWith('\n') ? value.slice(0, -1) : value
  return trimmed.length ? trimmed.split('\n') : []
}

export function buildHunks(base: string, proposed: string): DiffHunk[] {
  const parts = diffLines(base, proposed)
  const hunks: DiffHunk[] = []
  let oldLine = 1
  let newLine = 1
  let i = 0

  while (i < parts.length) {
    const part = parts[i]
    if (!part.added && !part.removed) {
      const n = lineCount(part.value)
      oldLine += n
      newLine += n
      i += 1
      continue
    }

    const removed: string[] = []
    const added: string[] = []
    const startOld = oldLine
    const startNew = newLine

    while (i < parts.length && (parts[i].removed || parts[i].added)) {
      const p = parts[i]
      if (p.removed) {
        removed.push(...toLines(p.value))
        oldLine += lineCount(p.value)
      }
      if (p.added) {
        added.push(...toLines(p.value))
        newLine += lineCount(p.value)
      }
      i += 1
    }

    if (removed.length || added.length) {
      hunks.push({
        id: uuid(),
        oldStart: startOld,
        newStart: startNew,
        removed,
        added,
      })
    }
  }

  return hunks
}

export function createProposal(
  baseMarkdown: string,
  proposedMarkdown: string,
  summary: string,
  model: Proposal['model'],
): Proposal {
  return {
    id: uuid(),
    baseMarkdown,
    proposedMarkdown,
    hunks: buildHunks(baseMarkdown, proposedMarkdown),
    summary,
    model,
  }
}

export function acceptAll(proposal: Proposal): string {
  return proposal.proposedMarkdown
}

export function rejectAll(proposal: Proposal): string {
  return proposal.baseMarkdown
}

export function acceptHunk(proposal: Proposal, hunkId: string): Proposal {
  return {
    ...proposal,
    hunks: proposal.hunks.map((h) =>
      h.id === hunkId ? { ...h, accepted: true, rejected: false } : h,
    ),
  }
}

export function rejectHunk(proposal: Proposal, hunkId: string): Proposal {
  return {
    ...proposal,
    hunks: proposal.hunks.map((h) =>
      h.id === hunkId ? { ...h, accepted: false, rejected: true } : h,
    ),
  }
}

function clusterChanges(parts: Change[]): Change[][] {
  const clusters: Change[][] = []
  let i = 0
  while (i < parts.length) {
    if (!parts[i].added && !parts[i].removed) {
      i += 1
      continue
    }
    const cluster: Change[] = []
    while (i < parts.length && (parts[i].added || parts[i].removed)) {
      cluster.push(parts[i])
      i += 1
    }
    clusters.push(cluster)
  }
  return clusters
}

/** Rebuild markdown from per-hunk accept/reject. Undecided hunks keep base text. */
export function materializeFromHunks(proposal: Proposal): string {
  const parts = diffLines(proposal.baseMarkdown, proposal.proposedMarkdown)
  const clusters = clusterChanges(parts)
  let out = ''
  let hi = 0
  let i = 0

  while (i < parts.length) {
    const part = parts[i]
    if (!part.added && !part.removed) {
      out += part.value
      i += 1
      continue
    }

    const cluster = clusters[hi]
    const hunk = proposal.hunks[hi]
    hi += 1
    i += cluster.length

    const takeAdded = Boolean(hunk?.accepted)
    for (const c of cluster) {
      if (takeAdded) {
        if (c.added) out += c.value
      } else if (c.removed) {
        out += c.value
      }
    }
  }

  return out
}

/** Annotated markdown for visual diff rendering (HTML-ish markers). */
export function annotateDiffMarkdown(proposal: Proposal): string {
  const parts = diffLines(proposal.baseMarkdown, proposal.proposedMarkdown)
  let out = ''
  let hi = 0
  let i = 0

  while (i < parts.length) {
    const part = parts[i]
    if (!part.added && !part.removed) {
      out += part.value
      i += 1
      continue
    }

    const hunk = proposal.hunks[hi++]
    const cluster: Change[] = []
    while (i < parts.length && (parts[i].added || parts[i].removed)) {
      cluster.push(parts[i])
      i += 1
    }

    if (hunk?.rejected) {
      for (const c of cluster) if (c.removed) out += c.value
      continue
    }
    if (hunk?.accepted) {
      for (const c of cluster) if (c.added) out += c.value
      continue
    }

    out += `\n\n<!--diff-hunk:${hunk?.id ?? 'x'}-->\n\n`
    for (const c of cluster) {
      if (c.removed) {
        for (const line of toLines(c.value)) {
          out += `\n%%DEL%%${line}%%/DEL%%\n`
        }
      }
      if (c.added) {
        for (const line of toLines(c.value)) {
          out += `\n%%INS%%${line}%%/INS%%\n`
        }
      }
    }
    out += `\n\n<!--/diff-hunk-->\n\n`
  }

  return out
}
