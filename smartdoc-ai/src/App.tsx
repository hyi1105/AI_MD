import { useCallback, useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { AiSidebar } from './components/AiSidebar'
import { DocumentView } from './components/DocumentView'
import { PaywallModal } from './components/PaywallModal'
import { generateEdit } from './lib/aiEngine'
import {
  acceptAll,
  acceptHunk,
  materializeFromHunks,
  rejectAll,
  rejectHunk,
} from './lib/diffEngine'
import { checkRateLimit, markSend, remainingCooldown, validateInput } from './lib/gates'
import {
  buyPaygPack,
  canUseAi,
  consumeAiCredit,
  consumeDeep,
  loadQuota,
  saveQuota,
  upgradePro,
} from './lib/quota'
import { SAMPLE_MARKDOWN } from './lib/sampleDoc'
import type { ChatMessage, Proposal, QuotaState, RenderMode } from './lib/types'
import './App.css'

const MODES: { id: RenderMode; label: string; hint: string }[] = [
  { id: 'legal', label: '合約模式', hint: 'A4 · 新細明體風格 · 條目導覽' },
  { id: 'diagram', label: '流程圖模式', hint: 'Mermaid 互動圖表' },
  { id: 'report', label: '商用報告', hint: '黑體 · 標題底條 · 網格表' },
]

function settleIfDone(updated: Proposal): { markdown: string | null; proposal: Proposal | null } {
  const pending = updated.hunks.some((h) => !h.accepted && !h.rejected)
  if (pending) return { markdown: null, proposal: updated }
  return { markdown: materializeFromHunks(updated), proposal: null }
}

export default function App() {
  const [markdown, setMarkdown] = useState(SAMPLE_MARKDOWN)
  const [mode, setMode] = useState<RenderMode>('legal')
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uuid(),
      role: 'assistant',
      content:
        '你好，我是 SmartDoc AI。底層以 Markdown 儲存，可切換合約／流程圖／報告渲染。試試：「幫我把違約金提高到千分之一」。',
      createdAt: Date.now(),
    },
  ])
  const [quota, setQuota] = useState<QuotaState>(() => loadQuota())
  const [busy, setBusy] = useState(false)
  const [gateError, setGateError] = useState<string | null>(null)
  const [cooldownMs, setCooldownMs] = useState(0)
  const [paywall, setPaywall] = useState(false)
  const [showSource, setShowSource] = useState(false)
  const [exportToast, setExportToast] = useState<string | null>(null)

  useEffect(() => {
    saveQuota(quota)
  }, [quota])

  useEffect(() => {
    const t = window.setInterval(() => setCooldownMs(remainingCooldown()), 200)
    return () => window.clearInterval(t)
  }, [])

  const handleAcceptHunk = useCallback(
    (id: string) => {
      if (!proposal) return
      const { markdown: md, proposal: next } = settleIfDone(acceptHunk(proposal, id))
      if (md !== null) setMarkdown(md)
      setProposal(next)
    },
    [proposal],
  )

  const handleRejectHunk = useCallback(
    (id: string) => {
      if (!proposal) return
      const { markdown: md, proposal: next } = settleIfDone(rejectHunk(proposal, id))
      if (md !== null) setMarkdown(md)
      setProposal(next)
    },
    [proposal],
  )

  const handleAcceptAll = useCallback(() => {
    if (!proposal) return
    setMarkdown(acceptAll(proposal))
    setProposal(null)
  }, [proposal])

  const handleRejectAll = useCallback(() => {
    if (!proposal) return
    setMarkdown(rejectAll(proposal))
    setProposal(null)
  }, [proposal])

  const onBuyPayg = () => setQuota((q) => buyPaygPack(q))
  const onUpgradePro = () => setQuota((q) => upgradePro(q))

  const onSend = async (text: string) => {
    setGateError(null)
    const v = validateInput(text)
    if (!v.ok) {
      setGateError(v.reason ?? '輸入無效')
      return
    }
    const r = checkRateLimit()
    if (!r.ok) {
      setGateError(r.reason ?? '請稍候再試')
      return
    }
    if (!canUseAi(quota)) {
      setPaywall(true)
      return
    }

    markSend()
    setMessages((m) => [
      ...m,
      { id: uuid(), role: 'user', content: text.trim(), createdAt: Date.now() },
    ])
    setBusy(true)

    try {
      const working = proposal ? proposal.baseMarkdown : markdown
      const result = await generateEdit(working, text.trim())

      let nextQuota = quota
      if (result.model === 'deep') {
        const deep = consumeDeep(quota)
        if (!deep.ok) {
          setMessages((m) => [
            ...m,
            {
              id: uuid(),
              role: 'system',
              content: deep.reason ?? '深度分析額度不足',
              createdAt: Date.now(),
            },
          ])
          return
        }
        nextQuota = deep.next
      }
      setQuota(consumeAiCredit(nextQuota))
      setProposal(result.proposal)
      setMessages((m) => [
        ...m,
        {
          id: uuid(),
          role: 'assistant',
          content: result.reply,
          model: result.model,
          mentions: result.mentions,
          createdAt: Date.now(),
        },
      ])
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          id: uuid(),
          role: 'system',
          content: e instanceof Error ? e.message : 'AI 處理失敗',
          createdAt: Date.now(),
        },
      ])
    } finally {
      setBusy(false)
    }
  }

  const exportDocx = () => {
    if (quota.plan !== 'pro') {
      setExportToast('Word 匯出為 Pro 功能，請先升級訂閱。')
      window.setTimeout(() => setExportToast(null), 2800)
      setPaywall(true)
      return
    }
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'service-agreement.docx.md'
    a.click()
    URL.revokeObjectURL(url)
    setExportToast('已匯出文件（MVP 以 Markdown 封裝；正式版輸出標準 .docx）')
    window.setTimeout(() => setExportToast(null), 3200)
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand-block">
          <div className="brand-mark" aria-hidden />
          <div>
            <div className="brand">SmartDoc AI</div>
            <p className="tagline">Word 界的 Cursor — 對話式文件編輯</p>
          </div>
        </div>

        <div className="mode-switch" role="tablist" aria-label="渲染模式">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={mode === m.id}
              className={mode === m.id ? 'active' : ''}
              title={m.hint}
              onClick={() => setMode(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="top-actions">
          <button type="button" className="ghost" onClick={() => setShowSource((s) => !s)}>
            {showSource ? '關閉原始碼' : '檢視 .md'}
          </button>
          <button type="button" className="ghost" onClick={exportDocx}>
            匯出 Word
          </button>
          <span className="file-pill">service-agreement.md</span>
        </div>
      </header>

      <main className="workspace">
        <section className="editor-pane">
          {showSource ? (
            <textarea
              className="source-editor"
              value={markdown}
              onChange={(e) => {
                setMarkdown(e.target.value)
                setProposal(null)
              }}
              spellCheck={false}
            />
          ) : (
            <DocumentView
              markdown={markdown}
              mode={mode}
              proposal={proposal}
              onAcceptHunk={handleAcceptHunk}
              onRejectHunk={handleRejectHunk}
              onAcceptAll={handleAcceptAll}
              onRejectAll={handleRejectAll}
            />
          )}
        </section>

        <AiSidebar
          messages={messages}
          markdown={markdown}
          quota={quota}
          busy={busy}
          gateError={gateError}
          cooldownMs={cooldownMs}
          onSend={onSend}
          onBuyPayg={onBuyPayg}
          onUpgradePro={onUpgradePro}
        />
      </main>

      <PaywallModal
        open={paywall}
        onClose={() => setPaywall(false)}
        onBuyPayg={onBuyPayg}
        onUpgradePro={onUpgradePro}
      />

      {exportToast && <div className="toast">{exportToast}</div>}
    </div>
  )
}
