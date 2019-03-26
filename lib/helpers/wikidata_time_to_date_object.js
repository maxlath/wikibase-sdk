module.exports = function (wikidataTime) {
  // Also accept claim datavalue.value objects
  if (typeof wikidataTime === 'object') {
    wikidataTime = wikidataTime.time
  }

  const sign = wikidataTime[0]
  var [ yearMonthDay, withinDay ] = wikidataTime.slice(1).split('T')

  // Wikidata generates invalid ISO dates to indicate precision
  // ex: +1990-00-00T00:00:00Z to indicate 1990 with year precision
  yearMonthDay = yearMonthDay.replace(/-00/g, '-01')
  const rest = `${yearMonthDay}T${withinDay}`

  return fullDateData(sign, rest)
}

const fullDateData = function (sign, rest) {
  return sign === '-' ? negativeDate(rest) : positiveDate(rest)
}

const positiveDate = rest => new Date(rest)
const negativeDate = function (rest) {
  const year = rest.split('-')[0]
  var date
  // Using ISO8601 expanded notation for negative years: adding 2 leading zeros
  // when needed. Can't find the documentation again, but testing
  // with `new Date(date)` gives a good clue of the implementation
  if (year.length === 4) {
    date = `-00${rest}`
  } else if (year.length === 5) {
    date = `-0${rest}`
  } else {
    date = `-${rest}`
  }
  return new Date(date)
}
