export type RenderMode = 'legal' | 'diagram' | 'report'

export type PlanTier = 'free' | 'payg' | 'pro'

export type ModelTier = 'economy' | 'deep'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  model?: ModelTier
  mentions?: string[]
  createdAt: number
}

export interface DiffHunk {
  id: string
  oldStart: number
  newStart: number
  removed: string[]
  added: string[]
  accepted?: boolean
  rejected?: boolean
}

export interface Proposal {
  id: string
  baseMarkdown: string
  proposedMarkdown: string
  hunks: DiffHunk[]
  summary: string
  model: ModelTier
}

export interface QuotaState {
  plan: PlanTier
  monthlyAiUsed: number
  monthlyAiLimit: number
  paygCredits: number
  deepUsed: number
  deepLimit: number
  monthKey: string
}

export interface GateResult {
  ok: boolean
  reason?: string
}
