// replacing what we need of querystring in case
// querystring isnt available (esp. in the browser)
var qs
try {
  qs = require('querystring')
} catch (err) {
  qs = require('./querystring_lite')
}

const wikidataApiRoot = 'https://www.wikidata.org/w/api.php'

var isBrowser
try {
  isBrowser = window != null
} catch (err) {
  isBrowser = false
}

module.exports = function (queryObj) {
  // Request CORS headers if the request is made from a browser
  // See https://www.wikidata.org/w/api.php ('origin' parameter)
  if (isBrowser) queryObj.origin = '*'
  return wikidataApiRoot + '?' + qs.stringify(queryObj)
}
