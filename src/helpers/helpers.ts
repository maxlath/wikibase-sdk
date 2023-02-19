import { wikibaseTimeToDateObject as toDateObject } from './wikibase_time_to_date_object.js'
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
export const isEntityId = isIdBuilder<EntityId>(/^((Q|P|L|M)[1-9][0-9]*|L[1-9][0-9]*-(F|S)[1-9][0-9]*)$/)
export const isEntitySchemaId = isIdBuilder<EntitySchemaId>(/^E[1-9][0-9]*$/)
export const isItemId = isIdBuilder<ItemId>(/^Q[1-9][0-9]*$/)
export const isPropertyId = isIdBuilder<PropertyId>(/^P[1-9][0-9]*$/)
export const isLexemeId = isIdBuilder<LexemeId>(/^L[1-9][0-9]*$/)
export const isFormId = isIdBuilder<FormId>(/^L[1-9][0-9]*-F[1-9][0-9]*$/)
export const isSenseId = isIdBuilder<SenseId>(/^L[1-9][0-9]*-S[1-9][0-9]*$/)
export const isMediaInfoId = isIdBuilder<MediaInfoId>(/^M[1-9][0-9]*$/)
export const isGuid = isIdBuilder<Guid>(/^((Q|P|L|M)[1-9][0-9]*|L[1-9][0-9]*-(F|S)[1-9][0-9]*)\$[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
export const isHash = isIdBuilder<Hash>(/^[0-9a-f]{40}$/)
export const isRevisionId = isIdBuilder<RevisionId>(/^\d+$/)
export const isNonNestedEntityId = isIdBuilder<NonNestedEntityId>(/^(Q|P|L|M)[1-9][0-9]*$/)

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
  return id.replace(/^(Q|P|L|M)/, '') as NumericId
}

export interface WikibaseTimeObject {
  time: string
  precision: number
}

export type TimeInputValue = string | WikibaseTimeObject

type TimeFunction<T> = (wikibaseTime: TimeInputValue) => T

// Try to parse the date or return the input
function bestEffort<T> (fn: TimeFunction<T>) {
  return (value: TimeInputValue) => {
    try {
      return fn(value)
    } catch {
      value = typeof value === 'string' ? value : value.time

      const sign = value[0]
      let [ yearMonthDay, withinDay ] = value.slice(1).split('T')
      if (!sign || !yearMonthDay || !withinDay) {
        throw new Error('TimeInput is invalid: ' + JSON.stringify(value))
      }

      yearMonthDay = yearMonthDay.replace(/-00/g, '-01')

      return `${sign}${yearMonthDay}T${withinDay}`
    }
  }
}

const toEpochTime = (wikibaseTime: TimeInputValue) => toDateObject(wikibaseTime).getTime()
const toISOString = (wikibaseTime: TimeInputValue) => toDateObject(wikibaseTime).toISOString()

// A date format that knows just three precisions:
// 'yyyy', 'yyyy-mm', and 'yyyy-mm-dd' (including negative and non-4 digit years)
// Should be able to handle the old and the new Wikidata time:
// - in the old one, units below the precision where set to 00
// - in the new one, those months and days are set to 01 in those cases,
//   so when we can access the full claim object, we check the precision
//   to recover the old format
const toSimpleDay = (wikibaseTime: TimeInputValue): string => {
  // Also accept claim datavalue.value objects, and actually prefer those,
  // as we can check the precision
  if (typeof wikibaseTime === 'object') {
    const { time, precision } = wikibaseTime
    // Year precision
    if (precision === 9) wikibaseTime = time.replace('-01-01T', '-00-00T')
    // Month precision
    else if (precision === 10) wikibaseTime = time.replace('-01T', '-00T')
    else wikibaseTime = time
  }

  return wikibaseTime.split('T')[0]
    // Remove positive years sign
    .replace(/^\+/, '')
    // Remove years padding zeros
    .replace(/^(-?)0+/, '$1')
    // Remove days if not included in the Wikidata date precision
    .replace(/-00$/, '')
    // Remove months if not included in the Wikidata date precision
    .replace(/-00$/, '')
}

export const wikibaseTimeToEpochTime = bestEffort(toEpochTime)

export const wikibaseTimeToISOString = bestEffort(toISOString)

export const wikibaseTimeToSimpleDay = bestEffort(toSimpleDay)

export const wikibaseTimeToDateObject = toDateObject

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
