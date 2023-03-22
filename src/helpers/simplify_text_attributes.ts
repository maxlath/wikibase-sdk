import { typedEntries } from '../utils/utils.js'
import type { Aliases, Descriptions, Glosses, Labels, Lemmas, Representations, SimplifiedAliases, SimplifiedDescriptions, SimplifiedGlosses, SimplifiedLabels, SimplifiedLemmas, SimplifiedRepresentations } from '../types/terms.js'

type InValue<T> = { readonly value: T }

function singleValue<K extends string, V> (data: Partial<Readonly<Record<K, InValue<V>>>>) {
  const simplified: Partial<Record<K, V>> = {}
  for (const [ lang, obj ] of typedEntries(data)) {
    simplified[lang] = obj != null ? obj.value : null
  }
  return simplified
}

function multiValue<K extends string, V> (data: Partial<Readonly<Record<K, ReadonlyArray<InValue<V>>>>>) {
  const simplified: Partial<Record<K, readonly V[]>> = {}
  for (const [ lang, obj ] of typedEntries(data)) {
    simplified[lang] = obj != null ? obj.map(o => o.value) : []
  }
  return simplified
}

export function simplifyLabels (labels: Labels): SimplifiedLabels {
  return singleValue(labels)
}

export function simplifyDescriptions (descriptions: Descriptions): SimplifiedDescriptions {
  return singleValue(descriptions)
}

export function simplifyAliases (aliases: Aliases): SimplifiedAliases {
  return multiValue(aliases)
}

export function simplifyLemmas (lemmas: Lemmas): SimplifiedLemmas {
  return singleValue(lemmas)
}

export function simplifyRepresentations (representations: Representations): SimplifiedRepresentations {
  return singleValue(representations)
}

export function simplifyGlosses (glosses: Glosses): SimplifiedGlosses {
  return singleValue(glosses)
}
