const should = require('should')

const helpers = require('../lib/helpers/helpers')
const simplify = require('../lib/helpers/simplify_sparql_results')
const singleVarData = require('./data/single_var_sparql_results.json')
const multiVarsData = require('./data/multi_vars_sparql_results.json')
const noDatatypeData = require('./data/no_datatype_sparql_results.json')
const sparqlResultsWithOptionalValues = require('./data/sparql_results_with_optional_values.json')
const sparqlResultsWithStatements = require('./data/sparql_results_with_statements.json')
const sparqlResultsWithNestedAssociatedVariables = require('./data/sparql_results_with_nested_associated_variables.json')
const resultsWithLabelsDescriptionsAndAliases = require('./data/results_with_labels_descriptions_and_aliases.json')
const propertiesList = require('./data/properties_list.json')
const { cloneDeep } = require('lodash')

describe('wikidata simplify SPARQL results', () => {
  describe('common', () => {
    it('should return a plain object', () => {
      simplify(singleVarData).should.be.an.Array()
      simplify(multiVarsData).should.be.an.Array()
    })

    it('should parse the input if passed a JSON string', () => {
      const json = JSON.stringify(singleVarData)
      simplify(json).should.be.an.Array()
      const json2 = JSON.stringify(multiVarsData)
      simplify(json2).should.be.an.Array()
    })
  })

  it('should return an array of results objects', () => {
    const output = simplify(multiVarsData)
    output[0].should.be.an.Object()
    output[0].entity.value.should.equal('Q3731207')
    output[0].entity.label.should.equal('Ercole Patti')
    output[0].year.should.equal(1903)
  })

  it('should not throw when the datatype is missing', () => {
    const output = simplify(noDatatypeData)
    output[0].year.should.equal('1937')
  })

  it('should not throw when an optional variable has no result', () => {
    const result = simplify(sparqlResultsWithOptionalValues)[0]
    result.composer.should.be.an.Object()
    should(result.genre).not.be.ok()
  })

  describe('minimize', () => {
    it('should return an array of results values, filtering out blank nodes', () => {
      const output = simplify(singleVarData, { minimize: true })
      output[0].should.equal('Q112983')
      output.forEach(result => helpers.isEntityId(result).should.be.true())
    })

    it('should return an array of results value object', () => {
      const output = simplify(singleVarData, { minimize: false })
      output[0].should.deepEqual({ genre: 'Q112983' })
      output.forEach(result => {
        result.should.be.an.Object()
        if (result.genre) helpers.isEntityId(result.genre).should.be.true()
      })
    })
  })

  describe('with associated variables', () => {
    it('should add labels, descriptions and aliases', () => {
      const results = simplify(resultsWithLabelsDescriptionsAndAliases)
      resultsWithLabelsDescriptionsAndAliases.results.bindings.forEach((rawResult, i) => {
        const simplified = results[i]
        simplified.item.should.be.an.Object()
        simplified.item.value.should.be.a.String()
        if (rawResult.itemLabel) simplified.item.label.should.be.a.String()
        if (rawResult.itemDescription) simplified.item.description.should.be.a.String()
        if (rawResult.itemAltLabel) simplified.item.aliases.should.be.a.String()
        should(simplified.itemLabel).not.be.ok()
        should(simplified.itemDescription).not.be.ok()
        should(simplified.itemAltLabel).not.be.ok()
        simplified.pseudonyme.should.a.String()
      })
    })

    it('should add some non-standard associated variables', () => {
      const results = simplify(propertiesList)
      propertiesList.results.bindings.forEach((rawResult, i) => {
        const simplified = results[i]
        simplified.property.should.be.an.Object()
        simplified.property.value.should.be.a.String()
        if (rawResult.propertyType) simplified.property.type.should.be.a.String()
        should(simplified.propertyType).not.be.ok()
      })
    })

    it('should work without labels', () => {
      const rawResults = cloneDeep(resultsWithLabelsDescriptionsAndAliases)
      rawResults.head.vars = rawResults.head.vars
        .filter(varName => varName !== 'itemLabel')
      const results = simplify(rawResults)
      rawResults.results.bindings.forEach((rawResult, i) => {
        const simplified = results[i]
        simplified.item.should.be.an.Object()
        simplified.item.value.should.be.a.String()
        if (rawResult.itemDescription) simplified.item.description.should.be.a.String()
        if (rawResult.itemAltLabel) simplified.item.aliases.should.be.a.String()
        simplified.pseudonyme.should.a.String()
      })
    })

    it("should be ignored when the associated variable isn't selected", () => {
      const rawResults = cloneDeep(resultsWithLabelsDescriptionsAndAliases)
      rawResults.head.vars = rawResults.head.vars
        .filter(varName => varName !== 'item')
      const results = simplify(rawResults)
      rawResults.results.bindings.forEach((rawResult, i) => {
        const simplified = results[i]
        simplified.pseudonyme.should.be.a.String()
        should(simplified.item).not.be.ok()
        if (rawResult.itemLabel) simplified.itemLabel.should.be.a.String()
        if (rawResult.itemDescription) simplified.itemDescription.should.be.a.String()
        if (rawResult.itemAltLabel) simplified.itemAltLabel.should.be.a.String()
        simplified.pseudonyme.should.a.String()
      })
    })

    it('should ignore nested associated variables', () => {
      const rawResults = cloneDeep(sparqlResultsWithNestedAssociatedVariables)
      const results = simplify(rawResults, { minimize: true })
      results.length.should.equal(2)
    })
  })

  describe('statements', () => {
    it('should convert statement URIs into claims GUIDs', () => {
      const rawResults = cloneDeep(sparqlResultsWithStatements)
      const results = simplify(rawResults, { minimize: true })
      results.forEach(result => helpers.isGuid(result).should.be.true())
    })
  })
})
