should = require 'should'
qs = require 'querystring'

wdkCof = require('../src/wikidata-sdk')
wdkJs = require('../build/wikidata-sdk')

describe 'global', ->
  it 'env', (done)->
    wdkCof.should.be.an.Object
    wdkJs.should.be.an.Object
    done()

  it 'coffeescript', (done)->
    wdkCof.searchEntities.should.be.a.Function
    wdkCof.getEntities.should.be.a.Function
    wdkCof.getReverseClaims.should.be.a.Function
    wdkCof.simplifyClaims.should.be.a.Function
    wdkCof.parseWdqResponse.should.be.a.Function
    wdkCof.utils.should.be.an.Object
    wdkCof.utils.isNumericId.should.be.a.Function
    wdkCof.utils.isWikidataId.should.be.a.Function
    wdkCof.utils.isWikidataEntityId.should.be.a.Function
    wdkCof.utils.isWikidataPropertyId.should.be.a.Function
    wdkCof.utils.normalizeId.should.be.a.Function
    wdkCof.utils.normalizeIds.should.be.a.Function
    wdkCof.utils.normalizeWikidataTime.should.be.a.Function
    wdkCof.utils.toPropertiesArray.should.be.a.Function
    done()

  it 'javascript', (done)->
    wdkJs.searchEntities.should.be.a.Function
    wdkJs.getEntities.should.be.a.Function
    wdkJs.getReverseClaims.should.be.a.Function
    wdkJs.simplifyClaims.should.be.a.Function
    wdkJs.parseWdqResponse.should.be.a.Function
    wdkJs.utils.should.be.an.Object
    wdkJs.utils.isNumericId.should.be.a.Function
    wdkJs.utils.isWikidataId.should.be.a.Function
    wdkJs.utils.isWikidataEntityId.should.be.a.Function
    wdkJs.utils.isWikidataPropertyId.should.be.a.Function
    wdkJs.utils.normalizeId.should.be.a.Function
    wdkJs.utils.normalizeIds.should.be.a.Function
    wdkJs.utils.normalizeWikidataTime.should.be.a.Function
    wdkJs.utils.toPropertiesArray.should.be.a.Function
    done()