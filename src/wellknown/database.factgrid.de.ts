import { WBK } from '../wikibase-sdk.js'

export const wdk = WBK({
  instance: 'https://database.factgrid.de',
  sparqlEndpoint: 'https://database.factgrid.de/sparql',
})

export default wdk
