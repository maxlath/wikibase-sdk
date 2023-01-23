import * as rankHelpers from './helpers/rank.js'
import * as sitelinksHelpers from './helpers/sitelinks.js'
import * as helpers from './helpers/helpers.js'
import * as parse from './helpers/parse_responses.js'
import simplify from './helpers/simplify.js'
import { CirrusSearchPages } from './queries/cirrus_search.js'
import { GetEntities } from './queries/get_entities.js'
import { GetEntitiesFromSitelinks } from './queries/get_entities_from_sitelinks.js'
import { GetEntityRevision } from './queries/get_entity_revision.js'
import { GetManyEntities } from './queries/get_many_entities.js'
import { GetReverseClaims } from './queries/get_reverse_claims.js'
import { GetRevisions } from './queries/get_revisions.js'
import { SearchEntities } from './queries/search_entities.js'
import { SparqlQuery } from './queries/sparql_query.js'
import { BuildUrl } from './utils/build_url.js'
import { isPlainObject } from './utils/utils.js'

const tip = `Tip: if you just want to access functions that don't need an instance or a sparqlEndpoint,
those are also exposed directly on the module object. Exemple:
import { isItemId, simplify } from 'wikibase-sdk'`

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

    const buildUrl = BuildUrl(instanceApiEndpoint)

    wikibaseApiFunctions = {
      searchEntities: SearchEntities(buildUrl),
      cirrusSearchPages: CirrusSearchPages(buildUrl),
      getEntities: GetEntities(buildUrl),
      getManyEntities: GetManyEntities(buildUrl),
      getRevisions: GetRevisions(buildUrl),
      getEntityRevision: GetEntityRevision(instance, wgScriptPath),
      getEntitiesFromSitelinks: GetEntitiesFromSitelinks(buildUrl),
    }
  } else {
    wikibaseApiFunctions = {
      searchEntities: missingInstance('searchEntities'),
      cirrusSearchPages: missingInstance('cirrusSearchPages'),
      getEntities: missingInstance('getEntities'),
      getManyEntities: missingInstance('getManyEntities'),
      getRevisions: missingInstance('getRevisions'),
      getEntityRevision: missingInstance('getEntityRevision'),
      getEntitiesFromSitelinks: missingInstance('getEntitiesFromSitelinks'),
    }
  }

  let wikibaseQueryServiceFunctions
  if (sparqlEndpoint) {
    validateEndpoint('sparqlEndpoint', sparqlEndpoint)
    wikibaseQueryServiceFunctions = {
      sparqlQuery: SparqlQuery(sparqlEndpoint),
      getReverseClaims: GetReverseClaims(sparqlEndpoint),
    }
  } else {
    wikibaseQueryServiceFunctions = {
      sparqlQuery: missingSparqlEndpoint('sparqlQuery'),
      getReverseClaims: missingSparqlEndpoint('getReverseClaims'),
    }
  }

  const parsedData = {
    instance: {
      root: instanceRoot,
      apiEndpoint: instanceApiEndpoint,
    },
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

export default WBK
