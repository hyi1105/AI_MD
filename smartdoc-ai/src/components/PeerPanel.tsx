import { useState } from 'react'
import { TRANSPORTS } from '../lib/p2p'
import { shortSeed } from '../lib/seed'
import {
  TOKENOMICS_COPY,
  estimatedPayoutNtd,
  pointValueNtd,
  poolAmount,
} from '../lib/tokenomics'
import type { ContributionState, TransportMode } from '../lib/types'

interface Props {
  seed: string
  transport: TransportMode
  contribution: ContributionState
  statusLog: string[]
  busy: boolean
  onTransportChange: (mode: TransportMode) => void
  onToggleSeeding: () => void
  onCopySeed: () => void
  onFetchSeed: (seed: string, cheatSameIp: boolean) => void
  onSimulatePeerEdit: () => void
  onMergePeer: () => void
  peerBranchReady: boolean
}

export function PeerPanel({
  seed,
  transport,
  contribution,
  statusLog,
  busy,
  onTransportChange,
  onToggleSeeding,
  onCopySeed,
  onFetchSeed,
  onSimulatePeerEdit,
  onMergePeer,
  peerBranchReady,
}: Props) {
  const [fetchInput, setFetchInput] = useState('')
  const [cheatSameIp, setCheatSameIp] = useState(false)
  const pool = poolAmount(contribution.monthRevenueNtd)
  const vPoint = pointValueNtd(contribution)
  const payout = estimatedPayoutNtd(contribution)

  return (
    <aside className="peer-panel">
      <header className="peer-header">
        <div>
          <div className="ai-kicker">P2P · Local-First</div>
          <h2>Seed 節點</h2>
        </div>
        <button
          type="button"
          className={`seed-toggle ${contribution.seeding ? 'on' : ''}`}
          onClick={onToggleSeeding}
        >
          {contribution.seeding ? 'Seeding 中' : '開始 Seeding'}
        </button>
      </header>

      <section className="seed-card">
        <div className="seed-label">目前文件 Seed</div>
        <code title={seed}>{shortSeed(seed) || '計算中…'}</code>
        <button type="button" className="ghost-dark" onClick={onCopySeed} disabled={!seed}>
          複製完整 Seed
        </button>
      </section>

      <section className="transport-block">
        <div className="seed-label">傳輸通道（libp2p 模擬）</div>
        <div className="transport-switch">
          {TRANSPORTS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={transport === t.id ? 'active' : ''}
              title={`${t.hint} · ${t.range}`}
              onClick={() => onTransportChange(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p className="transport-hint">{TRANSPORTS.find((t) => t.id === transport)?.hint}</p>
      </section>

      <section className="economy-card">
        <div className="seed-label">任務分紅（10% 營收池）</div>
        <p className="economy-formula">{TOKENOMICS_COPY.share}</p>
        <p className="economy-formula mono">{TOKENOMICS_COPY.formula}</p>
        <dl className="economy-stats">
          <div>
            <dt>示範營收 R</dt>
            <dd>NT${contribution.monthRevenueNtd.toLocaleString()}</dd>
          </div>
          <div>
            <dt>獎金池 A</dt>
            <dd>NT${Math.round(pool).toLocaleString()}</dd>
          </div>
          <div>
            <dt>我的點數</dt>
            <dd>{contribution.points}</dd>
          </div>
          <div>
            <dt>估計分紅</dt>
            <dd>NT${payout.toFixed(1)}</dd>
          </div>
          <div>
            <dt>V_point</dt>
            <dd>NT${vPoint.toFixed(2)}</dd>
          </div>
          <div>
            <dt>上傳流量</dt>
            <dd>{(contribution.uploadedBytes / 1024).toFixed(1)} KB</dd>
          </div>
        </dl>
      </section>

      <section className="fetch-block">
        <div className="seed-label">以 Seed 請求下載</div>
        <input
          value={fetchInput}
          onChange={(e) => setFetchInput(e.target.value)}
          placeholder="貼上 sd_… Seed"
          spellCheck={false}
        />
        <label className="cheat-toggle">
          <input
            type="checkbox"
            checked={cheatSameIp}
            onChange={(e) => setCheatSameIp(e.target.checked)}
          />
          模擬同 LAN／IP 刷量（應被拒絕）
        </label>
        <button
          type="button"
          className="send-btn"
          disabled={busy || !fetchInput.trim()}
          onClick={() => onFetchSeed(fetchInput.trim(), cheatSameIp)}
        >
          請求下載並驗證點數
        </button>
      </section>

      <section className="crdt-block">
        <div className="seed-label">離線 CRDT 合併</div>
        <div className="crdt-actions">
          <button type="button" className="ghost-dark" disabled={busy} onClick={onSimulatePeerEdit}>
            模擬 Peer 離線修改
          </button>
          <button
            type="button"
            className="send-btn"
            disabled={busy || !peerBranchReady}
            onClick={onMergePeer}
          >
            合併並顯示 Diff
          </button>
        </div>
        <p className="transport-hint">
          {peerBranchReady
            ? 'Peer 分支已就緒，可合併進主文件。'
            : '先模擬 Peer 離線修改，再執行無衝突合併。'}
        </p>
      </section>

      <div className="peer-log" aria-live="polite">
        {statusLog.length === 0 && <p className="transport-hint">操作紀錄會顯示於此。</p>}
        {statusLog.map((line, i) => (
          <p key={`${i}-${line.slice(0, 12)}`}>{line}</p>
        ))}
      </div>
    </aside>
  )
}
