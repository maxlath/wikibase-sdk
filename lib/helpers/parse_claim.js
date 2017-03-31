const { wikidataTimeToISOString, wikidataTimeToEpochTime } = require('./helpers')

const simple = (datavalue) => datavalue.value
const monolingualtext = (datavalue) => datavalue.value.text
const item = (datavalue, options) => prefixedId(datavalue, options.entityPrefix)
const property = (datavalue, options) => {
  return prefixedId(datavalue, options.propertyPrefix)
}
const prefixedId = function (datavalue, prefix) {
  const { id } = datavalue.value
  return typeof prefix === 'string' ? `${prefix}:${id}` : id
}
const quantity = (datavalue) => parseFloat(datavalue.value.amount)
const coordinate = (datavalue) => {
  return [ datavalue.value.latitude, datavalue.value.longitude ]
}
const time = (datavalue, options) => {
  return getTimeConverter(options.timeConverter)(datavalue.value.time)
}
const getTimeConverter = (key = 'iso') => timeConverters[key]
const identity = (arg) => arg

const timeConverters = {
  iso: wikidataTimeToISOString,
  epoch: wikidataTimeToEpochTime,
  none: identity
}

const claimParsers = {
  string: simple,
  commonsMedia: simple,
  url: simple,
  'external-id': simple,
  math: simple,
  monolingualtext,
  'wikibase-item': item,
  'wikibase-property': property,
  time,
  quantity,
  'globe-coordinate': coordinate
}

module.exports = (datatype, datavalue, options) => {
  return claimParsers[datatype](datavalue, options)
}
