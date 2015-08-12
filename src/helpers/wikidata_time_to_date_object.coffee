module.exports = (wikidataTime)->
  sign = wikidataTime[0]
  rest = wikidataTime[1..-1]
  date = fullDateData sign, rest

  if date.toString() is 'Invalid Date'
    return parseInvalideDate sign, rest
  else return date

fullDateData = (sign, rest)->
  if sign is '-' then return negativeDate rest
  else return positiveDate rest

positiveDate = (rest)-> new Date rest
negativeDate = (rest)->
  # using ISO8601 expanded notation for negative years: adding 2 leading zeros
  date = "-00#{rest}"
  return new Date(date)

parseInvalideDate = (sign, rest)->
  # This is probably a date of unsuffisient precision
  # such as 1953-00-00T00:00:00Z, thus invalid
  # It should at least have a year, so let's fallback to #{year}-01-01
  [ year, month, day ] = rest.split('T')[0].split '-'
  return fullDateData sign, year