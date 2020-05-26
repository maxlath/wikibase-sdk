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

  it('should create a different object', () => {
    should(simplifySitelinks(Q571.sitelinks) === Q571.sitelinks).be.false()
  })

  it('should return an object with a URL if requested ', () => {
    simplifySitelinks(Q571.sitelinks, { addUrl: true }).enwiki.url.should.equal('https://en.wikipedia.org/wiki/Book')
  })
})
