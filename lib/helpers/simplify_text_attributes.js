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

export const simplifyLabels = singleValue
export const simplifyDescriptions = singleValue
export const simplifyAliases = simplifyTextAttributes(true)
export const simplifyLemmas = singleValue
export const simplifyRepresentations = singleValue
export const simplifyGlosses = singleValue
