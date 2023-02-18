import 'should'
import { parse } from '../src/helpers/parse_responses.js'
import { requireJson } from './lib/utils.js'

const cirrusSearchPagesResponse = requireJson(import.meta.url, './data/cirrus_search_response.json')
const wbgetentitiesResponse = requireJson(import.meta.url, './data/wbgetentities_response.json')

describe('parse', () => {
  describe('wb', () => {
    describe('entities', () => {
      it('should be a function', () => {
        parse.entities.should.be.a.Function()
      })

      it('should parse an entities response', () => {
        const entities = parse.entities(wbgetentitiesResponse)
        entities.should.be.an.Object()
        entities.Q3235026.should.be.an.Object()
        // @ts-expect-error
        entities.Q3235026.labels.should.be.an.Object()
        // @ts-expect-error
        entities.Q3235026.descriptions.should.be.an.Object()
        // @ts-expect-error
        entities.Q3235026.claims.should.be.an.Object()
      })
    })
    describe('pagesTitles', () => {
      it('should parse a cirrus search response', () => {
        const titles = parse.pagesTitles(cirrusSearchPagesResponse)
        titles.should.deepEqual([ 'Q1' ])
      })
    })
  })
})
