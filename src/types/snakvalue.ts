import type { EntityType } from './entity.js'
import type { WmLanguageCode } from './options.js'

export type SnakValue =
  | SnakEntityValue
  | SnakGlobeCoordinateValue
  | SnakMonolingualTextValue
  | SnakQuantityValue
  | SnakStringValue
  | SnakTimeValue

export interface SnakEntityValue {
  readonly type: 'wikibase-entityid'
  value: {
    'numeric-id': number
    'entity-type': EntityType
  } | {
    id: string
    'numeric-id'?: number
    'entity-type': EntityType
  }
}

export interface SnakGlobeCoordinateValue {
  readonly type: 'globecoordinate'
  value: {
    latitude: number
    longitude: number
    altitude?: number
    precision: number
    globe: string
  }
}

export interface SnakMonolingualTextValue {
  readonly type: 'monolingualtext'
  value: {
    language: WmLanguageCode
    text: string
  }
}

export interface SnakQuantityValue {
  readonly type: 'quantity'
  value: {
    amount: string
    unit: string
    upperBound?: string
    lowerBound?: string
  }
}

export interface SnakStringValue {
  readonly type: 'string'
  value: string
}

export interface SnakTimeValue {
  readonly type: 'time'
  value: {
    after: number
    before: number
    calendarmodel: string
    precision: number
    time: string
    timezone: number
  }
}
