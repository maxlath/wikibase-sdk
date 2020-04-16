const { isFormId } = require('./helpers')
const { representations: simplifyRepresentations } = require('./simplify_text_attributes')
const { simplifyClaims } = require('./simplify_claims')

const simplifyForm = (form, options) => {
  const { id, representations, grammaticalFeatures, claims } = form
  if (!isFormId(id)) throw new Error('invalid form object')
  return {
    id,
    representations: simplifyRepresentations(representations),
    grammaticalFeatures,
    claims: simplifyClaims(claims, options)
  }
}

const simplifyForms = (forms, options) => forms.map(form => simplifyForm(form, options))

module.exports = { simplifyForm, simplifyForms }
