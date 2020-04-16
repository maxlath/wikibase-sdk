const { labels, descriptions, aliases } = require('./simplify_text_attributes')

const {
  simplifyEntity: entity,
  simplifyEntities: entities
} = require('./simplify_entity')

const {
  simplifyClaim: claim,
  simplifyPropertyClaims: propertyClaims,
  simplifyClaims: claims,
  simplifyQualifier: qualifier,
  simplifyPropertyQualifiers: propertyQualifiers,
  simplifyQualifiers: qualifiers
} = require('./simplify_claims')

const { simplifyForm: form, simplifyForms: forms } = require('./simplify_forms')

const sitelinks = require('./simplify_sitelinks')
const sparqlResults = require('./simplify_sparql_results')

module.exports = {
  entity,
  entities,
  labels,
  descriptions,
  aliases,
  claim,
  propertyClaims,
  claims,
  qualifier,
  propertyQualifiers,
  qualifiers,
  sitelinks,
  form,
  forms,
  sparqlResults
}
