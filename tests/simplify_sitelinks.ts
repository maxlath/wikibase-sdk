// @ts-nocheck
import should from 'should'
import { simplifySitelinks } from '../src/helpers/simplify_sitelinks.js'
import { readJsonFile, objLenght } from './lib/utils.js'
import type { Item } from '../src/types/entity.js'

const Q571 = readJsonFile('./tests/data/Q571.json') as Item

describe('simplify.sitelinks', () => {
  it('should simplify sitelinks', () => {
    const simplifiedSitelinks = simplifySitelinks(Q571.sitelinks)
    should(simplifiedSitelinks.enwiki).equal('Book')
    should(simplifiedSitelinks.frwiki).equal('Livre (document)')
    should(objLenght(simplifiedSitelinks)).equal(objLenght(Q571.sitelinks))
  })

  it('should preserve badges if requested with keepBadges=true', () => {
    const simplifiedSitelinks = simplifySitelinks(Q571.sitelinks, { keepBadges: true })
    should(simplifiedSitelinks.enwiki.title).equal('Book')
    should(simplifiedSitelinks.enwiki.badges).deepEqual([])
    should(simplifiedSitelinks.lawiki.title).equal('Liber')
    should(simplifiedSitelinks.lawiki.badges).deepEqual([ 'Q17437796' ])
  })

  it('should preserve badges if requested with keepAll=true', () => {
    const simplifiedSitelinks = simplifySitelinks(Q571.sitelinks, { keepBadges: true })
    should(simplifiedSitelinks.enwiki.title).equal('Book')
    should(simplifiedSitelinks.enwiki.badges).deepEqual([])
    should(simplifiedSitelinks.lawiki.title).equal('Liber')
    should(simplifiedSitelinks.lawiki.badges).deepEqual([ 'Q17437796' ])
  })

  it('should create a different object', () => {
    should(simplifySitelinks(Q571.sitelinks) === Q571.sitelinks).be.false()
  })

  it('should return an object with a URL if requested ', () => {
    should(simplifySitelinks(Q571.sitelinks, { addUrl: true }).enwiki.url).equal('https://en.wikipedia.org/wiki/Book')
  })

  it('should not throw when a sitelink is null ', () => {
    const sitelinks = { frwiki: null }
    should(simplifySitelinks(sitelinks)).deepEqual(sitelinks)
  })
})
