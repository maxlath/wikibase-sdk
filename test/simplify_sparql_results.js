/* eslint-env mocha */
require('should')

const helpers = require('../lib/helpers/helpers')
const simplify = require('../lib/queries/simplify_sparql_results')
const singleVarData = require('./data/single_var_sparql_results.json')
const multiVarsData = require('./data/multi_vars_sparql_results.json')
const noDatatypeData = require('./data/no_datatype_sparql_results.json')

describe('wikidata simplify SPARQL results', function () {
  describe('common', function () {
    it('should return a plain object', function (done) {
      simplify(singleVarData).should.be.an.Array()
      simplify(multiVarsData).should.be.an.Array()
      done()
    })

    it('should parse the input if passed a JSON string', function (done) {
      const json = JSON.stringify(singleVarData)
      simplify(json).should.be.an.Array()
      const json2 = JSON.stringify(multiVarsData)
      simplify(json2).should.be.an.Array()
      done()
    })
  })

  describe('single var', function () {
    it('should return an array of results values, filtering out blank nodes', function (done) {
      const output = simplify(singleVarData)
      output[0].should.equal('Q112983')
      output.forEach((result) => helpers.isWikidataId(result).should.be.true())
      done()
    })
  })

  describe('multi vars', function () {
    it('should return an array of results objects', function (done) {
      const output = simplify(multiVarsData)
      output[0].should.be.an.Object()
      output[0].entity.value.should.equal('Q3731207')
      output[0].entity.label.should.equal('Ercole Patti')
      output[0].year.should.equal(1903)
      done()
    })

    it('should not throw when the datatype is missing', function (done) {
      const output = simplify(noDatatypeData)
      output[0].year.should.equal('1937')
      done()
    })
  })
})
