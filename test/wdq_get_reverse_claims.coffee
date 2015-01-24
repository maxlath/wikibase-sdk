should = require 'should'
qs = require 'querystring'

getReverseClaims = require('../src/queries/wdq_get_reverse_claims')

describe 'simplifyClaims', ->
  it 'env', (done)->
    getReverseClaims.should.be.a.Function
    done()

  it 'should return a url', (done)->
    url = getReverseClaims('P50', 'Q535')
    url.should.be.a.String
    url.should.match new RegExp('http\:\/\/')
    done()

  it 'should return a CLAIM query when value is a Q entity', (done)->
    url = getReverseClaims('P50', 'Q535')
    url = qs.unescape(url)
    url.should.equal "http://wdq.wmflabs.org/api?q=CLAIM[50:535]"
    done()

  it 'should return a STRING query when value isnt a Q entity', (done)->
    url = getReverseClaims('P212', '978-0-465-06710-7')
    url = qs.unescape(url)
    url.should.equal "http://wdq.wmflabs.org/api?q=STRING[212:978-0-465-06710-7]"
    done()