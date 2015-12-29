should = require 'should'
_ = require 'lodash'
qs = require 'querystring'

getEntities = require('../src/queries/wikidata_get_entities')

describe 'wikidata getEntities', ->
  describe 'action', ->
    it 'action should be wbgetentities', (done)->
      url = getEntities('Q1')
      url.should.match new RegExp('action=wbgetentities&')
      done()

  describe 'ids', ->
    it 'accepts one id as a string', (done)->
      url = getEntities('Q535')
      url.should.match new RegExp('&ids=Q535')
      done()

    it 'accepts ids as an array', (done)->
      url = getEntities(['Q535', 'Q7546'])
      url = qs.unescape(url)
      # use split instead of a regexp to work around pipe escaping issues
      url.split('&ids=Q535|Q7546&').length.should.equal 2
      done()

    it 'accepts numeric ids', (done)->
      url = getEntities(['535', '7546'])
      url = qs.unescape(url)
      url.split('&ids=Q535|Q7546&').length.should.equal 2
      done()

  describe 'languages', ->
    it "default to no language parameter", (done)->
      url = getEntities('Q535')
      url.should.not.match new RegExp('languages')
      done()

    it 'accepts one language as a string', (done)->
      url = getEntities('Q535', 'fr')
      url.should.match new RegExp('&languages=fr')
      done()

    it 'accepts language as an array', (done)->
      url = getEntities('Q535', ['fr', 'de'])
      url = qs.unescape(url)
      url.split('&languages=fr|de').length.should.equal 2
      done()

  describe 'properties', ->
    it 'default to no property specified', (done)->
      url = getEntities('Q702741', ['es', 'fi'])
      url.should.not.match new RegExp('&props')
      done()

  describe 'format', ->
    it 'default to json', (done)->
      url = getEntities('Q702741', ['es', 'fi'])
      url.should.match new RegExp('&format=json')
      done()