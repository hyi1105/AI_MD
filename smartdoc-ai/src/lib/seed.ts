/** Content-addressed Seed (sha-256 hex, truncated for UX). */

export async function computeSeed(content: string): Promise<string> {
  const data = new TextEncoder().encode(content)
  const digest = await crypto.subtle.digest('SHA-256', data)
  const hex = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
  return `sd_${hex.slice(0, 16)}`
}

export function shortSeed(seed: string): string {
  if (seed.length <= 12) return seed
  return `${seed.slice(0, 8)}…${seed.slice(-4)}`
}

/** Platform signature stub — marks a document as "real user content". */
export async function signDocument(content: string, authorId: string): Promise<string> {
  const payload = `${authorId}::${content}`
  const data = new TextEncoder().encode(payload)
  const digest = await crypto.subtle.digest('SHA-256', data)
  const hex = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
  return `sig_${hex.slice(0, 24)}`
}

export function isPlatformSigned(signature: string | undefined): boolean {
  return Boolean(signature && signature.startsWith('sig_') && signature.length >= 20)
}
