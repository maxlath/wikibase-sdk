import type { Claims, PropertyClaims } from '../types/claim.js'

export function truthyPropertyClaims (propertyClaims: PropertyClaims): PropertyClaims {
  const aggregate = propertyClaims.reduce(aggregatePerRank, {})
  // on truthyness: https://www.mediawiki.org/wiki/Wikibase/Indexing/RDF_Dump_Format#Truthy_statements
  return aggregate.preferred || aggregate.normal || []
}

export function nonDeprecatedPropertyClaims (propertyClaims: PropertyClaims): PropertyClaims {
  return propertyClaims.filter(claim => claim.rank !== 'deprecated')
}

const aggregatePerRank = (aggregate, claim) => {
  const { rank } = claim
  aggregate[rank] || (aggregate[rank] = [])
  aggregate[rank].push(claim)
  return aggregate
}

export function truthyClaims (claims: Claims): Claims {
  const truthClaimsOnly = {}
  Object.keys(claims).forEach(property => {
    truthClaimsOnly[property] = truthyPropertyClaims(claims[property])
  })
  return truthClaimsOnly
}
