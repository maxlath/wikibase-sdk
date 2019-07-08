const { isPlainObject } = require('./utils/utils')

const simplify = require('./helpers/simplify')
const parse = require('./helpers/parse_responses')
const helpers = require('./helpers/helpers')
const sitelinksHelpers = require('../lib/helpers/sitelinks')
const rankHelpers = require('../lib/helpers/rank')

const common = Object.assign({ simplify, parse }, helpers, sitelinksHelpers, rankHelpers)

const WBK = function (config) {
  if (!isPlainObject(config)) throw new Error('invalid config')
  const { instance, sparqlEndpoint } = config

  validateEndpoint('instance', instance)

  const buildUrl = require('./utils/build_url')(instance)

  const wikibaseApiFunctions = {
    searchEntities: require('./queries/search_entities')(buildUrl),
    getEntities: require('./queries/get_entities')(buildUrl),
    getManyEntities: require('./queries/get_many_entities')(buildUrl),
    getRevisions: require('./queries/get_revisions')(buildUrl),
    getEntityRevision: require('./queries/get_entity_revision')(instance),
    getEntitiesFromSitelinks: require('./queries/get_entities_from_sitelinks')(buildUrl)
  }

  var wikibaseQueryServiceFunctions
  if (sparqlEndpoint) {
    validateEndpoint('sparqlEndpoint', sparqlEndpoint)
    wikibaseQueryServiceFunctions = {
      sparqlQuery: require('./queries/sparql_query')(sparqlEndpoint),
      getReverseClaims: require('./queries/get_reverse_claims')(sparqlEndpoint)
    }
  } else {
    wikibaseQueryServiceFunctions = {
      sparqlQuery: missingSparqlEndpoint('sparqlQuery'),
      getReverseClaims: missingSparqlEndpoint('getReverseClaims')
    }
  }

  return Object.assign({}, common, wikibaseApiFunctions, wikibaseQueryServiceFunctions)
}

// Make heplpers that don't require an instance to be specified available
// directly on the exported function object
Object.assign(WBK, common)

const validateEndpoint = (name, url) => {
  if (!(typeof url === 'string' && url.startsWith('http'))) {
    throw new Error(`invalid ${name}: ${url}`)
  }
}

const missingSparqlEndpoint = name => () => {
  throw new Error(`${name} requires a sparqlEndpoint to be set in configuration object`)
}

module.exports = WBK
