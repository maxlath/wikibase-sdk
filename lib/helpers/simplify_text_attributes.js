const simplifyTextAttributes = multivalue => data => {
  return Object.keys(data).reduce(aggregateValues(data, multivalue), {})
}

const aggregateValues = (data, multivalue) => (index, lang) => {
  const obj = data[lang]
  index[lang] = multivalue ? obj.map(getValue) : obj.value
  return index
}

const getValue = obj => obj.value

const singleValue = simplifyTextAttributes(false)

module.exports = {
  labels: singleValue,
  descriptions: singleValue,
  aliases: simplifyTextAttributes(true)
}
