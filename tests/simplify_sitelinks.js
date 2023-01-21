const should = require('should')
const Q571 = require('./data/Q571.json')
const { objLenght } = require('./lib/utils')

const simplifySitelinks = require('../lib/helpers/simplify_sitelinks')

describe('simplify.sitelinks', () => {
  it('should simplify sitelinks', () => {
    const simplifiedSitelinks = simplifySitelinks(Q571.sitelinks)
    simplifiedSitelinks.enwiki.should.equal('Book')
    simplifiedSitelinks.frwiki.should.equal('Livre (document)')
    objLenght(simplifiedSitelinks).should.equal(objLenght(Q571.sitelinks))
  })

  it('should preserve badges if requested with keepBadges=true', () => {
    const simplifiedSitelinks = simplifySitelinks(Q571.sitelinks, { keepBadges: true })
    simplifiedSitelinks.enwiki.title.should.equal('Book')
    simplifiedSitelinks.enwiki.badges.should.deepEqual([])
    simplifiedSitelinks.lawiki.title.should.equal('Liber')
    simplifiedSitelinks.lawiki.badges.should.deepEqual([ 'Q17437796' ])
  })

  it('should preserve badges if requested with keepAll=true', () => {
    const simplifiedSitelinks = simplifySitelinks(Q571.sitelinks, { keepBadges: true })
    simplifiedSitelinks.enwiki.title.should.equal('Book')
    simplifiedSitelinks.enwiki.badges.should.deepEqual([])
    simplifiedSitelinks.lawiki.title.should.equal('Liber')
    simplifiedSitelinks.lawiki.badges.should.deepEqual([ 'Q17437796' ])
  })

  it('should create a different object', () => {
    should(simplifySitelinks(Q571.sitelinks) === Q571.sitelinks).be.false()
  })

  it('should return an object with a URL if requested ', () => {
    simplifySitelinks(Q571.sitelinks, { addUrl: true }).enwiki.url.should.equal('https://en.wikipedia.org/wiki/Book')
  })

  it('should not throw when a sitelink is null ', () => {
    const sitelinks = { frwiki: null }
    simplifySitelinks(sitelinks).should.deepEqual(sitelinks)
  })
})
