const isBrowser = typeof location !== 'undefined' && typeof document !== 'undefined'

type ApiQueryValue = string | number | true
export type ApiQueryParameters = Record<string, ApiQueryValue>

// export type Url = `http${string}`
export type Url = string

export type BuildUrlFunction = <T extends string>(options: Readonly<Partial<Record<T, ApiQueryValue>>>) => Url

export function buildUrlFactory (instanceApiEndpoint: Url): BuildUrlFunction {
  return queryObj => {
    // Request CORS headers if the request is made from a browser
    // See https://www.wikidata.org/w/api.php ('origin' parameter)
    if (isBrowser) queryObj = { ...queryObj, origin: '*' }

    const queryEntries = Object.entries(queryObj)
      // Remove null or undefined parameters
      .filter(([ , value ]) => value != null)
      .map(([ key, value ]) => [ key, String(value) ])
    const query = new URLSearchParams(queryEntries).toString()
    return instanceApiEndpoint + '?' + query
  }
}
