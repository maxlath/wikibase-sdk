import { typedKeys } from '../utils/utils.js'
import { wikibaseTimeToEpochTime, wikibaseTimeToISOString, wikibaseTimeToSimpleDay } from './time.js'
import type { TimeInputValue } from './time.js'
import type { CustomSimplifiedSnakValueByDatavalueType, SimplifySnakOptions } from '../types/simplify_claims.js'
import type { CommonsMediaSnakDataValue, ExternalIdSnakDataValue, GeoShapeSnakDataValue, GlobeCoordinateSnakDataValue, MathSnakDataValue, MonolingualTextSnakDataValue, QuantitySnakDataValue, StringSnakDataValue, TimeSnakDataValue, WikibaseEntityIdSnakDataValue, MusicalNotationSnakDataValue, TabularDataSnakDataValue, UrlSnakDataValue, WikibaseFormSnakDataValue, WikibaseItemSnakDataValue, WikibaseLexemeSnakDataValue, WikibasePropertySnakDataValue, WikibaseSenseSnakDataValue, EntitySchemaSnakDataValue, MediaInfoSnakDataValue, SnakDataValueByDatavalueType, EdtfSnakDataValue, LocalMediaSnakDataValue } from '../types/snakvalue.js'

function parseStringValue (datavalue: StringSnakDataValue) {
  return datavalue.value
}

function parseMonolingualTextValue (datavalue: MonolingualTextSnakDataValue, options: { keepRichValues: false }): string
function parseMonolingualTextValue (datavalue: MonolingualTextSnakDataValue, options: { keepRichValues: true }): MonolingualTextSnakDataValue['value']
function parseMonolingualTextValue (datavalue: MonolingualTextSnakDataValue, options: SimplifySnakOptions): string | MonolingualTextSnakDataValue['value'] {
  return options.keepRichValues ? datavalue.value : datavalue.value.text
}

function parseEntityValue (datavalue: WikibaseEntityIdSnakDataValue, options: SimplifySnakOptions) {
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

function parseQuantityValue (datavalue: QuantitySnakDataValue, options: { keepRichValues: false }): number
function parseQuantityValue (datavalue: QuantitySnakDataValue, options: { keepRichValues: true }): ParsedQuantitySnakValue
function parseQuantityValue (datavalue: QuantitySnakDataValue, options: { keepRichValues: boolean }): number | ParsedQuantitySnakValue {
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
function parseGlobeCoordinateValue (datavalue: GlobeCoordinateSnakDataValue, options: { keepRichValues: false }): LatLng
function parseGlobeCoordinateValue (datavalue: GlobeCoordinateSnakDataValue, options: { keepRichValues: true }): GlobeCoordinateSnakDataValue['value']
function parseGlobeCoordinateValue (datavalue: GlobeCoordinateSnakDataValue, options: SimplifySnakOptions): LatLng | GlobeCoordinateSnakDataValue['value'] {
  if (options.keepRichValues) {
    return datavalue.value
  } else {
    return [ datavalue.value.latitude, datavalue.value.longitude ]
  }
}

type TimeStringSnakValue = TimeSnakDataValue['value']
type TimeNumberSnakValue = Pick<TimeStringSnakValue, 'timezone' | 'before' | 'after' | 'precision' | 'calendarmodel'> & { time: number }

function parseTimeValue (datavalue: TimeSnakDataValue, options: { keepRichValues: false, timeConverter: 'iso' | 'simple-day' | 'none' }): string
function parseTimeValue (datavalue: TimeSnakDataValue, options: { keepRichValues: false, timeConverter: 'epoch' }): number
function parseTimeValue (datavalue: TimeSnakDataValue, options: { keepRichValues: true, timeConverter: 'iso' | 'simple-day' | 'none' }): TimeStringSnakValue
function parseTimeValue (datavalue: TimeSnakDataValue, options: { keepRichValues: true, timeConverter: 'epoch' }): TimeNumberSnakValue
function parseTimeValue (datavalue: TimeSnakDataValue, options: SimplifySnakOptions): string | number | TimeStringSnakValue | TimeNumberSnakValue {
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

interface DataValueBySnakDatatype {
  commonsMedia: CommonsMediaSnakDataValue
  edtf: EdtfSnakDataValue
  'entity-schema': EntitySchemaSnakDataValue
  'external-id': ExternalIdSnakDataValue
  'geo-shape': GeoShapeSnakDataValue
  'globe-coordinate': GlobeCoordinateSnakDataValue
  localMedia: LocalMediaSnakDataValue
  math: MathSnakDataValue
  mediainfo: MediaInfoSnakDataValue
  monolingualtext: MonolingualTextSnakDataValue
  'musical-notation': MusicalNotationSnakDataValue
  quantity: QuantitySnakDataValue
  string: StringSnakDataValue
  'tabular-data': TabularDataSnakDataValue
  time: TimeSnakDataValue
  url: UrlSnakDataValue
  'wikibase-form': WikibaseFormSnakDataValue
  'wikibase-item': WikibaseItemSnakDataValue
  'wikibase-lexeme': WikibaseLexemeSnakDataValue
  'wikibase-property': WikibasePropertySnakDataValue
  'wikibase-sense': WikibaseSenseSnakDataValue
}

export type SnakDatatype = keyof DataValueBySnakDatatype

export const parsersByDatavalueTypes = {
  globecoordinate: parseGlobeCoordinateValue,
  monolingualtext: parseMonolingualTextValue,
  quantity: parseQuantityValue,
  string: parseStringValue,
  time: parseTimeValue,
  'wikibase-entityid': parseEntityValue,
} as const

export type DatavalueType = keyof typeof parsersByDatavalueTypes

export const datavalueTypeBySnakDatatype = {
  commonsMedia: 'string',
  edtf: 'string', // See https://github.com/ProfessionalWiki/WikibaseEdtf
  'external-id': 'string',
  'entity-schema': 'wikibase-entityid',
  'geo-shape': 'string',
  'globe-coordinate': 'globecoordinate',
  localMedia: 'string', // See https://github.com/ProfessionalWiki/WikibaseLocalMedia
  math: 'string',
  mediainfo: 'wikibase-entityid',
  monolingualtext: 'monolingualtext',
  'musical-notation': 'string',
  quantity: 'quantity',
  string: 'string',
  'tabular-data': 'string',
  time: 'time',
  url: 'string',
  'wikibase-form': 'wikibase-entityid',
  'wikibase-item': 'wikibase-entityid',
  'wikibase-lexeme': 'wikibase-entityid',
  'wikibase-property': 'wikibase-entityid',
  'wikibase-sense': 'wikibase-entityid',
} as const satisfies Record<keyof DataValueBySnakDatatype, string>

export function parseSnakDatavalue <T extends DatavalueType> (datavalue: SnakDataValueByDatavalueType[T], options: SimplifySnakOptions) {
  const parser = parsersByDatavalueTypes[datavalue.type]
  if (!parser) {
    throw new Error(`${datavalue.type} datavalue parser isn't implemented. Please report to https://github.com/maxlath/wikibase-sdk/issues`)
  }
  // @ts-expect-error
  return parser(datavalue, options) as CustomSimplifiedSnakValueByDatavalueType[T]
}

export const datatypes = typedKeys(datavalueTypeBySnakDatatype)
