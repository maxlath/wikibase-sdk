const { wikibaseTimeToISOString, wikibaseTimeToEpochTime, wikibaseTimeToSimpleDay } = require('./helpers')

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

const prefixedId = (datavalue, prefix) => {
  const { value } = datavalue
  const id = value.id || entityLetter[value['entity-type']] + value['numeric-id']
  return typeof prefix === 'string' ? `${prefix}:${id}` : id
}

const quantity = (datavalue, options) => {
  const { value } = datavalue
  const amount = parseFloat(value.amount)
  if (options.keepRichValues) {
    const amount = parseFloat(value.amount)
    // ex: http://www.wikidata.org/entity/
    const unit = value.unit.replace(/^https?:\/\/.*\/entity\//, '')
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
  if (typeof options.timeConverter === 'function') {
    return options.timeConverter(datavalue.value)
  } else {
    return getTimeConverter(options.timeConverter)(datavalue.value)
  }
}

const getTimeConverter = (key = 'iso') => {
  const converter = timeConverters[key]
  if (!converter) throw new Error(`invalid converter key: ${JSON.stringify(key).substring(0, 100)}`)
  return converter
}

// Each time converter should be able to accept 2 keys of arguments:
// - either datavalue.value objects (prefered as it gives access to the precision)
// - or the time string (datavalue.value.time)
const timeConverters = {
  iso: wikibaseTimeToISOString,
  epoch: wikibaseTimeToEpochTime,
  'simple-day': wikibaseTimeToSimpleDay,
  none: wikibaseTime => wikibaseTime.time || wikibaseTime
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
  'tabular-data': simple,
  'musical-notation': simple
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
        Please report to https://github.com/maxlath/wikibase-sdk/issues`
      }
      throw err
    }
  }
}
