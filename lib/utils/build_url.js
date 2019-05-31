const isBrowser = typeof location !== 'undefined' && typeof document !== 'undefined'
const qs = isBrowser ? require('./querystring_lite') : require('querystring')

module.exports = instance => {
  const instanceApiEndpoint = instance.endsWith('/w/api.php')
    ? instance
    : instance.endsWith('/')
    ? instance + 'w/api.php'
    : instance + '/w/api.php'

  return queryObj => {
    // Request CORS headers if the request is made from a browser
    // See https://www.wikidata.org/w/api.php ('origin' parameter)
    if (isBrowser) queryObj.origin = '*'
    return instanceApiEndpoint + '?' + qs.stringify(queryObj)
  }
}
