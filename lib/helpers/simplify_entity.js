const { simplifyClaims } = require('./simplify_claims')
const simplify = require('./simplify_text_attributes')

module.exports = (entity, options) => {
  return {
    id: entity.id,
    type: entity.type,
    modified: entity.modified,
    labels: simplify.labels(entity.labels),
    descriptions: simplify.descriptions(entity.descriptions),
    aliases: simplify.aliases(entity.aliases),
    claims: simplifyClaims(entity.claims, options),
    sitelinks: simplify.sitelinks(entity.sitelinks)
  }
}
