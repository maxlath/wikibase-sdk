should = require 'should'
_ = require 'lodash'
wd_ = require '../src/utils/utils'
fs = require 'fs'

# requires path relative to process.cwd
tolstoiBooks = fs.readFileSync 'test/data/P50-Q7243.json', 'utf8'
tolstoiBooks = JSON.parse tolstoiBooks

parse = require('../src/utils/parse_responses')

describe 'parse responses', ->
  it 'env', (done)->
    parse.wdq.entities.should.be.a.Function
    tolstoiBooks.should.be.an.Object
    tolstoiBooks.items.should.be.an.Array
    done()

  describe 'wd', ->
  describe 'wdq', ->
    it 'should return an object', (done)->
      entities = parse.wdq.entities tolstoiBooks
      entities.should.be.an.Object
      done()

    it 'should return a collection of Q entities', (done)->
      entities = parse.wdq.entities tolstoiBooks
      entities.forEach (id)-> id.should.match /^Q[0-9]+$/
      done()
