should = require 'should'

getManyEntities = require('../src/queries/get_many_entities')
manyIds = [1..80].map (id)-> "Q#{id}"

describe 'wikidata getManyEntities', ->
  describe 'general', ->
    it 'should return an array of urls', (done)->
      urls = getManyEntities(manyIds, 'fr', 'info', 'json')
      urls.should.be.an.Array()
      urls.forEach (url)-> /^https/.test(url).should.be.true()
      done()

  describe 'polymorphism', ->
    it 'should accept parameters as multiple arguments', (done)->
      urls = getManyEntities(manyIds, 'fr', 'info', 'json')
      urls.should.be.an.Array()
      urls.forEach (url)->
        url.split('&ids=Q').length.should.equal 2
        url.split('&languages=fr').length.should.equal 2
        url.split('&props=info').length.should.equal 2
        url.split('&format=json').length.should.equal 2
      done()

    it 'should accept parameters as a unique object argument', (done)->
      urls = getManyEntities
        ids: manyIds
        languages: 'fr'
        props: 'labels'
        format: 'xml'
      urls.should.be.an.Array()
      urls.forEach (url)->
        url.split('&ids=Q').length.should.equal 2
        url.split('&languages=fr').length.should.equal 2
        url.split('&props=labels').length.should.equal 2
        url.split('&format=xml').length.should.equal 2
      done()

  describe 'ids', ->
    it 'should throw if passed an id string', (done)->
      (-> getManyEntities('Q535')).should.throw()
      done()
