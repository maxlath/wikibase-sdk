const wikidataApiRoot = 'https://www.wikidata.org/w/api.php'
const isBrowser = typeof location !== 'undefined' && typeof document !== 'undefined'
const qs = isBrowser ? require('./querystring_lite') : require('querystring')

module.exports = function (queryObj) {
  // Request CORS headers if the request is made from a browser
  // See https://www.wikidata.org/w/api.php ('origin' parameter)
  if (isBrowser) queryObj.origin = '*'
  return wikidataApiRoot + '?' + qs.stringify(queryObj)
}
