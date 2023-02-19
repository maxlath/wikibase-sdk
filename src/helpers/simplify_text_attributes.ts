import type { WmLanguageCode } from '../types/options.js'
import type { Aliases, Descriptions, Glosses, Labels, Lemmas, Representations, SimplifiedAliases, SimplifiedDescriptions, SimplifiedGlosses, SimplifiedLabels, SimplifiedLemmas, SimplifiedRepresentations } from '../types/terms.js'

type InValue<T> = { readonly value: T }

function singleValue<V> (data: Partial<Readonly<Record<WmLanguageCode, InValue<V>>>>) {
  const simplified: Partial<Record<WmLanguageCode, V>> = {}
  for (const [ lang, obj ] of Object.entries(data)) {
    simplified[lang] = obj != null ? obj.value : null
  }
  return simplified
}

function multiValue<V> (data: Partial<Readonly<Record<WmLanguageCode, ReadonlyArray<InValue<V>>>>>) {
  const simplified: Partial<Record<WmLanguageCode, readonly V[]>> = {}
  for (const [ lang, obj ] of Object.entries(data)) {
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
