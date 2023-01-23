import { fixedEncodeURIComponent } from '../utils/utils.js'

export const sparqlQueryFactory = sparqlEndpoint => sparql => {
  const query = fixedEncodeURIComponent(sparql)
  return `${sparqlEndpoint}?format=json&query=${query}`
}
