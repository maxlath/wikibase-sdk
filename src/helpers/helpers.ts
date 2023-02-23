import type {
  EntityId,
  EntityPageTitle,
  EntitySchemaId,
  FormId,
  Guid,
  Hash,
  ItemId,
  LexemeId,
  MediaInfoId,
  NonNestedEntityId,
  NumericId,
  PropertyClaimsId,
  PropertyId,
  RevisionId,
  SenseId,
} from '../types/entity.js'
import type { Url } from '../types/options.js'

function isIdBuilder<T extends string> (regex: { readonly source: string, readonly flags: string }) {
  return (id: string): id is T => typeof id === 'string' && new RegExp(regex.source, regex.flags).test(id)
}

export const isNumericId = isIdBuilder<NumericId>(/^[1-9][0-9]*$/)
export const isEntityId = isIdBuilder<EntityId>(/^((Q|P|L|M|E)[1-9][0-9]*|L[1-9][0-9]*-(F|S)[1-9][0-9]*)$/)
export const isEntitySchemaId = isIdBuilder<EntitySchemaId>(/^E[1-9][0-9]*$/)
export const isItemId = isIdBuilder<ItemId>(/^Q[1-9][0-9]*$/)
export const isPropertyId = isIdBuilder<PropertyId>(/^P[1-9][0-9]*$/)
export const isLexemeId = isIdBuilder<LexemeId>(/^L[1-9][0-9]*$/)
export const isFormId = isIdBuilder<FormId>(/^L[1-9][0-9]*-F[1-9][0-9]*$/)
export const isSenseId = isIdBuilder<SenseId>(/^L[1-9][0-9]*-S[1-9][0-9]*$/)
export const isMediaInfoId = isIdBuilder<MediaInfoId>(/^M[1-9][0-9]*$/)
export const isGuid = isIdBuilder<Guid>(/^((Q|P|L|M|E)[1-9][0-9]*|L[1-9][0-9]*-(F|S)[1-9][0-9]*)\$[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
export const isHash = isIdBuilder<Hash>(/^[0-9a-f]{40}$/)
export const isRevisionId = isIdBuilder<RevisionId>(/^\d+$/)
export const isNonNestedEntityId = isIdBuilder<NonNestedEntityId>(/^(Q|P|L|M|E)[1-9][0-9]*$/)

export function isPropertyClaimsId (id: string): id is PropertyClaimsId {
  if (typeof id !== 'string') return false
  const [ entityId, propertyId ] = id.split('#')
  return isEntityId(entityId) && isPropertyId(propertyId)
}

export function isEntityPageTitle (title: string): title is EntityPageTitle {
  if (typeof title !== 'string') return false

  if (title.startsWith('Item:')) {
    return isItemId(title.substring(5))
  }

  if (title.startsWith('Lexeme:')) {
    return isLexemeId(title.substring(7))
  }

  if (title.startsWith('Property:')) {
    return isPropertyId(title.substring(9))
  }

  return isItemId(title)
}

export function getNumericId (id: string): NumericId {
  if (!isNonNestedEntityId(id)) throw new Error(`invalid entity id: ${id}`)
  return id.replace(/^(Q|P|L|M|E)/, '') as NumericId
}

export function getImageUrl (filename: string, width?: number): Url {
  let url = `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}`
  if (typeof width === 'number') url += `?width=${width}`
  return url
}

export function getEntityIdFromGuid (guid: Guid): EntityId {
  const parts = guid.split(/[$-]/)
  if (parts.length === 6) {
    // Examples:
    // - q520$BCA8D9DE-B467-473B-943C-6FD0C5B3D02C
    // - P6216-a7fd6230-496e-6b47-ca4a-dcec5dbd7f95
    return parts[0].toUpperCase() as EntityId
  } else if (parts.length === 7) {
    // Examples:
    // - L525-S1$66D20252-8CEC-4DB1-8B00-D713CFF42E48
    // - L525-F2-52c9b382-02f5-4413-9923-26ade74f5a0d
    return parts.slice(0, 2).join('-').toUpperCase() as EntityId
  } else {
    throw new Error(`invalid guid: ${guid}`)
  }
}
