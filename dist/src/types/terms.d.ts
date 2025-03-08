import type { LanguageCode } from './options.js';
type LanguageRecord<V> = Partial<Readonly<Record<LanguageCode, V>>>;
export type Term = {
    readonly language: LanguageCode;
    readonly value: string;
};
export type Labels = LanguageRecord<Term>;
export type Descriptions = LanguageRecord<Term>;
export type Aliases = LanguageRecord<readonly Term[]>;
export type Lemmas = LanguageRecord<Term>;
export type Representations = LanguageRecord<Term>;
export type Glosses = LanguageRecord<Term>;
export type SimplifiedTerm = string;
export type SimplifiedLabels = LanguageRecord<SimplifiedTerm>;
export type SimplifiedDescriptions = LanguageRecord<SimplifiedTerm>;
export type SimplifiedAliases = LanguageRecord<readonly SimplifiedTerm[]>;
export type SimplifiedLemmas = LanguageRecord<SimplifiedTerm>;
export type SimplifiedRepresentations = LanguageRecord<SimplifiedTerm>;
export type SimplifiedGlosses = LanguageRecord<SimplifiedTerm>;
export {};
//# sourceMappingURL=terms.d.ts.map