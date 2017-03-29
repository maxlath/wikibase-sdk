require('should')

const helpers = require('../lib/helpers/helpers')

describe('helpers', function () {
  it('env', function (done) {
    helpers.should.be.an.Object()
    done()
  })

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
      helpers.wikidataTimeToEpochTime(wdTime).should.be.a.Number()
      done()
    })

    it('should return a number for negative time', function (done) {
      helpers.wikidataTimeToEpochTime(negativeWdTime).should.be.a.Number()
      done()
    })

    it('should return the right number', function (done) {
      helpers.wikidataTimeToEpochTime(wdTime).should.equal(epoch)
      done()
    })

    it('should return the right number for negative time too', function (done) {
      helpers.wikidataTimeToEpochTime(negativeWdTime).should.equal(negativeEpoch)
      done()
    })
  })
  describe('wikidataTimeToISOString', function () {
    it('should convert wikidata date to ISO date', function (done) {
      helpers.wikidataTimeToISOString('+1885-05-22T00:00:00Z')
      .should.equal('1885-05-22T00:00:00.000Z')

      helpers.wikidataTimeToISOString('+0180-03-17T00:00:00Z')
      .should.equal('0180-03-17T00:00:00.000Z')

      helpers.wikidataTimeToISOString('-0398-00-00T00:00:00Z')
      .should.equal('-000398-01-01T00:00:00.000Z')
      done()
    })

    it('should return a valid time for possible invalid dates', function (done) {
      helpers.wikidataTimeToISOString('+1953-00-00T00:00:00Z')
      .should.equal('1953-01-01T00:00:00.000Z')
      done()
    })

    it('should return a valid time even for possible invalid negative date', function (done) {
      helpers.wikidataTimeToISOString('-1953-00-00T00:00:00Z')
      .should.equal('-001953-01-01T00:00:00.000Z')
      done()
    })

    it('should return a valid time for dates far in the past', function (done) {
      helpers.wikidataTimeToISOString('-13798000000-00-00T00:00:00Z')
      .should.equal('-13798000000-00-00T00:00:00Z')
      done()
    })
  })
  describe('isEntityId', function () {
    it('should accept both item and property ids', function (done) {
      helpers.isEntityId('Q571').should.be.true()
      helpers.isEntityId('P31').should.be.true()
      helpers.isEntityId('31').should.be.false()
      helpers.isEntityId(31).should.be.false()
      helpers.isEntityId('Z31').should.be.false()
      helpers.isEntityId('q31').should.be.false()
      helpers.isEntityId('p31').should.be.false()
      done()
    })
  })
  describe('isItemId', function () {
    it('should accept both item and property ids', function (done) {
      helpers.isItemId('Q571').should.be.true()
      helpers.isItemId('P31').should.be.false()
      helpers.isItemId('31').should.be.false()
      helpers.isItemId(31).should.be.false()
      helpers.isItemId('Z31').should.be.false()
      helpers.isItemId('q31').should.be.false()
      helpers.isItemId('p31').should.be.false()
      done()
    })
  })
  describe('isPropertyId', function () {
    it('should accept both item and property ids', function (done) {
      helpers.isPropertyId('P31').should.be.true()
      helpers.isPropertyId('Q571').should.be.false()
      helpers.isPropertyId('31').should.be.false()
      helpers.isPropertyId(31).should.be.false()
      helpers.isPropertyId('Z31').should.be.false()
      helpers.isPropertyId('q31').should.be.false()
      helpers.isPropertyId('p31').should.be.false()
      done()
    })
  })
})
