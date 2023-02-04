import { fixedEncodeURIComponent } from '../utils/utils.js'
import type { Url } from '../types/options.js'

export function sparqlQueryFactory (sparqlEndpoint: Url) {
  return function sparqlQuery (sparql: string): Url {
    const query = fixedEncodeURIComponent(sparql)
    return `${sparqlEndpoint}?format=json&query=${query}`
  }
}
