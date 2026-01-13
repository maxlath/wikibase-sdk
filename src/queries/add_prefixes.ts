import { pick } from '../utils/utils.js'

// List parsed from https://query.wikidata.org/ a[data-i18n="[title]wdqs-app-button-prefixes"]
const wellknownPrefixes = {
  bd: 'http://www.bigdata.com/rdf#',
  bds: 'http://www.bigdata.com/rdf/search#',
  dct: 'http://purl.org/dc/terms/',
  gas: 'http://www.bigdata.com/rdf/gas#',
  geo: 'http://www.opengis.net/ont/geosparql#',
  geof: 'http://www.opengis.net/def/geosparql/function/',
  hint: 'http://www.bigdata.com/queryHints#',
  mwapi: 'https://www.mediawiki.org/ontology#API/',
  ontolex: 'http://www.w3.org/ns/lemon/ontolex#',
  owl: 'http://www.w3.org/2002/07/owl#',
  p: 'http://www.wikidata.org/prop/',
  pq: 'http://www.wikidata.org/prop/qualifier/',
  pqn: 'http://www.wikidata.org/prop/qualifier/value-normalized/',
  pqv: 'http://www.wikidata.org/prop/qualifier/value/',
  pr: 'http://www.wikidata.org/prop/reference/',
  prn: 'http://www.wikidata.org/prop/reference/value-normalized/',
  prov: 'http://www.w3.org/ns/prov#',
  prv: 'http://www.wikidata.org/prop/reference/value/',
  ps: 'http://www.wikidata.org/prop/statement/',
  psn: 'http://www.wikidata.org/prop/statement/value-normalized/',
  psv: 'http://www.wikidata.org/prop/statement/value/',
  rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
  schema: 'http://schema.org/',
  skos: 'http://www.w3.org/2004/02/skos/core#',
  wd: 'http://www.wikidata.org/entity/',
  wdata: 'http://www.wikidata.org/wiki/Special:EntityData/',
  wdno: 'http://www.wikidata.org/prop/novalue/',
  wdref: 'http://www.wikidata.org/reference/',
  wds: 'http://www.wikidata.org/entity/statement/',
  wdsubgraph: 'https://query.wikidata.org/subgraph/',
  wdt: 'http://www.wikidata.org/prop/direct/',
  wdtn: 'http://www.wikidata.org/prop/direct-normalized/',
  wdv: 'http://www.wikidata.org/value/',
  wikibase: 'http://wikiba.se/ontology#',
  xsd: 'http://www.w3.org/2001/XMLSchema#',
} as const

export function addWellknownPrefixes (sparql: string) {
  if (sparql.trim().startsWith('PREFIX')) return sparql
  let prefixesHeader = ''
  const foundPrefixesKeys = sparql.match(/\w+:/g)?.map(prefix => prefix.replace(':', ''))
  if (foundPrefixesKeys) {
    const foundPrefixes = pick(wellknownPrefixes, foundPrefixesKeys)
    prefixesHeader = Object.entries(foundPrefixes).map(([ key, value ]) => {
      return `PREFIX ${key}: <${value}>`
    })
    .join('\n')
  }
  return `${prefixesHeader}\n${sparql}`.trim()
}
