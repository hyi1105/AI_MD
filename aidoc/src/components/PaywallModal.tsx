import { PRICING } from '../lib/quota'

interface Props {
  open: boolean
  onClose: () => void
  onBuyPayg: () => void
  onUpgradePro: () => void
}

export function PaywallModal({ open, onClose, onBuyPayg, onUpgradePro }: Props) {
  if (!open) return null
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="paywall-title">
      <div className="modal-card">
        <h2 id="paywall-title">免費額度已用完</h2>
        <p>
          視覺化渲染與紅綠 Accept 仍可使用。若要繼續請 AI 改文件，可選擇低摩擦加購或解鎖無限對話。
        </p>
        <div className="pay-options">
          <button
            type="button"
            onClick={() => {
              onBuyPayg()
              onClose()
            }}
          >
            <strong>按量付費</strong>
            <span>{PRICING.payg.label}</span>
          </button>
          <button
            type="button"
            className="pro"
            onClick={() => {
              onUpgradePro()
              onClose()
            }}
          >
            <strong>Pro 訂閱</strong>
            <span>無限 AI · Markdown 匯出 · {PRICING.pro.label}</span>
          </button>
        </div>
        <button type="button" className="modal-close" onClick={onClose}>
          稍後再說
        </button>
      </div>
    </div>
  )
}
