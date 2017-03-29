const should = require('should')
const getReverseClaims = require('../lib/queries/get_reverse_claims')

describe('simplifyClaims', function () {
  it('env', function (done) {
    getReverseClaims.should.be.a.Function()
    done()
  })

  it('should return a SPARQL query url', function (done) {
    const url = getReverseClaims('P50', 'Q535')
    url.should.be.a.String()
    url.startsWith('https://query.wikidata.org').should.be.exactly(true)
    should(url.match(/SELECT/)).be.ok()
    should(url.match(/WHERE/)).be.ok()
    should(url.match(/LIMIT/)).be.ok()
    should(url.match(/subject%20wdt%3AP50%20wd%3AQ535/)).be.ok()
    should(url.match(/LIMIT%201000/)).be.ok()
    done()
  })

  it('should default to limit=1000', function (done) {
    const url = getReverseClaims('P50', 'Q535')
    should(url.match(/LIMIT%201000/)).be.ok()
    done()
  })

  it('should accept an option object', function (done) {
    const url = getReverseClaims('P50', 'Q535', { limit: 500 })
    should(url.match(/LIMIT%20500/)).be.ok()
    done()
  })

  it('should return a SPARQL query with filter for insensitive case', function (done) {
    const url = getReverseClaims('P2002', 'BouletCorp', { caseInsensitive: true })
    url.should.be.a.String()
    url.startsWith('https://query.wikidata.org').should.be.exactly(true)
    should(url.match(/SELECT/)).be.ok()
    should(url.match(/WHERE/)).be.ok()
    should(url.match(/LIMIT/)).be.ok()
    should(url.match(/FILTER%20%28lcase%28%3Fvalue%29%20%3D%20%27bouletcorp%27%29/)).be.ok()
    done()
  })
})
