import { isFormId } from './helpers.js'
import { simplifyClaims } from './simplify_claims.js'
import { simplifyRepresentations } from './simplify_text_attributes.js'
import type { Form, SimplifiedForm } from '../types/lexeme.js'
import type { SimplifyClaimsOptions } from '../types/simplify_claims.js'

export const simplifyForm = (form: Form, options: SimplifyClaimsOptions = {}): SimplifiedForm => {
  const { id, representations, grammaticalFeatures, claims } = form
  if (!isFormId(id)) throw new Error('invalid form object')
  return {
    id,
    representations: simplifyRepresentations(representations),
    grammaticalFeatures,
    claims: simplifyClaims(claims, options),
  }
}

export const simplifyForms = (forms, options) => forms.map(form => simplifyForm(form, options))
