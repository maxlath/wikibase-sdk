import { wikibaseTimeToDateObject as toDateObject } from './wikibase_time_to_date_object.js'
import type { Url } from '../types/options.js'

export const isNumericId = (id: string): boolean => /^[1-9][0-9]*$/.test(id)

export const isEntityId = (id: string): boolean => /^((Q|P|L|M)[1-9][0-9]*|L[1-9][0-9]*-(F|S)[1-9][0-9]*)$/.test(id)

export const isEntitySchemaId = (id: string): boolean => /^E[1-9][0-9]*$/.test(id)

export const isItemId = (id: string): boolean => /^Q[1-9][0-9]*$/.test(id)

export const isPropertyId = (id: string): boolean => /^P[1-9][0-9]*$/.test(id)

export const isLexemeId = (id: string): boolean => /^L[1-9][0-9]*$/.test(id)

export const isFormId = (id: string): boolean => /^L[1-9][0-9]*-F[1-9][0-9]*$/.test(id)

export const isSenseId = (id: string): boolean => /^L[1-9][0-9]*-S[1-9][0-9]*$/.test(id)

export const isGuid = (guid: string): boolean => /^((Q|P|L)[1-9][0-9]*|L[1-9][0-9]*-(F|S)[1-9][0-9]*)\$[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(guid)

export const isHash = (hash: string): boolean => /^[0-9a-f]{40}$/.test(hash)

export function isPropertyClaimsId (id: string): boolean {
  const [ entityId, propertyId ] = id.split('#')
  return isEntityId(entityId) && isPropertyId(propertyId)
}

export const isRevisionId = (id: string): boolean => /^\d+$/.test(id)

export function isEntityPageTitle (title: string): boolean {
  if (typeof title !== 'string') return false
  let [ namespace, id ] = title.split(':')
  if (namespace && id) {
    return isEntityNamespace(namespace) && idTestByNamespace[namespace](id)
  } else {
    id = namespace
    return isItemId(id)
  }
}

const entityNamespaces = [ 'Item', 'Property', 'Lexeme' ]

const isEntityNamespace = str => entityNamespaces.includes(str)

const idTestByNamespace = {
  Item: isItemId,
  Lexeme: isLexemeId,
  Property: isPropertyId,
}

const isNonNestedEntityId = (id: string): boolean => /^(Q|P|L)[1-9][0-9]*$/.test(id)

export function getNumericId (id: string): string {
  if (!isNonNestedEntityId(id)) throw new Error(`invalid entity id: ${id}`)
  return id.replace(/^(Q|P|L)/, '')
}

export interface WikibaseTimeObject {
  time: string
  precision: number
}

export type TimeInputValue = string | WikibaseTimeObject

export type TimeFunction = (wikibaseTime: TimeInputValue) => any

// Try to parse the date or return the input
const bestEffort = (fn: TimeFunction) => (value: TimeInputValue) => {
  try {
    return fn(value)
  } catch (err) {
    // @ts-ignore
    value = value.time || value

    const sign = value[0]
    // @ts-ignore
    let [ yearMonthDay, withinDay ] = value.slice(1).split('T')
    yearMonthDay = yearMonthDay.replace(/-00/g, '-01')

    return `${sign}${yearMonthDay}T${withinDay}`
  }
}

const toEpochTime = (wikibaseTime: TimeInputValue): number => toDateObject(wikibaseTime).getTime()
const toISOString = (wikibaseTime: TimeInputValue): string => toDateObject(wikibaseTime).toISOString()

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
    const wikibaseTimeObject = wikibaseTime as WikibaseTimeObject
    const { time, precision } = wikibaseTimeObject
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

export function getEntityIdFromGuid (guid: string): string {
  const parts = guid.split(/[$-]/)
  if (parts.length === 6) {
    // Examples:
    // - q520$BCA8D9DE-B467-473B-943C-6FD0C5B3D02C
    // - P6216-a7fd6230-496e-6b47-ca4a-dcec5dbd7f95
    return parts[0].toUpperCase()
  } else if (parts.length === 7) {
    // Examples:
    // - L525-S1$66D20252-8CEC-4DB1-8B00-D713CFF42E48
    // - L525-F2-52c9b382-02f5-4413-9923-26ade74f5a0d
    return parts.slice(0, 2).join('-').toUpperCase()
  } else {
    throw new Error(`invalid guid: ${guid}`)
  }
}
