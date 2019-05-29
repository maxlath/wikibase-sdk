require('should')
const Q571 = require('./data/Q571.json')
const _ = require('lodash')

const { simplifyEntity, simplifyEntities } = require('../lib/helpers/simplify_entity')

describe('simplify.entity', () => {
  it('should be a function', done => {
    simplifyEntity.should.be.a.Function()
    done()
  })

  it('should return a simplified entity', done => {
    const Q571Clone = _.cloneDeep(Q571)
    const simplifiedEntity = simplifyEntity(Q571Clone)
    simplifiedEntity.labels.fr.should.equal('livre')
    simplifiedEntity.descriptions.fr.should.equal('document écrit formé de pages reliées entre elles')
    simplifiedEntity.aliases.pl.should.be.an.Array()
    simplifiedEntity.aliases.pl[0].should.equal('Tom')
    simplifiedEntity.claims.P279.should.be.an.Array()
    simplifiedEntity.claims.P279[0].should.equal('Q2342494')
    simplifiedEntity.sitelinks.afwiki.should.equal('Boek')
    done()
  })

  it('should pass options down to subfunctions', done => {
    const Q571Clone = _.cloneDeep(Q571)
    const simplifiedEntity = simplifyEntity(Q571Clone, { keepQualifiers: true, keepIds: true, addUrl: true })
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

  it('should accept partial entities', done => {
    const Q571Clone = _.cloneDeep(Q571)
    const emptyEntity = simplifyEntity({})
    Object.keys(emptyEntity).length.should.equal(3)
    const partialEntity = simplifyEntity(_.pick(Q571Clone, 'id', 'type', 'labels'))
    Object.keys(partialEntity).length.should.equal(4)
    partialEntity.labels.should.be.an.Object()
    partialEntity.labels.fr.should.equal('livre')
    done()
  })
})

describe('simplify.entities', () => {
  it('should accept enities objects', done => {
    const Q571Clone = _.cloneDeep(Q571)
    const entities = { Q571: Q571Clone }
    const simplifiedEntities = simplifyEntities(entities)
    simplifiedEntities.Q571.labels.fr.should.equal('livre')
    simplifiedEntities.Q571.descriptions.fr.should.equal('document écrit formé de pages reliées entre elles')
    simplifiedEntities.Q571.aliases.pl.should.be.an.Array()
    simplifiedEntities.Q571.aliases.pl[0].should.equal('Tom')
    simplifiedEntities.Q571.claims.P279.should.be.an.Array()
    simplifiedEntities.Q571.claims.P279[0].should.equal('Q2342494')
    simplifiedEntities.Q571.sitelinks.afwiki.should.equal('Boek')
    done()
  })
})
