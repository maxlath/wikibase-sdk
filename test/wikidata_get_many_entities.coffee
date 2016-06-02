should = require 'should'

getManyEntities = require('../src/queries/wikidata_get_many_entities')

describe 'wikidata getManyEntities', ->
  describe 'general', ->
    it 'should return an array of urls', (done)->
      ids = [1..80].map (id)-> "Q#{id}"
      urls = getManyEntities(ids, 'fr', 'info', 'json')
      urls.should.be.an.Array()
      urls.forEach (url)-> /^https/.test(url).should.be.true()
      done()

  describe 'polymorphism', ->
    it 'accepts parameters as multiple arguments', (done)->
      urls = getManyEntities(['Q1'], 'fr', 'info', 'json')
      urls.should.be.an.Array()
      console.log 'urls', urls
      url = urls[0]
      url.split('&ids=Q1').length.should.equal 2
      url.split('&languages=fr').length.should.equal 2
      url.split('&props=info').length.should.equal 2
      url.split('&format=json').length.should.equal 2
      done()

    it 'accepts parameters as a unique object argument', (done)->
      urls = getManyEntities
        ids: ['Q1']
        languages: 'fr'
        props: 'info'
        format: 'json'
      urls.should.be.an.Array()
      console.log 'urls', urls
      url = urls[0]
      console.log 'url', url
      url.split('&ids=Q1').length.should.equal 2
      url.split('&languages=fr').length.should.equal 2
      url.split('&props=info').length.should.equal 2
      url.split('&format=json').length.should.equal 2
      done()

  describe 'ids', ->
    it 'throw if passed an id string', (done)->
      (-> getManyEntities('Q535')).should.throw()
      done()
