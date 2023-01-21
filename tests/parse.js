require('should')
const parse = require('../lib/helpers/parse_responses')
const wbgetentitiesResponse = require('./data/wbgetentities_response.json')
const cirrusSearchPagesResponse = require('./data/cirrus_search_response.json')

describe('parse', () => {
  describe('wb', () => {
    describe('entities', () => {
      it('should be a function', () => {
        parse.wb.entities.should.be.a.Function()
      })

      it('should parse an entities response', () => {
        const entities = parse.wb.entities(wbgetentitiesResponse)
        entities.should.be.an.Object()
        entities.Q3235026.should.be.an.Object()
        entities.Q3235026.labels.should.be.an.Object()
        entities.Q3235026.descriptions.should.be.an.Object()
        entities.Q3235026.claims.should.be.an.Object()
      })
    })
    describe('pagesTitles', () => {
      it('should parse a cirrus search response', () => {
        const titles = parse.wb.pagesTitles(cirrusSearchPagesResponse)
        titles.should.deepEqual([ 'Q1' ])
      })
    })
  })
})
