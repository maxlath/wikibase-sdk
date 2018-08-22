const { wikidataTimeToISOString, wikidataTimeToEpochTime, wikidataTimeToSimpleDay } = require('./helpers')

const simple = datavalue => datavalue.value

const monolingualtext = (datavalue, options) => {
  return options.keepRichValues ? datavalue.value : datavalue.value.text
}

const entity = (datavalue, options) => prefixedId(datavalue, options.entityPrefix)

const entityLetter = {
  item: 'Q',
  lexeme: 'L',
  property: 'P'
}

const prefixedId = function (datavalue, prefix) {
  const { value } = datavalue
  const id = value.id || entityLetter[value['entity-type']] + value['numeric-id']
  return typeof prefix === 'string' ? `${prefix}:${id}` : id
}

const quantity = (datavalue, options) => {
  const { value } = datavalue
  const amount = parseFloat(value.amount)
  if (options.keepRichValues) {
    const amount = parseFloat(value.amount)
    const unit = value.unit.replace('http://www.wikidata.org/entity/', '')
    const upperBound = parseFloat(value.upperBound)
    const lowerBound = parseFloat(value.lowerBound)
    return { amount, unit, upperBound, lowerBound }
  } else {
    return amount
  }
}

const coordinate = datavalue => {
  return [ datavalue.value.latitude, datavalue.value.longitude ]
}

const time = (datavalue, options) => {
  return getTimeConverter(options.timeConverter)(datavalue.value)
}

const getTimeConverter = (key = 'iso') => timeConverters[key]

// Each time converter should be able to accept 2 keys of arguments:
// - either datavalue.value objects (prefered as it gives access to the precision)
// - or the time string (datavalue.value.time)
const timeConverters = {
  iso: wikidataTimeToISOString,
  epoch: wikidataTimeToEpochTime,
  'simple-day': wikidataTimeToSimpleDay,
  none: wikidataTime => wikidataTime.time || wikidataTime
}

const parsers = {
  string: simple,
  commonsMedia: simple,
  url: simple,
  'external-id': simple,
  math: simple,
  monolingualtext,
  'wikibase-item': entity,
  'wikibase-lexeme': entity,
  'wikibase-property': entity,
  time,
  quantity,
  'globe-coordinate': coordinate,
  'geo-shape': simple,
  'tabular-data': simple
}

module.exports = {
  parsers,
  parse: (datatype, datavalue, options, claimId) => {
    if (!datatype) {
      // Ex: https://www.wikidata.org/w/index.php?title=Q2105758&oldid=630350590
      console.error('invalid claim', claimId)
      return null
    }

    try {
      return parsers[datatype](datavalue, options)
    } catch (err) {
      if (err.message === 'parsers[datatype] is not a function') {
        err.message = `${datatype} claim parser isn't implemented
        Claim id: ${claimId}
        Please report to https://github.com/maxlath/wikidata-sdk/issues`
      }
      throw err
    }
  }
}
