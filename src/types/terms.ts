import type { TypedKeyDictionnary } from './helper.js'
import type { WmLanguageCode } from './options.js'

export interface Term {
  language: WmLanguageCode;
  value: string;
}

export type SingleTermDictonary = TypedKeyDictionnary<WmLanguageCode, Term>;
export type MultiTermsDictonary = TypedKeyDictionnary<WmLanguageCode, Term[]>;

export type Labels = SingleTermDictonary
export type Descriptions = SingleTermDictonary
export type Aliases = MultiTermsDictonary
export type Lemmas = SingleTermDictonary
export type Representations = SingleTermDictonary
export type Glosses = SingleTermDictonary

export type SimplifiedTerm = string

export type SimplifiedSingleTermDictonary = TypedKeyDictionnary<WmLanguageCode, SimplifiedTerm>;
export type SimplifiedMultiTermsDictonary = TypedKeyDictionnary<WmLanguageCode, SimplifiedTerm[]>;

export type SimplifiedLabels = SimplifiedSingleTermDictonary
export type SimplifiedDescriptions = SimplifiedSingleTermDictonary
export type SimplifiedAliases = SimplifiedMultiTermsDictonary
export type SimplifiedLemmas = SimplifiedSingleTermDictonary
export type SimplifiedRepresentations = SimplifiedSingleTermDictonary
export type SimplifiedGlosses = SimplifiedSingleTermDictonary
