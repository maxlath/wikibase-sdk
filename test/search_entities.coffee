should = require 'should'

searchEntities = require('../src/queries/search_entities')

describe 'wikidata searchEntities', ->

  describe 'action', ->
    it 'action should be wbsearchentities', (done)->
      url = searchEntities('Ingmar Bergman')
      url.should.match new RegExp('action=wbsearchentities')
      done()

  describe 'search', ->
    it 'accepts a string', (done)->
      url = searchEntities('johnnybegood')
      url.should.match new RegExp('search=johnnybegood')
      done()

    it 'accepts an object', (done)->
      url = searchEntities({search: 'johnnybegood', language: 'fr'})
      url.should.match new RegExp('search=johnnybegood')
      url.should.match new RegExp('language=fr')
      done()

    it 'throw on empty string', (done)->
      (-> searchEntities('')).should.throw()
      done()

  describe 'language', ->
    it 'should default on language=en', (done)->
      url = searchEntities('Ingmar Bergman')
      url.should.match new RegExp('language=en')
      done()

    it 'should accept a string', (done)->
      url = searchEntities('Ingmar Bergman', 'la')
      url.should.match new RegExp('language=la')
      done()

    it 'should set uselang as language by default', (done)->
      url = searchEntities('Ingmar Bergman', 'la')
      url.should.match new RegExp('uselang=la')
      done()

    it 'should accept a uselang parameter different from language', (done)->
      # multi-argument interface
      url = searchEntities 'Ingmar Bergman', 'la', null, null, 'eo'
      url.should.match new RegExp('language=la')
      url.should.match new RegExp('uselang=eo')
      # object interface
      url2 = searchEntities
        search: 'Ingmar Bergman'
        language: 'la'
        uselang: 'eo'
      url2.should.match new RegExp('language=la')
      url2.should.match new RegExp('uselang=eo')
      done()

  describe 'format', ->
    it 'should have json as default format', (done)->
      url = searchEntities 'Ingmar Bergman'
      url.should.match new RegExp('format=json')
      done()
