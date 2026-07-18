import { marked } from 'marked'

marked.setOptions({
  gfm: true,
  breaks: true,
})

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Convert annotated diff markers + markdown into safe HTML. */
export function renderMarkdownHtml(source: string): string {
  // Protect mermaid fences
  const mermaidBlocks: string[] = []
  let md = source.replace(/```mermaid\n([\s\S]*?)```/g, (_, code: string) => {
    const idx = mermaidBlocks.length
    mermaidBlocks.push(code.trim())
    return `\n\n@@MERMAID_${idx}@@\n\n`
  })

  // Diff markers → HTML placeholders before markdown
  md = md
    .replace(/%%DEL%%([\s\S]*?)%%\/DEL%%/g, (_, text: string) => {
      return `<p class="diff-line diff-del"><span class="diff-label">刪除</span>${escapeHtml(text)}</p>`
    })
    .replace(/%%INS%%([\s\S]*?)%%\/INS%%/g, (_, text: string) => {
      return `<p class="diff-line diff-ins"><span class="diff-label">新增</span>${escapeHtml(text)}</p>`
    })
    .replace(/<!--diff-hunk:([^-->]+)-->/g, '<div class="diff-hunk" data-hunk="$1">')
    .replace(/<!--\/diff-hunk-->/g, '</div>')

  let html = marked.parse(md, { async: false }) as string

  html = html.replace(/@@MERMAID_(\d+)@@/g, (_, idx: string) => {
    const code = mermaidBlocks[Number(idx)] ?? ''
    return `<div class="mermaid-host" data-mermaid="${escapeHtml(code)}"><pre class="mermaid">${escapeHtml(code)}</pre></div>`
  })

  return html
}

export function extractToc(markdown: string): { id: string; text: string; level: number }[] {
  const lines = markdown.split('\n')
  const toc: { id: string; text: string; level: number }[] = []
  for (const line of lines) {
    const m = /^(#{1,3})\s+(.+)$/.exec(line)
    if (!m) continue
    const text = m[2].replace(/[*_`]/g, '').trim()
    const id = text.replace(/\s+/g, '-').toLowerCase()
    toc.push({ id, text, level: m[1].length })
  }
  return toc
}

export function extractSections(markdown: string): string[] {
  return extractToc(markdown)
    .filter((t) => t.level === 2)
    .map((t) => t.text)
}
