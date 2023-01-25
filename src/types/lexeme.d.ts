import type { Claims } from './claim.js'
import type { FormId, ItemId, PropertyId, SenseId } from './entity.js'
import type { TypedKeyDictionnary } from './helper.js'
import type { SimplifiedClaims } from './simplify_claims.js'
import type { Glosses, Representations, SimplifiedGlosses, SimplifiedRepresentations } from './terms.js'

export type Forms = TypedKeyDictionnary<PropertyId, Form[]>
export type Senses = TypedKeyDictionnary<PropertyId, Sense[]>

export interface Form {
  id: FormId;
  representations?: Representations;
  grammaticalFeatures?: ItemId[];
  claims?: Claims;
}

export interface Sense {
  id: SenseId;
  glosses?: Glosses;
  claims?: Claims;
}

export type SimplifiedForms = TypedKeyDictionnary<PropertyId, SimplifiedForm[]>
export type SimplifiedSenses = TypedKeyDictionnary<PropertyId, SimplifiedSense[]>

export interface SimplifiedForm {
  id: FormId;
  representations?: SimplifiedRepresentations;
  grammaticalFeatures?: ItemId[];
  claims?: SimplifiedClaims;
}

export interface SimplifiedSense {
  id: SenseId;
  glosses?: SimplifiedGlosses;
  claims?: SimplifiedClaims;
}
