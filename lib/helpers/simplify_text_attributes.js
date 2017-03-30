const simplifyTextAttributes = (multivalue, attribute) => data => {
  const simplifiedData = {}
  Object.keys(data).forEach(lang => {
    let obj = data[lang]
    simplifiedData[lang] = multivalue ? obj.map(getValue) : obj[attribute]
  })
  return simplifiedData
}

const getValue = (obj) => obj.value

const labelsOrDescription = simplifyTextAttributes(false, 'value')

module.exports = {
  labels: labelsOrDescription,
  descriptions: labelsOrDescription,
  aliases: simplifyTextAttributes(true, 'value'),
  sitelinks: simplifyTextAttributes(false, 'title')
}
