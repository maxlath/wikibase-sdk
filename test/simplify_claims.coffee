should = require 'should'
_ = require 'lodash'
fs = require 'fs'
Q571 = fs.readFileSync 'test/data/Q571.json', 'utf8'
Q571 = JSON.parse Q571

simplifyClaims = require('../src/utils/simplify_claims')

describe 'simplifyClaims', ->
  it 'env', (done)->
    Q571.should.be.an.Object
    Q571.claims.should.be.ok
    done()

  it 'should return an object', (done)->
    simplifyClaims(Q571.claims)
    done()

  it 'should return an object of same length', (done)->
    originalLength = Object.keys(Q571.claims).length
    simplified = simplifyClaims(Q571.claims)
    newLength = Object.keys(simplified).length
    newLength.should.equal originalLength
    done()

  it 'should return a collection of arrays', (done)->
    simplified = simplifyClaims(Q571.claims)
    for k, v of simplified
      v.should.be.an.Array
    done()
