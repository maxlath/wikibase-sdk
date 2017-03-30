const simplifyTextAttributes = (multivalue, attribute) => data => {
  const simplifiedData = {}
  Object.keys(data).forEach(lang => {
    let obj = data[lang]
    simplifiedData[lang] = multivalue ? obj.map(getValue) : obj[attribute]
  })
  return simplifiedData
}

const getValue = (obj) => obj.value

const simplifyLabelsOrDescription = simplifyTextAttributes(false, 'value')

module.exports = {
  simplifyLabels: simplifyLabelsOrDescription,
  simplifyDescriptions: simplifyLabelsOrDescription,
  simplifyAliases: simplifyTextAttributes(true, 'value'),
  simplifySitelinks: simplifyTextAttributes(false, 'title')
}
