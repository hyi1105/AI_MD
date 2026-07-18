import { useEffect, useMemo, useRef, useState } from 'react'
import { QUICK_PROMPTS } from '../lib/sampleDoc'
import { extractSections } from '../lib/markdownRender'
import type { ChatMessage, ModelTier, QuotaState } from '../lib/types'
import { remainingChats } from '../lib/quota'

interface Props {
  messages: ChatMessage[]
  markdown: string
  quota: QuotaState
  busy: boolean
  gateError: string | null
  cooldownMs: number
  onSend: (text: string) => void
  onBuyPayg: () => void
  onUpgradePro: () => void
}

export function AiSidebar({
  messages,
  markdown,
  quota,
  busy,
  gateError,
  cooldownMs,
  onSend,
  onBuyPayg,
  onUpgradePro,
}: Props) {
  const [text, setText] = useState('')
  const listRef = useRef<HTMLDivElement>(null)
  const sections = useMemo(() => extractSections(markdown), [markdown])
  const left = remainingChats(quota)

  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, busy])

  const submit = () => {
    if (busy) return
    onSend(text)
    setText('')
  }

  const modelHint = (m?: ModelTier) =>
    m === 'deep' ? '深度模型' : m === 'economy' ? '平價模型' : null

  return (
    <aside className="ai-sidebar">
      <header className="ai-header">
        <div>
          <div className="ai-kicker">AI 協作</div>
          <h2>對話修訂</h2>
        </div>
        <div className="quota-chip" title="本月 AI 對話額度">
          {quota.plan === 'pro' ? 'Pro · 無限' : `剩餘 ${left} 次`}
        </div>
      </header>

      <div className="ai-hints">
        <p>用直白中文下指令，可用 <code>@章節</code> 提及特定條文。</p>
        <div className="mention-row">
          {sections.slice(0, 4).map((s) => (
            <button
              key={s}
              type="button"
              className="mention-chip"
              onClick={() => setText((t) => `${t}${t && !t.endsWith(' ') ? ' ' : ''}@${s} `)}
            >
              @{s.replace(/^第.+條\s*/, '').slice(0, 8)}
            </button>
          ))}
        </div>
      </div>

      <div className="chat-list" ref={listRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-bubble role-${msg.role}`}>
            <div className="chat-meta">
              {msg.role === 'user' ? '你' : 'SmartDoc AI'}
              {modelHint(msg.model) && <span className="model-tag">{modelHint(msg.model)}</span>}
            </div>
            <div className="chat-body">{msg.content}</div>
          </div>
        ))}
        {busy && (
          <div className="chat-bubble role-assistant typing">
            <div className="chat-meta">SmartDoc AI</div>
            <div className="chat-body">正在讀取 .md 並調配模型…</div>
          </div>
        )}
      </div>

      <div className="quick-prompts">
        {QUICK_PROMPTS.map((p) => (
          <button key={p} type="button" onClick={() => setText(p)}>
            {p}
          </button>
        ))}
      </div>

      {gateError && <div className="gate-error">{gateError}</div>}

      <div className="composer">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="例如：幫我把這段合約的違約金提高到千分之一"
          rows={3}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              submit()
            }
          }}
        />
        <button type="button" className="send-btn" disabled={busy || cooldownMs > 0} onClick={submit}>
          {cooldownMs > 0 ? `等待 ${Math.ceil(cooldownMs / 1000)}s` : busy ? '處理中…' : '發送'}
        </button>
      </div>

      <footer className="billing-footer">
        <button type="button" onClick={onBuyPayg}>
          加購 NT$30 / 50 次
        </button>
        <button type="button" className="pro" onClick={onUpgradePro}>
          升級 Pro
        </button>
      </footer>
    </aside>
  )
}
