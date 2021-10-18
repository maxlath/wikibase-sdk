const truthyPropertyClaims = propClaims => {
  const aggregate = propClaims.reduce(aggregatePerRank, {})
  // on truthyness: https://www.mediawiki.org/wiki/Wikibase/Indexing/RDF_Dump_Format#Truthy_statements
  return aggregate.preferred || aggregate.normal || []
}

const nonDeprecatedPropertyClaims = propClaims => {
  return propClaims.filter(claim => claim.rank !== 'deprecated')
}

const aggregatePerRank = (aggregate, claim) => {
  const { rank } = claim
  aggregate[rank] || (aggregate[rank] = [])
  aggregate[rank].push(claim)
  return aggregate
}

const truthyClaims = claims => {
  const truthClaimsOnly = {}
  Object.keys(claims).forEach(property => {
    truthClaimsOnly[property] = truthyPropertyClaims(claims[property])
  })
  return truthClaimsOnly
}

module.exports = { truthyClaims, truthyPropertyClaims, nonDeprecatedPropertyClaims }
