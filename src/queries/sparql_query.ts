import { fixedEncodeURIComponent } from '../utils/utils.js'

export const SparqlQuery = sparqlEndpoint => sparql => {
  const query = fixedEncodeURIComponent(sparql)
  return `${sparqlEndpoint}?format=json&query=${query}`
}
