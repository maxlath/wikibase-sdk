should = require 'should'
wdk = require '../src/wikidata-sdk'

describe 'general', ->
  it 'env', (done)->
    wdk.should.be.an.Object
    done()
