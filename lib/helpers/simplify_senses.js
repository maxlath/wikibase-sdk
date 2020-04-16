const { isSenseId } = require('./helpers')
const { glosses: simplifyGlosses } = require('./simplify_text_attributes')
const { simplifyClaims } = require('./simplify_claims')

const simplifySense = (sense, options) => {
  const { id, glosses, claims } = sense
  if (!isSenseId(id)) throw new Error('invalid sense object')
  return {
    id,
    glosses: simplifyGlosses(glosses),
    claims: simplifyClaims(claims, options)
  }
}

const simplifySenses = (senses, options) => senses.map(sense => simplifySense(sense, options))

module.exports = { simplifySense, simplifySenses }
