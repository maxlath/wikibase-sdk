const should = require('should')
const { sparqlEndpoint } = require('./lib/tests_env')
const getReverseClaims = require('../lib/queries/get_reverse_claims')(sparqlEndpoint)

describe('getReverseClaims', () => {
  it('env', done => {
    getReverseClaims.should.be.a.Function()
    done()
  })

  it('should return a SPARQL query url', done => {
    const url = getReverseClaims('P50', 'Q535')
    url.should.be.a.String()
    url.startsWith('https://query.wikidata.org').should.be.exactly(true)
    should(url.match(/SELECT/)).be.ok()
    should(url.match(/WHERE/)).be.ok()
    should(url.match(/LIMIT/)).not.be.ok()
    should(url.match(/subject%20wdt%3AP50%20wd%3AQ535/)).be.ok()
    done()
  })

  it('should accept an option object', done => {
    const url = getReverseClaims('P50', 'Q535', { limit: 500 })
    should(url.match(/LIMIT%20500/)).be.ok()
    done()
  })

  it('should return a SPARQL query with filter for insensitive case', done => {
    const url = getReverseClaims('P2002', 'BouletCorp', { caseInsensitive: true })
    url.should.be.a.String()
    url.startsWith('https://query.wikidata.org').should.be.exactly(true)
    should(url.match(/SELECT/)).be.ok()
    should(url.match(/WHERE/)).be.ok()
    should(url.match(/LIMIT/)).not.be.ok()
    should(url.match(/FILTER%20%28lcase%28%3Fvalue%29%20%3D%20%27bouletcorp%27%29/)).be.ok()
    done()
  })

  it('should filter properties by default', done => {
    const url = getReverseClaims('P50', 'Q535')
    should(url.match(/FILTER%20NOT%20EXISTS/)).be.ok()
    done()
  })

  it('should keep properties if requested', done => {
    const url = getReverseClaims('P50', 'Q535', { keepProperties: true })
    should(url.match(/FILTER%20NOT%20EXISTS/)).not.be.ok()
    done()
  })

  it('should allow to request subjects for several properties at once', done => {
    const url = getReverseClaims([ 'P50', 'P110' ], 'Q281411')
    url.should.match(/wdt%3AP50%7Cwdt%3AP110/)
    done()
  })

  it('should allow to request subjects for several values at once', done => {
    const url = getReverseClaims('P50', [ 'Q281411', 'Q206685' ])
    url.should.match(/UNION/)
    const url2 = getReverseClaims('P2002', [ 'wikicite', 'slpng_giants' ], { caseInsensitive: true })
    done()
    url2.should.match(/UNION/)
  })

  // Doing both a UNION and piping properties fails
  // Ex: https://query.wikidata.org/#SELECT%20DISTINCT%20%3Fsubject%20WHERE%20%7B%0A%20%20%7B%0A%20%20%20%20%3Fsubject%20wdt%3AP50%7Cwdt%3AP110%20wd%3AQ281411%20.%0A%20%20%20%20FILTER%20NOT%20EXISTS%20%7B%20%3Fsubject%20rdf%3Atype%20wikibase%3AProperty%20.%20%7D%0A%20%20%7D%20UNION%20%7B%0A%20%20%20%20%3Fsubject%20wdt%3AP50%7Cwdt%3AP110%20wd%3AQ206685%20.%0A%20%20%20%20FILTER%20NOT%20EXISTS%20%7B%20%3Fsubject%20rdf%3Atype%20wikibase%3AProperty%20.%20%7D%20%0A%20%20%7D%0A%7D%0ALIMIT%201000
  // it('should allow to request subjects for several properties and values at once', done => {
  //   const url = getReverseClaims([ 'P50', 'P110' ], [ 'Q281411', 'Q206685' ])
  //   url.match(/wdt%3AP50%7Cwdt%3AP110/g).length.should.equal(2)
  //   url.should.match(/UNION/)
  //   done()
  // })
})
