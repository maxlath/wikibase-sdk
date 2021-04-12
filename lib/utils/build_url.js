const isBrowser = typeof location !== 'undefined' && typeof document !== 'undefined'

let stringifyQuery
if (isBrowser) {
  stringifyQuery = queryObj => new URLSearchParams(queryObj).toString()
} else {
  // TODO: use URLSearchParams in NodeJS too, but that would mean dropping support for NodeJS < v10
  stringifyQuery = require('querystring').stringify
}

module.exports = instanceApiEndpoint => queryObj => {
  // Request CORS headers if the request is made from a browser
  // See https://www.wikidata.org/w/api.php ('origin' parameter)
  if (isBrowser) queryObj.origin = '*'
  return instanceApiEndpoint + '?' + stringifyQuery(queryObj)
}
