const { labels, descriptions, aliases, lemmas, glosses } = require('./simplify_text_attributes')

const {
  simplifyClaim: claim,
  simplifyPropertyClaims: propertyClaims,
  simplifyClaims: claims,
  simplifyQualifier: qualifier,
  simplifyPropertyQualifiers: propertyQualifiers,
  simplifyQualifiers: qualifiers,
  simplifyReferences: references,
} = require('./simplify_claims')

const { simplifyForm: form, simplifyForms: forms } = require('./simplify_forms')
const { simplifySense: sense, simplifySenses: senses } = require('./simplify_senses')

const sitelinks = require('./simplify_sitelinks')
const sparqlResults = require('./simplify_sparql_results')

module.exports = {
  labels,
  descriptions,
  aliases,
  claim,
  propertyClaims,
  claims,
  qualifier,
  propertyQualifiers,
  qualifiers,
  references,
  sitelinks,

  // Aliases
  snak: claim,
  propertySnaks: propertyClaims,
  snaks: claims,

  // Lexemes
  lemmas,
  glosses,
  form,
  forms,
  sense,
  senses,

  sparqlResults

  // Set in ./simplify_entity
  // entity,
  // entities,
}
