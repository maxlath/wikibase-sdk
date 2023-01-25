import type { Aliases, Descriptions, Glosses, Labels, Lemmas, Representations, SimplifiedAliases, SimplifiedDescriptions, SimplifiedGlosses, SimplifiedLabels, SimplifiedLemmas, SimplifiedRepresentations } from '../types/terms.js'

const simplifyTextAttributes = multivalue => data => {
  const simplified = {}
  Object.keys(data).forEach(lang => {
    const obj = data[lang]
    if (obj != null) {
      simplified[lang] = multivalue ? obj.map(getValue) : obj.value
    } else {
      simplified[lang] = multivalue ? [] : null
    }
  })
  return simplified
}

const getValue = obj => obj.value

const singleValue = simplifyTextAttributes(false)
const multiValue = simplifyTextAttributes(true)

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
