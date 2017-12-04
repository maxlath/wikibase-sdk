const { simplifyClaims } = require('./simplify_claims')
const simplify = require('./simplify_text_attributes')
const simplifySitelinks = require('./simplify_sitelinks')

module.exports = (entity, options) => {
  return {
    id: entity.id,
    type: entity.type,
    modified: entity.modified,
    labels: simplify.labels(entity.labels),
    descriptions: simplify.descriptions(entity.descriptions),
    aliases: simplify.aliases(entity.aliases),
    claims: simplifyClaims(entity.claims, options),
    sitelinks: simplifySitelinks(entity.sitelinks, options)
  }
}
