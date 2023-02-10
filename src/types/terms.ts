import type { WmLanguageCode } from './options.js'

type WmLanguageRecord<V> = Partial<Readonly<Record<WmLanguageCode, V>>>

export type Term = {
  readonly language: WmLanguageCode
  readonly value: string
}

export type Labels = WmLanguageRecord<Term>
export type Descriptions = WmLanguageRecord<Term>
export type Aliases = WmLanguageRecord<readonly Term[]>
export type Lemmas = WmLanguageRecord<Term>
export type Representations = WmLanguageRecord<Term>
export type Glosses = WmLanguageRecord<Term>

export type SimplifiedTerm = string

export type SimplifiedLabels = WmLanguageRecord<SimplifiedTerm>
export type SimplifiedDescriptions = WmLanguageRecord<SimplifiedTerm>
export type SimplifiedAliases = WmLanguageRecord<readonly SimplifiedTerm[]>
export type SimplifiedLemmas = WmLanguageRecord<SimplifiedTerm>
export type SimplifiedRepresentations = WmLanguageRecord<SimplifiedTerm>
export type SimplifiedGlosses = WmLanguageRecord<SimplifiedTerm>
