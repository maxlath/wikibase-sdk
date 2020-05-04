import {WikibaseApiFunctions} from './wikibase-api-functions.d'
import {WikibaseQueryServiceFunctions} from './wikibase-query-service-functions'

export * from './claim.d'
export * from './entity.d'
export * from './options.d'
export * from './sparql.d'
export * from './search.d'

export * as simplify from './simplify.d'
export * from './rank.d'
export * from './sitelinks.d'
export * from './helpers.d'

export interface Instance {
	root: string;
	apiEndpoint: string;
}

export interface WikibaseInstanceSDK extends WikibaseApiFunctions, WikibaseQueryServiceFunctions {
	instance: Instance;
}

export interface Config {
	instance: string,
	sparqlEndpoint: string;
}

export default function WBK(config: Config): WikibaseInstanceSDK;
