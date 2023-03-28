// @ts-nocheck
import { cloneDeep } from 'lodash-es'
import should from 'should'
import { isEntityId, isGuid } from '../src/helpers/helpers.js'
import { simplifySparqlResults } from '../src/helpers/simplify_sparql_results.js'
import { readJsonFile } from './lib/utils.js'
import type { SparqlResults } from '../src/types/sparql.js'

const multiVarsData = readJsonFile('./tests/data/multi_vars_sparql_results.json') as SparqlResults
const noDatatypeData = readJsonFile('./tests/data/no_datatype_sparql_results.json') as SparqlResults
const propertiesList = readJsonFile('./tests/data/properties_list.json') as SparqlResults
const resultsWithLabelsDescriptionsAndAliases = readJsonFile('./tests/data/results_with_labels_descriptions_and_aliases.json') as SparqlResults
const singleVarData = readJsonFile('./tests/data/single_var_sparql_results.json') as SparqlResults
const sparqlResultsWithNestedAssociatedVariables = readJsonFile('./tests/data/sparql_results_with_nested_associated_variables.json') as SparqlResults
const sparqlResultsWithOptionalValues = readJsonFile('./tests/data/sparql_results_with_optional_values.json') as SparqlResults
const sparqlResultsWithStatements = readJsonFile('./tests/data/sparql_results_with_statements.json') as SparqlResults

describe('wikidata simplify SPARQL results', () => {
  describe('common', () => {
    it('should return a plain object', () => {
      should(simplifySparqlResults(singleVarData)).be.an.Array()
      should(simplifySparqlResults(multiVarsData)).be.an.Array()
    })

    it('should parse the input if passed a JSON string', () => {
      const json = JSON.stringify(singleVarData)
      // @ts-expect-error json is a string and not in the object form
      should(simplifySparqlResults(json)).be.an.Array()
      const json2 = JSON.stringify(multiVarsData)
      // @ts-expect-error json is a string and not in the object form
      should(simplifySparqlResults(json2)).be.an.Array()
    })
  })

  it('should return an array of results objects', () => {
    const output = simplifySparqlResults(multiVarsData)
    should(output[0]).be.an.Object()
    should(output[0].entity.value).equal('Q3731207')
    should(output[0].entity.label).equal('Ercole Patti')
    should(output[0].year).equal(1903)
  })

  it('should not throw when the datatype is missing', () => {
    const output = simplifySparqlResults(noDatatypeData)
    should(output[0].year).equal('1937')
  })

  it('should not throw when an optional variable has no result', () => {
    const result = simplifySparqlResults(sparqlResultsWithOptionalValues)[0]
    should(result.composer).be.an.Object()
    should(result.genre).not.be.ok()
  })

  describe('minimize', () => {
    it('should return an array of results values, filtering out blank nodes', () => {
      const output = simplifySparqlResults(singleVarData, { minimize: true })
      should(output[0]).equal('Q112983')
      output.forEach(result => should(isEntityId(result)).be.true())
    })

    it('should return an array of results value object', () => {
      const output = simplifySparqlResults(singleVarData, { minimize: false })
      should(output[0]).deepEqual({ genre: 'Q112983' })
      output.forEach(result => {
        should(result).be.an.Object()
        if (result.genre) should(isEntityId(result.genre)).be.true()
      })
    })
  })

  describe('with associated variables', () => {
    it('should add labels, descriptions and aliases', () => {
      const results = simplifySparqlResults(resultsWithLabelsDescriptionsAndAliases)
      resultsWithLabelsDescriptionsAndAliases.results.bindings.forEach((rawResult, i) => {
        const simplified = results[i]
        should(simplified.item).be.an.Object()
        should(simplified.item.value).be.a.String()
        if (rawResult.itemLabel) should(simplified.item.label).be.a.String()
        if (rawResult.itemDescription) should(simplified.item.description).be.a.String()
        if (rawResult.itemAltLabel) should(simplified.item.aliases).be.a.String()
        should(simplified.itemLabel).not.be.ok()
        should(simplified.itemDescription).not.be.ok()
        should(simplified.itemAltLabel).not.be.ok()
        should(simplified.pseudonyme).a.String()
      })
    })

    it('should add some non-standard associated variables', () => {
      const results = simplifySparqlResults(propertiesList)
      propertiesList.results.bindings.forEach((rawResult, i) => {
        const simplified = results[i]
        should(simplified.property).be.an.Object()
        should(simplified.property.value).be.a.String()
        if (rawResult.propertyType) should(simplified.property.type).be.a.String()
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
        should(simplified.item).be.an.Object()
        should(simplified.item.value).be.a.String()
        if (rawResult.itemDescription) should(simplified.item.description).be.a.String()
        if (rawResult.itemAltLabel) should(simplified.item.aliases).be.a.String()
        should(simplified.pseudonyme).a.String()
      })
    })

    it("should be ignored when the associated variable isn't selected", () => {
      const rawResults = cloneDeep(resultsWithLabelsDescriptionsAndAliases)
      rawResults.head.vars = rawResults.head.vars
        .filter(varName => varName !== 'item')
      const results = simplifySparqlResults(rawResults)
      rawResults.results.bindings.forEach((rawResult, i) => {
        const simplified = results[i]
        should(simplified.pseudonyme).be.a.String()
        should(simplified.item).not.be.ok()
        if (rawResult.itemLabel) should(simplified.itemLabel).be.a.String()
        if (rawResult.itemDescription) should(simplified.itemDescription).be.a.String()
        if (rawResult.itemAltLabel) should(simplified.itemAltLabel).be.a.String()
        should(simplified.pseudonyme).a.String()
      })
    })

    it('should ignore nested associated variables', () => {
      const rawResults = cloneDeep(sparqlResultsWithNestedAssociatedVariables)
      const results = simplifySparqlResults(rawResults, { minimize: true })
      should(results.length).equal(2)
    })
  })

  describe('statements', () => {
    it('should convert statement URIs into claims GUIDs', () => {
      const rawResults = cloneDeep(sparqlResultsWithStatements)
      const results = simplifySparqlResults(rawResults, { minimize: true })
      results.forEach(result => should(isGuid(result)).be.true())
    })
  })
})
