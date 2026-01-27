import { cloneDeep } from 'lodash-es';
import should from 'should';
import { isEntityId, isGuid } from '../src/helpers/helpers.js';
import { minimizeSimplifiedSparqlResults, simplifySparqlResults } from '../src/helpers/simplify_sparql_results.js';
import { multiVarsData } from './data/multi_vars_sparql_results.js';
import { noDatatypeData } from './data/no_datatype_sparql_results.js';
import { propertiesList } from './data/properties_list.js';
import { resultsWithLabelsDescriptionsAndAliases } from './data/results_with_labels_descriptions_and_aliases.js';
import { singleVarData } from './data/single_var_sparql_results.js';
import { sparqlResultsWithNestedAssociatedVariables } from './data/sparql_results_with_nested_associated_variables.js';
import { sparqlResultsWithOptionalValues } from './data/sparql_results_with_optional_values.js';
import { sparqlResultsWithStatements } from './data/sparql_results_with_statements.js';
import { assert, assertPlainObject } from './lib/utils.js';
describe('wikidata simplify SPARQL results', () => {
    describe('common', () => {
        it('should return a plain object', () => {
            should(simplifySparqlResults(singleVarData)).be.an.Array();
            should(simplifySparqlResults(multiVarsData)).be.an.Array();
        });
        it('should parse the input if passed a JSON string', () => {
            const json = JSON.stringify(singleVarData);
            should(simplifySparqlResults(json)).be.an.Array();
            const json2 = JSON.stringify(multiVarsData);
            should(simplifySparqlResults(json2)).be.an.Array();
        });
        it('should return an array of results value object', () => {
            const output = simplifySparqlResults(singleVarData);
            should(output[0]).deepEqual({ genre: 'Q112983' });
            output.forEach(result => {
                should(result).be.an.Object();
                if (result.genre)
                    should(typeof result.genre === 'string' && isEntityId(result.genre)).be.true();
            });
        });
    });
    it('should return an array of results objects', () => {
        const output = simplifySparqlResults(multiVarsData);
        assertPlainObject(output[0]);
        assert(output[0].entity != null);
        should(output[0].entity.value).equal('Q3731207');
        should(output[0].entity.label).equal('Ercole Patti');
        should(output[0].year).equal(1903);
    });
    it('should not throw when the datatype is missing', () => {
        const output = simplifySparqlResults(noDatatypeData);
        assertPlainObject(output[0]);
        should(output[0].year).equal('1937');
    });
    it('should not throw when an optional variable has no result', () => {
        const result = simplifySparqlResults(sparqlResultsWithOptionalValues)[0];
        assertPlainObject(result);
        should(result.composer).be.an.Object();
        should(result.genre).not.be.ok();
    });
    describe('minimize', () => {
        it('should return an array of results values, filtering out blank nodes', () => {
            const output = minimizeSimplifiedSparqlResults(simplifySparqlResults(singleVarData));
            should(output[0]).equal('Q112983');
            output.forEach(result => should(typeof result === 'string' && isEntityId(result)).be.true());
        });
    });
    describe('with associated variables', () => {
        it('should add labels, descriptions and aliases', () => {
            const results = simplifySparqlResults(resultsWithLabelsDescriptionsAndAliases);
            resultsWithLabelsDescriptionsAndAliases.results.bindings.forEach((rawResult, i) => {
                const simplified = results[i];
                assertPlainObject(simplified);
                assertPlainObject(simplified.item);
                should(simplified.item.value).be.a.String();
                if (rawResult.itemLabel)
                    should(simplified.item.label).be.a.String();
                if (rawResult.itemDescription)
                    should(simplified.item.description).be.a.String();
                if (rawResult.itemAltLabel)
                    should(simplified.item.aliases).be.a.String();
                should(simplified.itemLabel).not.be.ok();
                should(simplified.itemDescription).not.be.ok();
                should(simplified.itemAltLabel).not.be.ok();
                should(simplified.pseudonyme).a.String();
            });
        });
        it('should add some non-standard associated variables', () => {
            const results = simplifySparqlResults(propertiesList);
            propertiesList.results.bindings.forEach((rawResult, i) => {
                const simplified = results[i];
                assertPlainObject(simplified);
                assertPlainObject(simplified.property);
                should(simplified.property.value).be.a.String();
                if (rawResult.propertyType)
                    should(simplified.property.type).be.a.String();
                should(simplified.propertyType).not.be.ok();
            });
        });
        it('should work without labels', () => {
            const rawResults = cloneDeep(resultsWithLabelsDescriptionsAndAliases);
            // @ts-expect-error write to readonly but its cloned testdata
            rawResults.head.vars = rawResults.head.vars
                .filter(varName => varName !== 'itemLabel');
            const results = simplifySparqlResults(rawResults);
            rawResults.results.bindings.forEach((rawResult, i) => {
                const simplified = results[i];
                assertPlainObject(simplified);
                assertPlainObject(simplified.item);
                should(simplified.item.value).be.a.String();
                if (rawResult.itemDescription)
                    should(simplified.item.description).be.a.String();
                if (rawResult.itemAltLabel)
                    should(simplified.item.aliases).be.a.String();
                should(simplified.pseudonyme).a.String();
            });
        });
        it("should be ignored when the associated variable isn't selected", () => {
            const rawResults = cloneDeep(resultsWithLabelsDescriptionsAndAliases);
            // @ts-expect-error write to readonly but its cloned testdata
            rawResults.head.vars = rawResults.head.vars
                .filter(varName => varName !== 'item');
            const results = simplifySparqlResults(rawResults);
            rawResults.results.bindings.forEach((rawResult, i) => {
                const simplified = results[i];
                assertPlainObject(simplified);
                should(simplified.pseudonyme).be.a.String();
                should(simplified.item).not.be.ok();
                if (rawResult.itemLabel)
                    should(simplified.itemLabel).be.a.String();
                if (rawResult.itemDescription)
                    should(simplified.itemDescription).be.a.String();
                if (rawResult.itemAltLabel)
                    should(simplified.itemAltLabel).be.a.String();
                should(simplified.pseudonyme).a.String();
            });
        });
        it('should ignore nested associated variables', () => {
            const rawResults = cloneDeep(sparqlResultsWithNestedAssociatedVariables);
            const results = minimizeSimplifiedSparqlResults(simplifySparqlResults(rawResults));
            should(results.length).equal(2);
        });
    });
    describe('statements', () => {
        it('should convert statement URIs into claims GUIDs', () => {
            const rawResults = cloneDeep(sparqlResultsWithStatements);
            const results = minimizeSimplifiedSparqlResults(simplifySparqlResults(rawResults));
            results.forEach(result => should(typeof result === 'string' && isGuid(result)).be.true());
        });
    });
});
//# sourceMappingURL=simplify_sparql_results.js.map