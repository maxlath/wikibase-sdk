should = require 'should'
_ = require 'lodash'
wd_ = require '../src/utils/utils'
fs = require 'fs'

# requires path relative to process.cwd
tolstoiBooks = fs.readFileSync 'test/data/P50-Q7243.json', 'utf8'
tolstoiBooks = JSON.parse tolstoiBooks

parseWdqResponse = require('../src/utils/parse_wdq_response')

describe 'simplifyClaims', ->
  it 'env', (done)->
    parseWdqResponse.should.be.a.Function
    tolstoiBooks.should.be.an.Object
    tolstoiBooks.items.should.be.an.Array
    done()

  it 'should return an object', (done)->
    entities = parseWdqResponse tolstoiBooks
    entities.should.be.an.Object
    done()

  it 'should return a collection of Q entities', (done)->
    entities = parseWdqResponse tolstoiBooks
    entities.forEach (id)-> id.should.match /^Q[0-9]+$/
    done()
