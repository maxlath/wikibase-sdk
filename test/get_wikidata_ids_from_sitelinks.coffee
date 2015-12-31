should = require 'should'
_ = require 'lodash'
qs = require 'querystring'
getIds = require('../src/queries/get_wikidata_ids_from_sitelinks')

describe 'wikidata getWikidataIdsFromSitelinks', ->
  describe 'polymorphism', ->
    it 'accepts parameters as multiple arguments', (done)->
      url = getIds 'Lyon', 'dewiki', 'en', 'info', 'json'
      console.log 'url', url
      url.split('&titles=Lyon').length.should.equal 2
      url.split('&sites=dewiki').length.should.equal 2
      url.split('&languages=en').length.should.equal 2
      url.split('&props=info').length.should.equal 2
      url.split('&format=json').length.should.equal 2
      done()

    it 'accepts parameters as a unique object argument', (done)->
      url = getIds 'Lyon', 'dewiki', 'en', 'info', 'json'
      url2 = getIds
        titles: 'Lyon'
        sites: 'dewiki'
        languages: 'en'
        props: 'info'
        format: 'json'

      url.should.equal url2

      done()

  describe 'action', ->
    it 'action should be wbgetentities', (done)->
      url = getIds 'Lyon'
      url.should.equal getIds({titles: 'Lyon'})
      url.should.match new RegExp('action=wbgetentities&')
      done()

  describe 'titles', ->
    it 'accepts one title as a string', (done)->
      url = getIds 'Lyon'
      url.should.equal getIds {titles: 'Lyon'}
      url.should.match new RegExp('&titles=Lyon')
      done()

    it 'accepts titles as an array', (done)->
      url = getIds ['Lyon', 'Hamburg']
      url.should.equal getIds({titles: ['Lyon', 'Hamburg']})
      url = qs.unescape url
      # use split instead of a regexp to work around pipe escaping issues
      url.split('&titles=Lyon|Hamburg&').length.should.equal 2
      done()

  describe 'sitelinks', ->
    it 'accepts one site as a string', (done)->
      url = getIds 'Lyon', 'itwiki'
      url.should.equal getIds {titles: 'Lyon', sites: 'itwiki'}
      url.should.match new RegExp('&sites=itwiki')
      done()

    it 'accepts titles as an array', (done)->
      url = getIds 'Lyon', ['itwiki', 'eswikisource']
      url.should.equal getIds({titles: 'Lyon', sites: ['itwiki', 'eswikisource']})
      url = qs.unescape url
      # use split instead of a regexp to work around pipe escaping issues
      url.split('&sites=itwiki|eswikisource&').length.should.equal 2
      done()

    it 'defaults to the English Wikipedia', (done)->
      url = getIds 'Lyon'
      url.should.equal getIds({titles: 'Lyon'})
      url = qs.unescape url
      # use split instead of a regexp to work around pipe escaping issues
      url.split('&sites=enwiki&').length.should.equal 2
      done()

    it 'converts 2-letters language codes to Wikipedia sites', (done)->
      url = getIds 'Lyon', ['it', 'fr']
      url.should.equal getIds({titles: 'Lyon', sites: ['it', 'fr']})
      url = qs.unescape url
      # use split instead of a regexp to work around pipe escaping issues
      url.split('&sites=itwiki|frwiki&').length.should.equal 2
      done()

  describe 'languages', ->
    it "default to no language parameter", (done)->
      url = getIds 'Lyon'
      url.should.equal getIds({titles: 'Lyon'})
      url.should.not.match new RegExp('languages')
      done()

    it 'accepts one language as a string', (done)->
      url = getIds 'Lyon', null, 'fr'
      url.should.equal getIds({titles: 'Lyon', languages: 'fr'})
      url.should.match new RegExp('&languages=fr')
      done()

    it 'accepts language as an array', (done)->
      url = getIds 'Lyon', null, ['fr', 'de']
      url.should.equal getIds({titles: 'Lyon', languages: ['fr', 'de']})
      url = qs.unescape url
      url.split('&languages=fr|de').length.should.equal 2
      done()

  describe 'properties', ->
    it 'default to no property specified', (done)->
      url = getIds 'Hamburg'
      url.should.not.match new RegExp('&props')
      done()

  describe 'format', ->
    it 'default to json', (done)->
      url = getIds 'Hamburg'
      url.should.match new RegExp('&format=json')
      done()
