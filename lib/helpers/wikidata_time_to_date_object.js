module.exports = function (wikidataTime) {
  const sign = wikidataTime[0]
  const rest = wikidataTime.slice(1)
  const date = fullDateData(sign, rest)

  if (date.toString() === 'Invalid Date') {
    return parseInvalideDate(sign, rest)
  } else {
    return date
  }
}

const fullDateData = function (sign, rest) {
  return sign === '-' ? negativeDate(rest) : positiveDate(rest)
}

const positiveDate = (rest) => new Date(rest)
const negativeDate = function (rest) {
  // using ISO8601 expanded notation for negative years: adding 2 leading zeros
  const date = `-00${rest}`
  return new Date(date)
}

const parseInvalideDate = function (sign, rest) {
  // This is probably a date of unsuffisient precision
  // such as 1953-00-00T00:00:00Z, thus invalid
  // It should at least have a year, so let's fallback to ${year}-01-01
  const year = rest.split('T')[0].split('-')[0]
  return fullDateData(sign, year)
}
