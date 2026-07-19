import type { TransportMode } from './types'

export const TRANSPORTS: {
  id: TransportMode
  label: string
  hint: string
  range: string
}[] = [
  { id: 'lan', label: 'LAN', hint: '同一無外網 Wi-Fi 分享器互傳', range: '同網段' },
  { id: 'hotspot', label: 'Hotspot', hint: '手機熱點互連同步', range: '熱點範圍' },
  { id: 'bluetooth', label: '藍牙 / Wi-Fi Direct', hint: '斷網點對點握手', range: '~10 公尺' },
]

export function transportLatencyMs(mode: TransportMode): number {
  if (mode === 'bluetooth') return 900
  if (mode === 'hotspot') return 500
  return 280
}

export function describeBroadcast(mode: TransportMode, seed: string): string {
  const t = TRANSPORTS.find((x) => x.id === mode)
  return `已透過 ${t?.label ?? mode} 廣播 Seed ${seed}（libp2p 概念層模擬）`
}
