require('should')
const wdk = require('../lib/index')
const wbgetentitiesResponse = require('./data/wbgetentities_response.json')

describe('parse', () => {
  describe('wd', () => {
    describe('entities', () => {
      it('should be a function', done => {
        wdk.parse.wd.entities.should.be.a.Function()
        done()
      })

      it('should parse an entities responses', done => {
        const entities = wdk.parse.wd.entities(wbgetentitiesResponse)
        entities.should.be.an.Object()
        entities.Q3235026.should.be.an.Object()
        entities.Q3235026.labels.should.be.an.Object()
        entities.Q3235026.descriptions.should.be.an.Object()
        entities.Q3235026.claims.should.be.an.Object()
        done()
      })
    })
  })
})
