// @ts-nocheck
import { cloneDeep } from 'lodash-es'
import should from 'should'
import { isEntityId, isGuid } from '../src/helpers/helpers.js'
import { simplifySparqlResults } from '../src/helpers/simplify_sparql_results.js'
import { readJsonFile } from './lib/utils.js'

const multiVarsData = readJsonFile('./tests/data/multi_vars_sparql_results.json')
const noDatatypeData = readJsonFile('./tests/data/no_datatype_sparql_results.json')
const propertiesList = readJsonFile('./tests/data/properties_list.json')
const resultsWithLabelsDescriptionsAndAliases = readJsonFile('./tests/data/results_with_labels_descriptions_and_aliases.json')
const singleVarData = readJsonFile('./tests/data/single_var_sparql_results.json')
const sparqlResultsWithNestedAssociatedVariables = readJsonFile('./tests/data/sparql_results_with_nested_associated_variables.json')
const sparqlResultsWithOptionalValues = readJsonFile('./tests/data/sparql_results_with_optional_values.json')
const sparqlResultsWithStatements = readJsonFile('./tests/data/sparql_results_with_statements.json')

describe('wikidata simplify SPARQL results', () => {
  describe('common', () => {
    it('should return a plain object', () => {
      simplifySparqlResults(singleVarData).should.be.an.Array()
      simplifySparqlResults(multiVarsData).should.be.an.Array()
    })

    it('should parse the input if passed a JSON string', () => {
      const json = JSON.stringify(singleVarData)
      simplifySparqlResults(json).should.be.an.Array()
      const json2 = JSON.stringify(multiVarsData)
      simplifySparqlResults(json2).should.be.an.Array()
    })
  })

  it('should return an array of results objects', () => {
    const output = simplifySparqlResults(multiVarsData)
    output[0].should.be.an.Object()
    output[0].entity.value.should.equal('Q3731207')
    output[0].entity.label.should.equal('Ercole Patti')
    output[0].year.should.equal(1903)
  })

  it('should not throw when the datatype is missing', () => {
    const output = simplifySparqlResults(noDatatypeData)
    output[0].year.should.equal('1937')
  })

  it('should not throw when an optional variable has no result', () => {
    const result = simplifySparqlResults(sparqlResultsWithOptionalValues)[0]
    result.composer.should.be.an.Object()
    should(result.genre).not.be.ok()
  })

  describe('minimize', () => {
    it('should return an array of results values, filtering out blank nodes', () => {
      const output = simplifySparqlResults(singleVarData, { minimize: true })
      output[0].should.equal('Q112983')
      output.forEach(result => isEntityId(result).should.be.true())
    })

    it('should return an array of results value object', () => {
      const output = simplifySparqlResults(singleVarData, { minimize: false })
      output[0].should.deepEqual({ genre: 'Q112983' })
      output.forEach(result => {
        result.should.be.an.Object()
        if (result.genre) isEntityId(result.genre).should.be.true()
      })
    })
  })

  describe('with associated variables', () => {
    it('should add labels, descriptions and aliases', () => {
      const results = simplifySparqlResults(resultsWithLabelsDescriptionsAndAliases)
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
      const results = simplifySparqlResults(propertiesList)
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
      const results = simplifySparqlResults(rawResults)
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
      const results = simplifySparqlResults(rawResults)
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
      const results = simplifySparqlResults(rawResults, { minimize: true })
      results.length.should.equal(2)
    })
  })

  describe('statements', () => {
    it('should convert statement URIs into claims GUIDs', () => {
      const rawResults = cloneDeep(sparqlResultsWithStatements)
      const results = simplifySparqlResults(rawResults, { minimize: true })
      results.forEach(result => isGuid(result).should.be.true())
    })
  })
})
