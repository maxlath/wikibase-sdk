import type { ApiQueryParameters, Url } from '../types/options.js'

const isBrowser = typeof location !== 'undefined' && typeof document !== 'undefined'

const stringifyQuery = queryObj => new URLSearchParams(queryObj).toString()

export function buildUrlFactory (instanceApiEndpoint: Url) {
  return function (queryObj: ApiQueryParameters): Url {
    // Request CORS headers if the request is made from a browser
    // See https://www.wikidata.org/w/api.php ('origin' parameter)
    if (isBrowser) queryObj.origin = '*'

    // Remove null or undefined parameters
    Object.keys(queryObj).forEach(key => {
      if (queryObj[key] == null) delete queryObj[key]
    })

    return instanceApiEndpoint + '?' + stringifyQuery(queryObj)
  }
}

export type BuildUrlFunction = (options: ApiQueryParameters) => Url
