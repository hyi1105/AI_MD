import { useEffect, useMemo, useRef } from 'react'
import mermaid from 'mermaid'
import { annotateDiffMarkdown } from '../lib/diffEngine'
import { extractToc, renderMarkdownHtml } from '../lib/markdownRender'
import type { Proposal, RenderMode } from '../lib/types'

mermaid.initialize({
  startOnLoad: false,
  theme: 'neutral',
  securityLevel: 'loose',
  fontFamily: 'IBM Plex Sans, Noto Sans TC, sans-serif',
})

interface Props {
  markdown: string
  mode: RenderMode
  proposal: Proposal | null
  onAcceptHunk: (id: string) => void
  onRejectHunk: (id: string) => void
  onAcceptAll: () => void
  onRejectAll: () => void
}

export function DocumentView({
  markdown,
  mode,
  proposal,
  onAcceptHunk,
  onRejectHunk,
  onAcceptAll,
  onRejectAll,
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const pendingHunks = proposal?.hunks.filter((h) => !h.accepted && !h.rejected) ?? []

  const source = useMemo(() => {
    if (!proposal) return markdown
    return annotateDiffMarkdown(proposal)
  }, [markdown, proposal])

  const html = useMemo(() => renderMarkdownHtml(source), [source])
  const toc = useMemo(() => extractToc(markdown), [markdown])

  useEffect(() => {
    const el = hostRef.current
    if (!el) return
    el.innerHTML = html

    // Heading anchors for TOC
    el.querySelectorAll('h1, h2, h3').forEach((node) => {
      const text = node.textContent?.trim() ?? ''
      node.id = text.replace(/\s+/g, '-').toLowerCase()
    })

    const runMermaid = async () => {
      const nodes = el.querySelectorAll<HTMLElement>('.mermaid')
      if (!nodes.length) return
      try {
        await mermaid.run({ nodes: Array.from(nodes) })
      } catch {
        // keep source pre if render fails
      }
    }
    void runMermaid()

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const btn = target.closest<HTMLElement>('[data-action]')
      if (!btn) return
      const action = btn.dataset.action
      const hunkId = btn.dataset.hunk
      if (action === 'accept' && hunkId) onAcceptHunk(hunkId)
      if (action === 'reject' && hunkId) onRejectHunk(hunkId)
    }
    el.addEventListener('click', onClick)
    return () => el.removeEventListener('click', onClick)
  }, [html, onAcceptHunk, onRejectHunk])

  useEffect(() => {
    const el = hostRef.current
    if (!el || !proposal) return
    el.querySelectorAll<HTMLElement>('.diff-hunk').forEach((hunkEl) => {
      if (hunkEl.querySelector('.hunk-actions')) return
      const id = hunkEl.dataset.hunk
      if (!id) return
      const bar = document.createElement('div')
      bar.className = 'hunk-actions'
      bar.innerHTML = `
        <button type="button" class="btn-accept" data-action="accept" data-hunk="${id}">接受 Accept</button>
        <button type="button" class="btn-reject" data-action="reject" data-hunk="${id}">拒絕 Reject</button>
      `
      hunkEl.appendChild(bar)
    })
  }, [html, proposal])

  return (
    <div className={`doc-shell mode-${mode}`}>
      {mode === 'legal' && (
        <aside className="doc-toc" aria-label="條目導覽">
          <div className="toc-title">條目導覽</div>
          <nav>
            {toc.map((item) => (
              <a key={item.id} href={`#${item.id}`} className={`toc-l${item.level}`}>
                {item.text}
              </a>
            ))}
          </nav>
        </aside>
      )}

      <div className="doc-stage">
        {pendingHunks.length > 0 && (
          <div className="proposal-bar">
            <div>
              <strong>AI 修改處</strong>
              <span>
                {proposal?.summary} · 待處理 {pendingHunks.length} 處
              </span>
            </div>
            <div className="proposal-actions">
              <button type="button" className="btn-accept" onClick={onAcceptAll}>
                全部接受
              </button>
              <button type="button" className="btn-reject" onClick={onRejectAll}>
                全部拒絕
              </button>
            </div>
          </div>
        )}

        <article className={`doc-page mode-${mode}`} ref={hostRef} />
      </div>
    </div>
  )
}
