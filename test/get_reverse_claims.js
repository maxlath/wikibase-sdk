/* eslint-env mocha */
require('should')

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
    url.match(/SELECT/).should.be.ok()
    url.match(/WHERE/).should.be.ok()
    url.match(/LIMIT/).should.be.ok()
    done()
  })
})
