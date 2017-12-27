require('should')
const Q571 = require('./data/Q571.json')
const _ = require('lodash')

const simplifyEntity = require('../lib/helpers/simplify_entity')

describe('simplify.entity', () => {
  it('should be a function', (done) => {
    simplifyEntity.should.be.a.Function()
    done()
  })

  it('should return a simplified entity', (done) => {
    const simplifiedEntity = simplifyEntity(Q571)
    simplifiedEntity.labels.fr.should.equal('livre')
    simplifiedEntity.descriptions.fr.should.equal('document écrit formé de pages reliées entre elles')
    simplifiedEntity.aliases.pl.should.be.an.Array()
    simplifiedEntity.aliases.pl[0].should.equal('Tom')
    simplifiedEntity.claims.P279.should.be.an.Array()
    simplifiedEntity.claims.P279[0].should.equal('Q2342494')
    simplifiedEntity.sitelinks.afwiki.should.equal('Boek')
    done()
  })

  it('should pass options down to subfunctions', (done) => {
    const simplifiedEntity = simplifyEntity(Q571, { keepQualifiers: true, keepIds: true, addUrl: true })
    simplifiedEntity.labels.fr.should.equal('livre')
    simplifiedEntity.descriptions.fr.should.equal('document écrit formé de pages reliées entre elles')
    simplifiedEntity.aliases.pl.should.be.an.Array()
    simplifiedEntity.aliases.pl[0].should.equal('Tom')
    simplifiedEntity.claims.P279.should.be.an.Array()
    simplifiedEntity.claims.P279[0].should.be.an.Object()
    simplifiedEntity.claims.P279[0].value.should.equal('Q2342494')
    simplifiedEntity.sitelinks.afwiki.should.be.an.Object()
    simplifiedEntity.sitelinks.afwiki.title.should.equal('Boek')
    simplifiedEntity.sitelinks.afwiki.url.should.equal('https://af.wikipedia.org/wiki/Boek')
    done()
  })

  it('should accept partial entities', (done) => {
    const emptyEntity = simplifyEntity({})
    Object.keys(emptyEntity).length.should.equal(3)
    const partialEntity = simplifyEntity(_.pick(Q571, 'id', 'type', 'labels'))
    Object.keys(partialEntity).length.should.equal(4)
    partialEntity.labels.should.be.an.Object()
    partialEntity.labels.fr.should.equal('livre')
    done()
  })
})
