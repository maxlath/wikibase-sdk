import { typedEntries } from '../utils/utils.js'
import type { Claim, Rank, Statement } from '../types/claim.js'
import type { PropertyId } from '../types/entity.js'

export const ranks = [ 'normal', 'preferred', 'deprecated' ] as const

export function truthyPropertyClaims <T extends (Claim | Statement)> (propertyClaims: T[]): T[] {
  const aggregate: Partial<Record<Rank, T[]>> = {}
  for (const claim of propertyClaims) {
    const { rank } = claim
    aggregate[rank] = aggregate[rank] || []
    aggregate[rank].push(claim)
  }

  // on truthyness: https://www.mediawiki.org/wiki/Wikibase/Indexing/RDF_Dump_Format#Truthy_statements
  return aggregate.preferred || aggregate.normal || []
}

export function nonDeprecatedPropertyClaims <T extends (Claim | Statement)> (propertyClaims: T[]): T[] {
  return propertyClaims.filter(claim => claim.rank !== 'deprecated')
}

export function truthyClaims <T extends (Claim | Statement)> (claims: Record<PropertyId, T[]>): Record<PropertyId, T[]> {
  const truthClaimsOnly: Record<PropertyId, T[]> = {}
  for (const [ property, value ] of typedEntries(claims)) {
    truthClaimsOnly[property] = truthyPropertyClaims(value)
  }
  return truthClaimsOnly
}
