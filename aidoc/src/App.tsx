import { useCallback, useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { AiSidebar } from './components/AiSidebar'
import { DocumentView } from './components/DocumentView'
import { PaywallModal } from './components/PaywallModal'
import { PeerPanel } from './components/PeerPanel'
import { generateEdit } from './lib/aiEngine'
import { mergeOfflineBranches, simulatePeerOfflineEdit } from './lib/crdtMerge'
import {
  acceptAll,
  acceptHunk,
  createProposal,
  materializeFromHunks,
  rejectAll,
  rejectHunk,
} from './lib/diffEngine'
import { checkRateLimit, markSend, remainingCooldown, validateInput } from './lib/gates'
import {
  loadLocalMarkdown,
  loadSeedIndex,
  saveLocalMarkdown,
  saveSeedIndex,
  upsertSeedRecord,
} from './lib/localStore'
import { describeBroadcast, transportLatencyMs } from './lib/p2p'
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
import { computeSeed, signDocument } from './lib/seed'
import {
  awardUploadPoints,
  loadContribution,
  saveContribution,
  tickOnlineContribution,
  validateSeedDownload,
} from './lib/tokenomics'
import type {
  ChatMessage,
  ContributionState,
  Proposal,
  QuotaState,
  RenderMode,
  TransportMode,
} from './lib/types'
import './App.css'

const MODES: { id: RenderMode; label: string; hint: string }[] = [
  { id: 'legal', label: '合約模式', hint: 'A4 · 新細明體風格 · 條目導覽' },
  { id: 'diagram', label: '流程圖模式', hint: 'Mermaid 互動圖表' },
  { id: 'report', label: '商用報告', hint: '黑體 · 標題底條 · 網格表' },
]

const AUTHOR_ID = 'local-node-01'

function settleIfDone(updated: Proposal): { markdown: string | null; proposal: Proposal | null } {
  const pending = updated.hunks.some((h) => !h.accepted && !h.rejected)
  if (pending) return { markdown: null, proposal: updated }
  return { markdown: materializeFromHunks(updated), proposal: null }
}

export default function App() {
  const [markdown, setMarkdown] = useState(() => loadLocalMarkdown(SAMPLE_MARKDOWN))
  const [mode, setMode] = useState<RenderMode>('legal')
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uuid(),
      role: 'assistant',
      content:
        '你好，我是 AI Doc。像 Cursor 一樣，用對話改這一份檔；AI 產出後會標出修改處，你再 Accept／Reject。試試：「把違約金改成千分之一」。',
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
  const [rightTab, setRightTab] = useState<'ai' | 'p2p'>('ai')

  const [seed, setSeed] = useState('')
  const [signature, setSignature] = useState('')
  const [transport, setTransport] = useState<TransportMode>('lan')
  const [contribution, setContribution] = useState<ContributionState>(() => loadContribution())
  const [seedIndex, setSeedIndex] = useState(() => loadSeedIndex())
  const [statusLog, setStatusLog] = useState<string[]>([])
  const [peerBranch, setPeerBranch] = useState<string | null>(null)
  const [p2pBusy, setP2pBusy] = useState(false)

  const pushLog = useCallback((line: string) => {
    setStatusLog((prev) => [line, ...prev].slice(0, 12))
  }, [])

  useEffect(() => {
    saveQuota(quota)
  }, [quota])

  useEffect(() => {
    saveContribution(contribution)
  }, [contribution])

  useEffect(() => {
    saveLocalMarkdown(markdown)
  }, [markdown])

  useEffect(() => {
    saveSeedIndex(seedIndex)
  }, [seedIndex])

  useEffect(() => {
    const t = window.setInterval(() => setCooldownMs(remainingCooldown()), 200)
    return () => window.clearInterval(t)
  }, [])

  // Recompute content-addressed Seed + platform signature on doc change
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const nextSeed = await computeSeed(markdown)
      const sig = await signDocument(markdown, AUTHOR_ID)
      if (cancelled) return
      setSeed(nextSeed)
      setSignature(sig)
      setSeedIndex((idx) =>
        upsertSeedRecord(idx, {
          seed: nextSeed,
          markdown,
          signature: sig,
          authorId: AUTHOR_ID,
          updatedAt: Date.now(),
          title: 'service-agreement.md',
        }),
      )
    })()
    return () => {
      cancelled = true
    }
  }, [markdown])

  // Online seeding contribution ticks
  useEffect(() => {
    if (!contribution.seeding) return
    const t = window.setInterval(() => {
      setContribution((c) => tickOnlineContribution(c, 1))
    }, 60_000)
    return () => window.clearInterval(t)
  }, [contribution.seeding])

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

  const exportMarkdown = () => {
    if (quota.plan !== 'pro') {
      setExportToast('Markdown 匯出為 Pro 功能，請先升級訂閱。')
      window.setTimeout(() => setExportToast(null), 2800)
      setPaywall(true)
      return
    }
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'service-agreement.md'
    a.click()
    URL.revokeObjectURL(url)
    setExportToast('已匯出 Markdown（.md）')
    window.setTimeout(() => setExportToast(null), 3200)
  }

  const onCopySeed = async () => {
    if (!seed) return
    try {
      await navigator.clipboard.writeText(seed)
      pushLog(`已複製 Seed：${seed}`)
      pushLog(describeBroadcast(transport, seed))
      setExportToast('Seed 已複製，可在斷網環境分享給其他節點')
      window.setTimeout(() => setExportToast(null), 2500)
    } catch {
      pushLog('複製失敗，請手動選取 Seed')
    }
  }

  const toggleSeeding = () => {
    setContribution((c) => {
      const seeding = !c.seeding
      pushLog(seeding ? '已開啟 Seeding：提供路由與檔案上傳節點' : '已停止 Seeding')
      return seeding ? tickOnlineContribution({ ...c, seeding }, 1) : { ...c, seeding }
    })
  }

  const onFetchSeed = async (inputSeed: string, cheatSameIp: boolean) => {
    setP2pBusy(true)
    pushLog(`透過 ${transport.toUpperCase()} 尋址 Seed ${inputSeed}…`)
    await new Promise((r) => setTimeout(r, transportLatencyMs(transport)))

    const record = seedIndex[inputSeed]
    if (!record) {
      pushLog('找不到 Seed（示範索引僅含本機已簽章文件）')
      setP2pBusy(false)
      return
    }

    const attempt = {
      content: record.markdown,
      bytes: new TextEncoder().encode(record.markdown).length,
      sameLanOrIp: cheatSameIp,
      signature: record.signature,
    }
    const gate = validateSeedDownload(attempt)
    if (!gate.ok) {
      setContribution((c) => ({ ...c, rejectedAttempts: c.rejectedAttempts + 1 }))
      pushLog(`拒絕發放點數：${gate.reason}`)
      setP2pBusy(false)
      return
    }

    setContribution((c) => awardUploadPoints(c, attempt.bytes))
    pushLog(`下載成功（${attempt.bytes} bytes）。已依有效上傳流量發放貢獻點數。`)
    setMarkdown(record.markdown)
    setProposal(null)
    setP2pBusy(false)
  }

  const onSimulatePeerEdit = () => {
    const branch = simulatePeerOfflineEdit(markdown)
    setPeerBranch(branch)
    pushLog('已建立 Peer 離線分支（不同段落修改）')
  }

  const onMergePeer = () => {
    if (!peerBranch) return
    setP2pBusy(true)
    const { merged, addedFromPeer, conflictResolved } = mergeOfflineBranches(markdown, peerBranch)
    const prop = createProposal(markdown, merged, 'CRDT 離線合併結果', 'economy')
    setProposal(prop)
    setPeerBranch(null)
    pushLog(
      `CRDT 合併完成：新增 ${addedFromPeer.length} 段、協調 ${conflictResolved} 處。請 Accept／Reject。`,
    )
    setRightTab('ai')
    setP2pBusy(false)
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand-block">
          <a className="hub-back" href="../index.html" title="返回 SEED 平台">
            ← SEED
          </a>
          <div className="brand-mark" aria-hidden />
          <div>
            <div className="brand">AI Doc</div>
            <p className="tagline">AI 改檔 · 顯示修改處（示範引擎）</p>
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
          <button
            type="button"
            className="ghost seed-pill"
            onClick={onCopySeed}
            title={seed}
            disabled={!seed}
          >
            Seed {seed ? seed.replace(/^sd_/, '').slice(0, 8) : '…'}
          </button>
          <button type="button" className="ghost" onClick={() => setShowSource((s) => !s)}>
            {showSource ? '關閉原始碼' : '檢視 .md'}
          </button>
          <button type="button" className="ghost" onClick={exportMarkdown}>
            匯出 Markdown
          </button>
          <span className="file-pill">local-first.md</span>
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

        <div className="right-dock">
          <div className="dock-tabs" role="tablist" aria-label="右側面板">
            <button
              type="button"
              role="tab"
              className={rightTab === 'ai' ? 'active' : ''}
              onClick={() => setRightTab('ai')}
            >
              AI 協作
            </button>
            <button
              type="button"
              role="tab"
              className={rightTab === 'p2p' ? 'active' : ''}
              onClick={() => setRightTab('p2p')}
            >
              P2P 示範
            </button>
          </div>
          {rightTab === 'ai' ? (
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
          ) : (
            <PeerPanel
              seed={seed}
              transport={transport}
              contribution={contribution}
              statusLog={statusLog}
              busy={p2pBusy}
              onTransportChange={setTransport}
              onToggleSeeding={toggleSeeding}
              onCopySeed={onCopySeed}
              onFetchSeed={onFetchSeed}
              onSimulatePeerEdit={onSimulatePeerEdit}
              onMergePeer={onMergePeer}
              peerBranchReady={Boolean(peerBranch)}
            />
          )}
        </div>
      </main>

      <PaywallModal
        open={paywall}
        onClose={() => setPaywall(false)}
        onBuyPayg={onBuyPayg}
        onUpgradePro={onUpgradePro}
      />

      {exportToast && <div className="toast">{exportToast}</div>}

      <footer className="p2p-strip" aria-label="節點狀態">
        <span>Local-First</span>
        <span>通道 {transport.toUpperCase()}</span>
        <span>{contribution.seeding ? 'Seeding ON' : 'Seeding OFF'}</span>
        <span>點數 {contribution.points}</span>
        <span title={signature}>簽章 {signature ? '已認證' : '…'}</span>
      </footer>
    </div>
  )
}
