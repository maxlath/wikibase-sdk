import { wikibaseTimeToEpochTime, wikibaseTimeToISOString, wikibaseTimeToSimpleDay } from './time.js'
import type { TimeInputValue } from './time.js'
import type { SimplifySnakOptions } from '../types/simplify_claims.js'
import type { CommonsMediaSnakDataValue, ExternalIdSnakDataValue, GeoShapeSnakDataValue, GlobeCoordinateSnakDataValue, MathSnakDataValue, MonolingualTextSnakDataValue, QuantitySnakDataValue, StringSnakDataValue, TimeSnakDataValue, WikibaseEntityIdSnakDataValue, MusicalNotationSnakDataValue, TabularDataSnakDataValue, UrlSnakDataValue, WikibaseFormSnakDataValue, WikibaseItemSnakDataValue, WikibaseLexemeSnakDataValue, WikibasePropertySnakDataValue, WikibaseSenseSnakDataValue, EntitySchemaSnakDataValue, LocalMediaSnakDataValue, MediaInfoSnakDataValue } from '../types/snakvalue.js'

function stringValue (datavalue: StringSnakDataValue) {
  return datavalue.value
}

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
  'entity-schema': 'E',
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
function quantity (datavalue: QuantitySnakDataValue, options: { keepRichValues: boolean }): number | ParsedQuantitySnakValue {
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

type DataValueByDataType = {
  'commonsMedia': CommonsMediaSnakDataValue
  'external-id': ExternalIdSnakDataValue
  'entity-schema': EntitySchemaSnakDataValue
  'geo-shape': GeoShapeSnakDataValue
  'globe-coordinate': GlobeCoordinateSnakDataValue
  'localMedia': LocalMediaSnakDataValue
  'mediainfo': MediaInfoSnakDataValue
  'math': MathSnakDataValue
  monolingualtext: MonolingualTextSnakDataValue
  'musical-notation': MusicalNotationSnakDataValue
  quantity: QuantitySnakDataValue
  'string': StringSnakDataValue
  'tabular-data': TabularDataSnakDataValue
  'time': TimeSnakDataValue
  'url': UrlSnakDataValue
  'wikibase-form': WikibaseFormSnakDataValue
  'wikibase-item': WikibaseItemSnakDataValue
  'wikibase-lexeme': WikibaseLexemeSnakDataValue
  'wikibase-property': WikibasePropertySnakDataValue
  'wikibase-sense': WikibaseSenseSnakDataValue
}

export const parsers = {
  commonsMedia: stringValue,
  'external-id': stringValue,
  'entity-schema': entity,
  'geo-shape': stringValue,
  'globe-coordinate': coordinate,
  localMedia: stringValue,
  math: stringValue,
  'mediainfo': entity,
  monolingualtext,
  'musical-notation': stringValue,
  quantity,
  string: stringValue,
  'tabular-data': stringValue,
  time,
  url: stringValue,
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

export function parseSnak <T extends keyof DataValueByDataType> (datatype: T, datavalue: DataValueByDataType[T], options: SimplifySnakOptions): ReturnType<typeof parsers[T]> {
  let parser
  if (datatype) {
    // @ts-expect-error legacyParsers datatypes aren't in DataValueByDataType
    parser = parsers[datatype] || legacyParsers[datatype]
  } else {
    parser = parsers[datavalue.type]
  }
  if (!parser) {
    throw new Error(`${datatype} claim parser isn't implemented. Please report to https://github.com/maxlath/wikibase-sdk/issues`)
  }
  return parser(datavalue, options)
}
