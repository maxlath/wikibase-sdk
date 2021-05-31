const { isPlainObject } = require('./utils/utils')

const simplify = require('./helpers/simplify')
const parse = require('./helpers/parse_responses')
const helpers = require('./helpers/helpers')
const sitelinksHelpers = require('../lib/helpers/sitelinks')
const rankHelpers = require('../lib/helpers/rank')
const tip = `Tip: if you just want to access functions that don't need an instance or a sparqlEndpoint,
those are also exposed directly on the module object. Exemple:
const { isItemId, simplify } = require('wikibase-sdk')`

const common = Object.assign({ simplify, parse }, helpers, sitelinksHelpers, rankHelpers)

const WBK = config => {
  if (!isPlainObject(config)) throw new Error('invalid config')
  const { instance, sparqlEndpoint } = config
  let { wgScriptPath = 'w' } = config

  wgScriptPath = wgScriptPath.replace(/^\//, '')

  if (!(instance || sparqlEndpoint)) {
    throw new Error(`one of instance or sparqlEndpoint should be set at initialization.\n${tip}`)
  }

  let wikibaseApiFunctions, instanceRoot, instanceApiEndpoint
  if (instance) {
    validateEndpoint('instance', instance)

    instanceRoot = instance
      .replace(/\/$/, '')
      .replace(`/${wgScriptPath}/api.php`, '')

    instanceApiEndpoint = `${instanceRoot}/${wgScriptPath}/api.php`

    const buildUrl = require('./utils/build_url')(instanceApiEndpoint)

    wikibaseApiFunctions = {
      searchEntities: require('./queries/search_entities')(buildUrl),
      cirrusSearchPages: require('./queries/cirrus_search')(buildUrl),
      getEntities: require('./queries/get_entities')(buildUrl),
      getManyEntities: require('./queries/get_many_entities')(buildUrl),
      getRevisions: require('./queries/get_revisions')(buildUrl),
      getEntityRevision: require('./queries/get_entity_revision')(instance, wgScriptPath),
      getEntitiesFromSitelinks: require('./queries/get_entities_from_sitelinks')(buildUrl)
    }
  } else {
    wikibaseApiFunctions = {
      searchEntities: missingInstance('searchEntities'),
      cirrusSearchPages: missingInstance('cirrusSearchPages'),
      getEntities: missingInstance('getEntities'),
      getManyEntities: missingInstance('getManyEntities'),
      getRevisions: missingInstance('getRevisions'),
      getEntityRevision: missingInstance('getEntityRevision'),
      getEntitiesFromSitelinks: missingInstance('getEntitiesFromSitelinks')
    }
  }

  let wikibaseQueryServiceFunctions
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

  const parsedData = {
    instance: {
      root: instanceRoot,
      apiEndpoint: instanceApiEndpoint
    }
  }

  return Object.assign(parsedData, common, wikibaseApiFunctions, wikibaseQueryServiceFunctions)
}

// Make heplpers that don't require an instance to be specified available
// directly on the exported function object
Object.assign(WBK, common)

const validateEndpoint = (name, url) => {
  if (!(typeof url === 'string' && url.startsWith('http'))) {
    throw new Error(`invalid ${name}: ${url}`)
  }
}

const missingConfig = missingParameter => name => () => {
  throw new Error(`${name} requires ${missingParameter} to be set at initialization`)
}

const missingSparqlEndpoint = missingConfig('a sparqlEndpoint')
const missingInstance = missingConfig('an instance')

module.exports = WBK
