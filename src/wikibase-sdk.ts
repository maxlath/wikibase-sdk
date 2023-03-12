import * as helpers from './helpers/helpers.js'
import * as parse from './helpers/parse_responses.js'
import * as rankHelpers from './helpers/rank.js'
import * as simplify from './helpers/simplify.js'
import * as sitelinksHelpers from './helpers/sitelinks.js'
import { cirrusSearchPagesFactory } from './queries/cirrus_search.js'
import { getEntitiesFactory } from './queries/get_entities.js'
import { getEntitiesFromSitelinksFactory } from './queries/get_entities_from_sitelinks.js'
import { getEntityRevisionFactory } from './queries/get_entity_revision.js'
import { getManyEntitiesFactory } from './queries/get_many_entities.js'
import { getReverseClaimsFactory } from './queries/get_reverse_claims.js'
import { getRevisionsFactory } from './queries/get_revisions.js'
import { searchEntitiesFactory } from './queries/search_entities.js'
import { sparqlQueryFactory } from './queries/sparql_query.js'
import { buildUrlFactory } from './utils/build_url.js'
import { isPlainObject } from './utils/utils.js'
import type { InstanceConfig, Url } from './types/options.js'

const tip = `Tip: if you just want to access functions that don't need an instance or a sparqlEndpoint,
those are also exposed directly on the module object. Exemple:
import { isItemId, simplify } from 'wikibase-sdk'`

const common = {
  simplify,
  parse,
  ...helpers,
  ...sitelinksHelpers,
  ...rankHelpers,
} as const

type ApiQueries = {
  readonly searchEntities: ReturnType<typeof searchEntitiesFactory>
  readonly cirrusSearchPages: ReturnType<typeof cirrusSearchPagesFactory>
  readonly getEntities: ReturnType<typeof getEntitiesFactory>
  readonly getManyEntities: ReturnType<typeof getManyEntitiesFactory>
  readonly getRevisions: ReturnType<typeof getRevisionsFactory>
  readonly getEntityRevision: ReturnType<typeof getEntityRevisionFactory>
  readonly getEntitiesFromSitelinks: ReturnType<typeof getEntitiesFromSitelinksFactory>
}
type SparqlQueries = {
  readonly sparqlQuery: ReturnType<typeof sparqlQueryFactory>
  readonly getReverseClaims: ReturnType<typeof getReverseClaimsFactory>
}
type Instance = {
  readonly root: Url
  readonly apiEndpoint: Url
}
export type Wbk = { readonly instance: Instance } & ApiQueries & SparqlQueries & typeof common

export function WBK (config: InstanceConfig): Wbk {
  if (!isPlainObject(config)) throw new Error('invalid config')
  const { instance, sparqlEndpoint } = config
  let { wgScriptPath = 'w' } = config

  wgScriptPath = wgScriptPath.replace(/^\//, '')

  if (!(instance || sparqlEndpoint)) {
    throw new Error(`one of instance or sparqlEndpoint should be set at initialization.\n${tip}`)
  }

  let wikibaseApiFunctions: ApiQueries
  let instanceRoot: string | undefined
  let instanceApiEndpoint: string | undefined
  if (instance) {
    validateEndpoint('instance', instance)

    instanceRoot = instance
      .replace(/\/$/, '')
      .replace(`/${wgScriptPath}/api.php`, '')

    instanceApiEndpoint = `${instanceRoot}/${wgScriptPath}/api.php`

    const buildUrl = buildUrlFactory(instanceApiEndpoint)

    wikibaseApiFunctions = {
      searchEntities: searchEntitiesFactory(buildUrl),
      cirrusSearchPages: cirrusSearchPagesFactory(buildUrl),
      getEntities: getEntitiesFactory(buildUrl),
      getManyEntities: getManyEntitiesFactory(buildUrl),
      getRevisions: getRevisionsFactory(buildUrl),
      getEntityRevision: getEntityRevisionFactory(instance, wgScriptPath),
      getEntitiesFromSitelinks: getEntitiesFromSitelinksFactory(buildUrl),
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

  let wikibaseQueryServiceFunctions: SparqlQueries
  if (sparqlEndpoint) {
    validateEndpoint('sparqlEndpoint', sparqlEndpoint)
    wikibaseQueryServiceFunctions = {
      sparqlQuery: sparqlQueryFactory(sparqlEndpoint),
      getReverseClaims: getReverseClaimsFactory(sparqlEndpoint),
    }
  } else {
    wikibaseQueryServiceFunctions = {
      sparqlQuery: missingSparqlEndpoint('sparqlQuery'),
      getReverseClaims: missingSparqlEndpoint('getReverseClaims'),
    }
  }

  return {
    instance: {
      root: instanceRoot,
      apiEndpoint: instanceApiEndpoint,
    },
    ...common,
    ...wikibaseApiFunctions,
    ...wikibaseQueryServiceFunctions,
  }
}

const validateEndpoint = (name: string, url: Url) => {
  if (!(typeof url === 'string' && url.startsWith('http'))) {
    throw new Error(`invalid ${name}: ${url}`)
  }
}

const missingConfig = (missingParameter: string) => (name: string) => () => {
  throw new Error(`${name} requires ${missingParameter} to be set at initialization`)
}

const missingSparqlEndpoint = missingConfig('a sparqlEndpoint')
const missingInstance = missingConfig('an instance')
