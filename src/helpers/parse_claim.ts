import { convertTime, type TimeConverter, type TimeConverterFn } from './wikibase_time.js'
import type { DataType } from '../types/claim.js'
import type { SnakEntityValue, SnakGlobeCoordinateValue, SnakMonolingualTextValue, SnakQuantityValue, SnakStringValue, SnakTimeValue, SnakValue } from '../types/snakvalue.js'

const simple = <T>(datavalue: { readonly value: T }): T => datavalue.value

const monolingualtext = (datavalue: SnakMonolingualTextValue, options: { readonly keepRichValues?: boolean } = {}) => {
  return options.keepRichValues ? datavalue.value : datavalue.value.text
}

interface SimplifyEntitySnakOptions {
  readonly entityPrefix?: string
}

const entity = (datavalue: SnakEntityValue, options: SimplifyEntitySnakOptions = {}) => prefixedId(datavalue, options.entityPrefix)

const entityLetter = {
  item: 'Q',
  lexeme: 'L',
  property: 'P',
} as const

const prefixedId = (datavalue: SnakEntityValue, prefix: string | undefined) => {
  const { value } = datavalue
  const id = 'id' in value ? value.id : (entityLetter[value['entity-type']] + value['numeric-id'])
  return typeof prefix === 'string' ? `${prefix}:${id}` : id
}

interface SimplifiedQuantity {
  amount: number
  unit: string
  upperBound?: number
  lowerBound?: number
}

const quantity = (datavalue: SnakQuantityValue, options: { readonly keepRichValues?: boolean } = {}) => {
  const { value } = datavalue
  const amount = parseFloat(value.amount)
  if (options.keepRichValues) {
    const richValue: SimplifiedQuantity = {
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

const coordinate = (datavalue: SnakGlobeCoordinateValue, options: { readonly keepRichValues?: boolean } = {}) => {
  if (options.keepRichValues) {
    return datavalue.value
  } else {
    return [ datavalue.value.latitude, datavalue.value.longitude ]
  }
}

interface SimplifyTimeSnakOptions {
  readonly keepRichValues?: boolean
  readonly timeConverter?: TimeConverterFn | TimeConverter
}
const time = (datavalue: SnakTimeValue, options: SimplifyTimeSnakOptions = {}) => {
  const timeValue = convertTime(options.timeConverter, datavalue.value)
  if (options.keepRichValues) {
    return { ...datavalue.value, time: timeValue }
  } else {
    return timeValue
  }
}

type SimplifySnakOptions = SimplifyTimeSnakOptions & SimplifyEntitySnakOptions

export function parseClaim (
  datatype: DataType | undefined,
  datavalue: SnakValue,
  options: SimplifySnakOptions,
  claimId: string,
) {
  // Known case of missing datatype: form.claims, sense.claims
  // datavalue.type is used then

  // @ts-expect-error known case requiring this: legacy "musical notation" datatype
  datatype = datatype?.replace(' ', '-')

  if (
    datatype === 'wikibase-form' ||
    datatype === 'wikibase-item' ||
    datatype === 'wikibase-lexeme' ||
    datatype === 'wikibase-property' ||
    datatype === 'wikibase-sense' ||
    datavalue.type === 'wikibase-entityid'
  ) {
    return entity(datavalue as SnakEntityValue, options)
  }

  if (datatype === 'globe-coordinate' || datavalue.type === 'globecoordinate') {
    return coordinate(datavalue as SnakGlobeCoordinateValue, options)
  }

  if (datatype === 'monolingualtext' || datavalue.type === 'monolingualtext') {
    return monolingualtext(datavalue as SnakMonolingualTextValue, options)
  }

  if (datatype === 'quantity' || datavalue.type === 'quantity') {
    return quantity(datavalue as SnakQuantityValue, options)
  }

  if (datatype === 'time' || datavalue.type === 'time') {
    return time(datavalue as SnakTimeValue, options)
  }

  if (
    datatype === 'commonsMedia' ||
    datatype === 'external-id' ||
    datatype === 'geo-shape' ||
    datatype === 'math' ||
    datatype === 'musical-notation' ||
    datatype === 'string' ||
    datatype === 'tabular-data' ||
    datatype === 'url' ||
    datavalue.type === 'string'
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return simple(datavalue as SnakStringValue)
  }

  unknownClaimType(datatype, datavalue, claimId)
}

// TypeScript notices when the argument isnt `never` and does not compile in that case -> some case is not implemented
function unknownClaimType (
  datatype: never,
  datavalue: { readonly type: never },
  claimId: string,
): never {
  const minimal = String(datatype) || String(datavalue)
  const full = JSON.stringify({ datatype, datavalue })
  throw new Error(`${minimal} claim parser isn't implemented\nPlease report to https://github.com/maxlath/wikibase-sdk/issues\n\nClaim id: ${claimId}\n${full}`)
}
