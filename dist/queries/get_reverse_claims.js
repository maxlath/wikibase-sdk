import { isItemId } from '../helpers/helpers.js';
import * as validate from '../helpers/validate.js';
import { forceArray } from '../utils/utils.js';
import { sparqlQueryFactory } from './sparql_query.js';
// Fiter-out properties. Can't be filtered by
// `?subject a wikibase:Item`, as those triples are omitted
// https://www.mediawiki.org/wiki/Wikibase/Indexing/RDF_Dump_Format#WDQS_data_differences
const itemsOnly = 'FILTER NOT EXISTS { ?subject rdf:type wikibase:Property . } ';
export const getReverseClaimsFactory = (sparqlEndpoint) => {
    const sparqlQuery = sparqlQueryFactory(sparqlEndpoint);
    return function getReverseClaims(options) {
        let { properties } = options;
        const { values, limit, caseInsensitive, keepProperties } = options;
        const valueFn = caseInsensitive ? caseInsensitiveValueQuery : directValueQuery;
        const filter = keepProperties ? '' : itemsOnly;
        // Allow to request values for several properties at once
        properties = forceArray(properties);
        properties.forEach(o => validate.propertyId(o));
        const valueBlock = getValueBlock(values, valueFn, properties, filter);
        let sparql = `SELECT DISTINCT ?subject WHERE { ${valueBlock} }`;
        if (limit)
            sparql += ` LIMIT ${limit}`;
        return sparqlQuery(sparql);
    };
};
const getValueBlock = (values, valueFn, properties, filter) => {
    properties = properties.map(prefixifyProperty).join('|');
    if (!(values instanceof Array)) {
        return valueFn(properties, getValueString(values), filter);
    }
    const valuesBlocks = values
        .map(getValueString)
        .map(valStr => valueFn(properties, valStr, filter));
    return '{ ' + valuesBlocks.join('} UNION {') + ' }';
};
const getValueString = value => {
    if (isItemId(value)) {
        value = `wd:${value}`;
    }
    else if (typeof value === 'string') {
        value = `'${value}'`;
    }
    return value;
};
const directValueQuery = (properties, value, filter) => {
    return `?subject ${properties} ${value} .
    ${filter}`;
};
// Discussion on how to make this query optimal:
// http://stackoverflow.com/q/43073266/3324977
const caseInsensitiveValueQuery = (properties, value, filter) => {
    return `?subject ${properties} ?value .
    FILTER (lcase(?value) = ${value.toLowerCase()})
    ${filter}`;
};
const prefixifyProperty = property => 'wdt:' + property;
//# sourceMappingURL=get_reverse_claims.js.map