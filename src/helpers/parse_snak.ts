import { wikibaseTimeToEpochTime, wikibaseTimeToISOString, wikibaseTimeToSimpleDay } from './time.js'
import type { TimeInputValue } from './time.js'
import type { DataType } from '../types/claim.js'
import type { SimplifySnakOptions } from '../types/simplify_claims.js'
import type { GlobeCoordinateSnakDataValue, MonolingualTextSnakDataValue, QuantitySnakDataValue, SnakDataValue, StringSnakDataValue, TimeSnakDataValue, WikibaseEntityIdSnakDataValue } from '../types/snakvalue.js'

const stringValue = (datavalue: StringSnakDataValue) => datavalue.value

function monolingualtext (datavalue: MonolingualTextSnakDataValue, options: { keepRichValues: false }): string
function monolingualtext (datavalue: MonolingualTextSnakDataValue, options: { keepRichValues: true }): MonolingualTextSnakDataValue['value']
function monolingualtext (datavalue: MonolingualTextSnakDataValue, options: SimplifySnakOptions): string | MonolingualTextSnakDataValue['value'] {
  return options.keepRichValues ? datavalue.value : datavalue.value.text
}

function entity (datavalue: WikibaseEntityIdSnakDataValue, options: SimplifySnakOptions) {
  const { entityPrefix: prefix } = options
  const { value } = datavalue
  let id: string
  if (value.id) {
    id = value.id
  } else {
    // Legacy
    const letter = entityLetter[value['entity-type']]
    id = `${letter}${value['numeric-id']}`
  }
  return typeof prefix === 'string' ? `${prefix}:${id}` : id
}

const entityLetter = {
  item: 'Q',
  lexeme: 'L',
  property: 'P',
  form: 'F',
  sense: 'S',
} as const

interface ParsedQuantitySnakValue {
  amount: number
  unit: string
  upperBound?: number
  lowerBound?: number
}

function quantity (datavalue: QuantitySnakDataValue, options: { keepRichValues: false }): number
function quantity (datavalue: QuantitySnakDataValue, options: { keepRichValues: true }): ParsedQuantitySnakValue
function quantity (datavalue: QuantitySnakDataValue, options: SimplifySnakOptions): number | ParsedQuantitySnakValue {
  const { value } = datavalue
  const amount = parseFloat(value.amount)
  if (options.keepRichValues) {
    const richValue: ParsedQuantitySnakValue = {
      amount: parseFloat(value.amount),
      // ex: http://www.wikidata.org/entity/
      unit: value.unit.replace(/^https?:\/\/.*\/entity\//, ''),
    }
    if (value.upperBound != null) richValue.upperBound = parseFloat(value.upperBound)
    if (value.lowerBound != null) richValue.lowerBound = parseFloat(value.lowerBound)
    return richValue
  } else {
    return amount
  }
}

type LatLng = [ number, number ]
function coordinate (datavalue: GlobeCoordinateSnakDataValue, options: { keepRichValues: false }): LatLng
function coordinate (datavalue: GlobeCoordinateSnakDataValue, options: { keepRichValues: true }): GlobeCoordinateSnakDataValue['value']
function coordinate (datavalue: GlobeCoordinateSnakDataValue, options: SimplifySnakOptions): LatLng | GlobeCoordinateSnakDataValue['value'] {
  if (options.keepRichValues) {
    return datavalue.value
  } else {
    return [ datavalue.value.latitude, datavalue.value.longitude ]
  }
}

type TimeStringSnakValue = TimeSnakDataValue['value']
type TimeNumberSnakValue = Pick<TimeStringSnakValue, 'timezone' | 'before' | 'after' | 'precision' | 'calendarmodel'> & { time: number }

function time (datavalue: TimeSnakDataValue, options: { keepRichValues: false, timeConverter: 'iso' | 'simple-day' | 'none' }): string
function time (datavalue: TimeSnakDataValue, options: { keepRichValues: false, timeConverter: 'epoch' }): number
function time (datavalue: TimeSnakDataValue, options: { keepRichValues: true, timeConverter: 'iso' | 'simple-day' | 'none' }): TimeStringSnakValue
function time (datavalue: TimeSnakDataValue, options: { keepRichValues: true, timeConverter: 'epoch' }): TimeNumberSnakValue
function time (datavalue: TimeSnakDataValue, options: SimplifySnakOptions): string | number | TimeStringSnakValue | TimeNumberSnakValue {
  let timeValue
  if (typeof options.timeConverter === 'function') {
    timeValue = options.timeConverter(datavalue.value)
  } else {
    timeValue = getTimeConverter(options.timeConverter)(datavalue.value)
  }
  if (options.keepRichValues) {
    const { timezone, before, after, precision, calendarmodel } = datavalue.value
    return { time: timeValue, timezone, before, after, precision, calendarmodel }
  } else {
    return timeValue
  }
}

// Each time converter should be able to accept 2 keys of arguments:
// - either datavalue.value objects (prefered as it gives access to the precision)
// - or the time string (datavalue.value.time)
export const timeConverters = {
  iso: wikibaseTimeToISOString,
  epoch: wikibaseTimeToEpochTime,
  'simple-day': wikibaseTimeToSimpleDay,
  none: (wikibaseTime: TimeInputValue) => typeof wikibaseTime === 'string' ? wikibaseTime : wikibaseTime.time,
} as const

function getTimeConverter (key: keyof typeof timeConverters = 'iso') {
  const converter = timeConverters[key]
  if (!converter) throw new Error(`invalid converter key: ${JSON.stringify(key).substring(0, 100)}`)
  return converter
}

export const parsers = {
  commonsMedia: stringValue,
  'external-id': stringValue,
  'geo-shape': stringValue,
  'globe-coordinate': coordinate,
  math: stringValue,
  monolingualtext,
  'musical-notation': stringValue,
  quantity,
  string: stringValue,
  'tabular-data': stringValue,
  time,
  url: stringValue,
  'wikibase-entityid': entity,
  'wikibase-form': entity,
  'wikibase-item': entity,
  'wikibase-lexeme': entity,
  'wikibase-property': entity,
  'wikibase-sense': entity,
} as const

const legacyParsers = {
  'musical notation': parsers['musical-notation'],
  // Known case: mediainfo won't have datatype="globe-coordinate", but datavalue.type="globecoordinate"
  globecoordinate: parsers['globe-coordinate'],
} as const

export function parseSnak (datatype: DataType | undefined, datavalue: SnakDataValue, options: SimplifySnakOptions) {
  // @ts-expect-error Known case of missing datatype: form.claims, sense.claims, mediainfo.statements
  datatype = datatype || datavalue.type
  const parser = parsers[datatype] || legacyParsers[datatype]
  if (!parser) {
    throw new Error(`${datatype} claim parser isn't implemented. Please report to https://github.com/maxlath/wikibase-sdk/issues`)
  }
  return parser(datavalue, options)
}
