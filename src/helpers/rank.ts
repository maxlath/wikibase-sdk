import { typedEntries } from '../utils/utils.js'
import type { Claim, Claims, PropertyClaims, Rank } from '../types/claim.js'

export function truthyPropertyClaims (propertyClaims: PropertyClaims): PropertyClaims {
  const aggregate: Partial<Record<Rank, Claim[]>> = {}
  for (const claim of propertyClaims) {
    const { rank } = claim
    aggregate[rank] ??= []
    aggregate[rank].push(claim)
  }

  // on truthyness: https://www.mediawiki.org/wiki/Wikibase/Indexing/RDF_Dump_Format#Truthy_statements
  return aggregate.preferred || aggregate.normal || []
}

export function nonDeprecatedPropertyClaims (propertyClaims: PropertyClaims): PropertyClaims {
  return propertyClaims.filter(claim => claim.rank !== 'deprecated')
}

export function truthyClaims (claims: Claims): Claims {
  const truthClaimsOnly: Claims = {}
  for (const [ property, value ] of typedEntries(claims)) {
    truthClaimsOnly[property] = truthyPropertyClaims(value)
  }
  return truthClaimsOnly
}
