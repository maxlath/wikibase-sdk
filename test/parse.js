require('should')
const parse = require('../lib/helpers/parse_responses')
const wbgetentitiesResponse = require('./data/wbgetentities_response.json')

describe('parse', () => {
  describe('wd', () => {
    describe('entities', () => {
      it('should be a function', () => {
        parse.wd.entities.should.be.a.Function()
      })

      it('should parse an entities responses', () => {
        const entities = parse.wd.entities(wbgetentitiesResponse)
        entities.should.be.an.Object()
        entities.Q3235026.should.be.an.Object()
        entities.Q3235026.labels.should.be.an.Object()
        entities.Q3235026.descriptions.should.be.an.Object()
        entities.Q3235026.claims.should.be.an.Object()
      })
    })
  })
})
