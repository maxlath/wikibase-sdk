const should = require('should')
const Q571 = require('./data/Q571.json')
const { objLenght } = require('./lib/utils')
const simplify = require('../lib/helpers/simplify_text_attributes')
const simplifyLabels = simplify.labels
const simplifyDescriptions = simplify.descriptions
const simplifyAliases = simplify.aliases

describe('simplifyLabels', () => {
  it('should simplify labels', done => {
    const simplifiedLabels = simplifyLabels(Q571.labels)
    simplifiedLabels.en.should.equal('book')
    simplifiedLabels.fr.should.equal('livre')
    objLenght(simplifiedLabels).should.equal(objLenght(Q571.labels))
    done()
  })
  it('should create a different object', done => {
    should(simplifyLabels(Q571.labels) === Q571.labels).be.false()
    done()
  })
})

describe('simplifyDescriptions', () => {
  it('should simplify descriptions', done => {
    const simplifiedDescriptions = simplifyDescriptions(Q571.descriptions)
    simplifiedDescriptions.en.slice(0, 23).should.equal('medium for a collection')
    simplifiedDescriptions.fr.slice(0, 14).should.equal('document écrit')
    objLenght(simplifiedDescriptions).should.equal(objLenght(Q571.descriptions))
    done()
  })
  it('should create a different object', done => {
    should(simplifyLabels(Q571.descriptions) === Q571.descriptions).be.false()
    done()
  })
})

describe('simplifyAliases', () => {
  it('should simplify aliases', done => {
    const simplifiedAliases = simplifyAliases(Q571.aliases)
    objLenght(simplifiedAliases.en).should.equal(objLenght(Q571.aliases.en))
    objLenght(simplifiedAliases.fr).should.equal(objLenght(Q571.aliases.fr))
    simplifiedAliases.en[0].should.equal('books')
    simplifiedAliases.fr[0].should.equal('ouvrage')
    objLenght(simplifiedAliases).should.equal(objLenght(Q571.aliases))
    done()
  })
  it('should create a different object', done => {
    should(simplifyAliases(Q571.aliases) === Q571.aliases).be.false()
    done()
  })
})
