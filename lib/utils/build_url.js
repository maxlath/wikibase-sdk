const isBrowser = typeof location !== 'undefined' && typeof document !== 'undefined'

const stringifyQuery = queryObj => new URLSearchParams(queryObj).toString()

module.exports = instanceApiEndpoint => queryObj => {
  // Request CORS headers if the request is made from a browser
  // See https://www.wikidata.org/w/api.php ('origin' parameter)
  if (isBrowser) queryObj.origin = '*'

  // Remove null or undefined parameters
  Object.keys(queryObj).forEach(key => {
    if (queryObj[key] == null) delete queryObj[key]
  })

  return instanceApiEndpoint + '?' + stringifyQuery(queryObj)
}
