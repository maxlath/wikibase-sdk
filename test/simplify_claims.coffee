should = require 'should'
_ = require 'lodash'
Q571 = require './data/Q571.json'
Q4132785 = require './data/Q4132785.json'
Q328212 = require './data/Q328212.json'
Q22002395 = require './data/Q22002395.json'
Q2112 = require './data/Q2112.json'

# a fake entity to simulate a possible negative invalid date
Q4132785NegativeDate = require './data/Q4132785-negative-date.json'

{ simplifyClaim, simplifyPropertyClaims, simplifyClaims } = require('../src/helpers/simplify_claims')

describe 'simplifyClaims', ->
  it 'env', (done)->
    Q571.should.be.an.Object()
    Q571.claims.should.be.ok
    Q4132785.should.be.an.Object()
    Q4132785.claims.P577[0].should.be.ok
    done()

  it 'should return an object', (done)->
    simplifyClaims Q571.claims
    done()

  it 'should return an object of same length', (done)->
    originalLength = Object.keys(Q571.claims).length
    simplified = simplifyClaims Q571.claims
    newLength = Object.keys(simplified).length
    newLength.should.equal originalLength
    done()

  it 'should return an indexed collection of arrays', (done)->
    simplified = simplifyClaims Q571.claims
    for k, v of simplified
      v.should.be.an.Array()
    done()

  it 'should pass entity and property prefixes down', (done)->
    simplified = simplifyClaims Q2112.claims, 'wd'
    simplified.P190[0].should.equal 'wd:Q207614'
    simplified = simplifyClaims Q2112.claims, null, 'wdt'
    simplified['wdt:P123456789'][0].should.equal 'wdt:P207614'
    done()

  it 'should return prefixed properties if passed a property prefix', (done)->
    simplified = simplifyClaims Q2112.claims, 'wd', 'wdt'
    simplified['wdt:P190'].should.be.an.Array()
    simplified['wdt:P190'][0].should.equal 'wd:Q207614'
    simplified = simplifyClaims Q2112.claims, null, 'wdt'
    simplified['wdt:P123456789'][0].should.equal 'wdt:P207614'
    done()

describe 'simplifyPropertyClaims', ->
  it 'should return an arrays', (done)->
    simplified = simplifyPropertyClaims Q571.claims.P487
    simplified.should.be.an.Array()
    done()

  it 'should keep only non-null values', (done)->
    simplified = simplifyPropertyClaims Q22002395.claims.P50
    # Q22002395 P50 has 2 values with "snaktype": "somevalue"
    # that should be removed
    _.all(simplified, (qid)-> qid?).should.equal true
    done()

  it 'should pass entity and property prefixes down', (done)->
    simplified = simplifyPropertyClaims Q2112.claims.P190, 'wd'
    simplified[0].should.equal 'wd:Q207614'
    simplified = simplifyPropertyClaims Q2112.claims.P123456789, null, 'wdt'
    simplified[0].should.equal 'wdt:P207614'
    done()

describe 'simplifyClaim', ->
  it 'should return a valid time for possible invalid dates', (done)->
    # exemple: Q4132785>P577 is 1953-00-00T00:00:00Z
    simplified = simplifyClaim Q4132785.claims.P577[0]
    isNaN(simplified).should.equal false
    simplified.should.equal -536457600000
    done()

  it 'should return a valid time even for possible invalid negative date', (done)->
    simplified = simplifyClaim Q4132785NegativeDate.claims.P577[0]
    isNaN(simplified).should.equal false
    simplified.should.equal -123797894400000
    done()

  it 'should return a url for datatype url', (done)->
    simplified = simplifyClaim Q328212.claims.P856[0]
    simplified.should.equal "http://veronicarothbooks.blogspot.com"
    done()

  it 'should return simplify globecoordinate as a latLng array', (done)->
    simplified = simplifyClaim Q2112.claims.P625[0]
    simplified.should.be.an.Array()
    simplified[0].should.equal 52.016666666667
    simplified[1].should.equal 8.5166666666667
    done()

  it 'should return prefixed entity ids if passed an entity prefix', (done)->
    simplified = simplifyClaim Q2112.claims.P190[0]
    simplified.should.equal 'Q207614'
    simplified = simplifyClaim Q2112.claims.P190[0], 'wd'
    simplified.should.equal 'wd:Q207614'
    simplified = simplifyClaim Q2112.claims.P190[0], 'wd:'
    simplified.should.equal 'wd::Q207614'
    simplified = simplifyClaim Q2112.claims.P190[0], 'wdbla'
    simplified.should.equal 'wdbla:Q207614'
    done()

  it 'should return prefixed property ids if passed a property prefix', (done)->
    simplified = simplifyClaim Q2112.claims.P123456789[0]
    simplified.should.equal 'P207614'
    simplified = simplifyClaim Q2112.claims.P123456789[0], null
    simplified.should.equal 'P207614'
    simplified = simplifyClaim Q2112.claims.P123456789[0], null, 'wdt'
    simplified.should.equal 'wdt:P207614'
    simplified = simplifyClaim Q2112.claims.P123456789[0], null, 'wdt:'
    simplified.should.equal 'wdt::P207614'
    simplified = simplifyClaim Q2112.claims.P123456789[0], null, 'wdtbla'
    simplified.should.equal 'wdtbla:P207614'
    done()
