should = require 'should'

searchEntities = require('../src/queries/wikidata_search_entities')

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

    it 'throw on empty string', (done)->
      (-> searchEntities('')).should.throw()
      done()

  describe 'language', ->
    it 'should default on language=en', (done)->
      url = searchEntities('Q5')
      url.should.match new RegExp('language=en')
      done()

    it 'should accept a string', (done)->
      url = searchEntities('Q35802', 'la')
      url.should.match new RegExp('language=la')
      done()