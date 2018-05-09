require('should')

const { wikidataTimeToEpochTime, wikidataTimeToISOString, wikidataTimeToSimpleDay, isEntityId, isItemId, isPropertyId } = require('../lib/helpers/helpers')

const Q970917 = require('./data/Q970917.json')

describe('helpers', function () {
  const ISOtime = '2014-05-14T00:00:00.000Z'
  const wdTime = '+2014-05-14T00:00:00Z'
  const epoch = 1400025600000
  const ISOnegativeTime = '-000044-03-15T00:00:00.000Z'
  const negativeWdTime = '-0044-03-15T00:00:00Z'
  const negativeEpoch = -63549360000000

  describe('wikidataTimeToEpochTime', function () {
    it('env', function (done) {
      new Date(epoch).toISOString().should.equal(ISOtime)
      new Date(negativeEpoch).toISOString().should.equal(ISOnegativeTime)
      done()
    })

    it('should return a number (epoch time)', function (done) {
      wikidataTimeToEpochTime(wdTime).should.be.a.Number()
      done()
    })

    it('should return a number for negative time', function (done) {
      wikidataTimeToEpochTime(negativeWdTime).should.be.a.Number()
      done()
    })

    it('should return the right number', function (done) {
      wikidataTimeToEpochTime(wdTime).should.equal(epoch)
      done()
    })

    it('should return the right number for negative time too', function (done) {
      wikidataTimeToEpochTime(negativeWdTime).should.equal(negativeEpoch)
      done()
    })

    it('should accept a value object', function (done) {
      wikidataTimeToEpochTime(Q970917.claims.P569[0].mainsnak.datavalue.value)
      .should.equal(-3160944000000)
      done()
    })
  })

  describe('wikidataTimeToISOString', function () {
    it('should convert wikidata date to ISO date', function (done) {
      wikidataTimeToISOString('+1885-05-22T00:00:00Z')
      .should.equal('1885-05-22T00:00:00.000Z')

      wikidataTimeToISOString('+0180-03-17T00:00:00Z')
      .should.equal('0180-03-17T00:00:00.000Z')

      wikidataTimeToISOString('-0398-00-00T00:00:00Z')
      .should.equal('-000398-01-01T00:00:00.000Z')

      wikidataTimeToISOString('-34000-00-00T00:00:00Z')
      .should.equal('-034000-01-01T00:00:00.000Z')

      done()
    })

    it('should return a valid time for possible invalid dates', function (done) {
      wikidataTimeToISOString('+1953-00-00T00:00:00Z')
      .should.equal('1953-01-01T00:00:00.000Z')
      done()
    })

    it('should return a valid time even for possible invalid negative date', function (done) {
      wikidataTimeToISOString('-1953-00-00T00:00:00Z')
      .should.equal('-001953-01-01T00:00:00.000Z')
      done()
    })

    it('should return a valid time for dates far in the past', function (done) {
      wikidataTimeToISOString('-13798000000-00-00T00:00:00Z')
      .should.equal('-13798000000-01-01T00:00:00Z')

      wikidataTimeToISOString('-13798000000-02-07T15:00:00Z')
      .should.equal('-13798000000-02-07T15:00:00Z')
      done()
    })

    it('should accept a value object', function (done) {
      wikidataTimeToISOString(Q970917.claims.P569[0].mainsnak.datavalue.value)
      .should.equal('1869-11-01T00:00:00.000Z')
      done()
    })
  })

  describe('wikidataTimeToSimpleDay', function () {
    it('should convert wikidata date with year precision to simple-day', function (done) {
      wikidataTimeToSimpleDay('+1953-00-00T00:00:00Z').should.equal('1953')
      wikidataTimeToSimpleDay('-1953-00-00T00:00:00Z').should.equal('-1953')
      wikidataTimeToSimpleDay('+13-00-00T00:00:00Z').should.equal('13')
      wikidataTimeToSimpleDay('-13-00-00T00:00:00Z').should.equal('-13')
      wikidataTimeToSimpleDay('-0100-00-00T00:00:00Z').should.equal('-100')
      done()
    })

    it('should convert wikidata date with month precision to simple-day', function (done) {
      wikidataTimeToSimpleDay('+1953-01-00T00:00:00Z').should.equal('1953-01')
      wikidataTimeToSimpleDay('-1953-01-00T00:00:00Z').should.equal('-1953-01')
      wikidataTimeToSimpleDay('+13-01-00T00:00:00Z').should.equal('13-01')
      wikidataTimeToSimpleDay('-13-01-00T00:00:00Z').should.equal('-13-01')
      wikidataTimeToSimpleDay('-0044-03-00T00:00:00Z').should.equal('-44-03')
      done()
    })

    it('should convert wikidata date with day precision or finer to simple-day', function (done) {
      wikidataTimeToSimpleDay('+1953-01-01T00:00:00Z').should.equal('1953-01-01')
      wikidataTimeToSimpleDay('-1953-01-01T00:00:00Z').should.equal('-1953-01-01')
      wikidataTimeToSimpleDay('+1953-01-01T13:45:00Z').should.equal('1953-01-01')
      wikidataTimeToSimpleDay('-1953-01-01T13:45:00Z').should.equal('-1953-01-01')
      wikidataTimeToSimpleDay('-0044-03-01T00:00:00Z').should.equal('-44-03-01')
      done()
    })

    it('should accept a value object', function (done) {
      wikidataTimeToSimpleDay(Q970917.claims.P569[0].mainsnak.datavalue.value)
      .should.equal('1869-11')
      done()
    })
  })

  describe('isEntityId', function () {
    it('should accept both item and property ids', function (done) {
      isEntityId('Q571').should.be.true()
      isEntityId('P31').should.be.true()
      isEntityId('31').should.be.false()
      isEntityId(31).should.be.false()
      isEntityId('Z31').should.be.false()
      isEntityId('q31').should.be.false()
      isEntityId('p31').should.be.false()
      done()
    })
  })

  describe('isItemId', function () {
    it('should accept both item and property ids', function (done) {
      isItemId('Q571').should.be.true()
      isItemId('P31').should.be.false()
      isItemId('31').should.be.false()
      isItemId(31).should.be.false()
      isItemId('Z31').should.be.false()
      isItemId('q31').should.be.false()
      isItemId('p31').should.be.false()
      done()
    })
  })

  describe('isPropertyId', function () {
    it('should accept both item and property ids', function (done) {
      isPropertyId('P31').should.be.true()
      isPropertyId('Q571').should.be.false()
      isPropertyId('31').should.be.false()
      isPropertyId(31).should.be.false()
      isPropertyId('Z31').should.be.false()
      isPropertyId('q31').should.be.false()
      isPropertyId('p31').should.be.false()
      done()
    })
  })
})
