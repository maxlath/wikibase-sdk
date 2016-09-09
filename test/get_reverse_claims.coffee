should = require 'should'
qs = require 'querystring'

getReverseClaims = require('../src/queries/get_reverse_claims')

describe 'simplifyClaims', ->
  it 'env', (done)->
    getReverseClaims.should.be.a.Function()
    done()

  it 'should return a SPARQL query url', (done)->
    url = getReverseClaims('P50', 'Q535')
    url.should.be.a.String()
    url.startsWith('https://query.wikidata.org').should.be.exactly(true)
    url.match(/SELECT/).should.be.ok()
    url.match(/WHERE/).should.be.ok()
    url.match(/LIMIT/).should.be.ok()
    console.log('url', url)
    done()
