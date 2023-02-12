import { isSenseId } from './helpers.js'
import { simplifyClaims } from './simplify_claims.js'
import { simplifyGlosses } from './simplify_text_attributes.js'
import type { Sense, SimplifiedSense } from '../types/lexeme.js'
import type { SimplifyClaimsOptions } from '../types/simplify_claims.js'

export const simplifySense = (sense: Sense, options: SimplifyClaimsOptions = {}): SimplifiedSense => {
  const { id, glosses, claims } = sense
  if (!isSenseId(id)) throw new Error('invalid sense object')
  return {
    id,
    glosses: simplifyGlosses(glosses),
    claims: simplifyClaims(claims, options),
  }
}

export function simplifySenses (senses: readonly Sense[], options: SimplifyClaimsOptions = {}) {
  return senses.map(sense => simplifySense(sense, options))
}
