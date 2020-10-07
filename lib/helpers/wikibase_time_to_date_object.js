module.exports = wikibaseTime => {
  // Also accept claim datavalue.value objects
  if (typeof wikibaseTime === 'object') {
    wikibaseTime = wikibaseTime.time
  }

  const sign = wikibaseTime[0]
  let [ yearMonthDay, withinDay ] = wikibaseTime.slice(1).split('T')

  // Wikidata generates invalid ISO dates to indicate precision
  // ex: +1990-00-00T00:00:00Z to indicate 1990 with year precision
  yearMonthDay = yearMonthDay.replace(/-00/g, '-01')
  const rest = `${yearMonthDay}T${withinDay}`

  return fullDateData(sign, rest)
}

const fullDateData = (sign, rest) => {
  const year = rest.split('-')[0]
  const needsExpandedYear = sign === '-' || year.length > 4

  return needsExpandedYear ? expandedYearDate(sign, rest, year) : new Date(rest)
}

const expandedYearDate = (sign, rest, year) => {
  let date
  // Using ISO8601 expanded notation for negative years or positive
  // years with more than 4 digits: adding up to 2 leading zeros
  // when needed. Can't find the documentation again, but testing
  // with `new Date(date)` gives a good clue of the implementation
  if (year.length === 4) {
    date = `${sign}00${rest}`
  } else if (year.length === 5) {
    date = `${sign}0${rest}`
  } else {
    date = sign + rest
  }
  return new Date(date)
}
