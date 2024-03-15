import { isPlainObject, uniq } from '../utils/utils.js';
import { parseSnak } from './parse_snak.js';
import { truthyPropertyClaims, nonDeprecatedPropertyClaims } from './rank.js';
/**
 * Tries to replace wikidata deep snak object by a simple value
 * e.g. a string, an entity Qid or an epoch time number
 * Expects a single snak object
 * Ex: entity.claims.P369[0]
 */
export function simplifySnak(snak, options = {}) {
    const { keepTypes, keepSnaktypes, keepHashes } = parseKeepOptions(options);
    let value;
    const { datatype, datavalue, snaktype, hash } = snak;
    if (datavalue) {
        value = parseSnak(datatype, datavalue, options);
    }
    else {
        if (snaktype === 'somevalue')
            value = options.somevalueValue;
        else if (snaktype === 'novalue')
            value = options.novalueValue;
        else
            throw new Error('no datavalue or special snaktype found');
    }
    // No need to test keepHashes as it has no effect if neither
    // keepQualifiers or keepReferences is true
    if (keepTypes || keepSnaktypes || keepHashes) {
        // When keeping qualifiers or references, the value becomes an object
        // instead of a direct value
        const valueObj = { value };
        if (keepTypes)
            valueObj.type = datatype;
        if (keepSnaktypes)
            valueObj.snaktype = snaktype;
        if (keepHashes)
            valueObj.hash = hash;
        return valueObj;
    }
    else {
        return value;
    }
}
export function simplifyClaim(claim, options = {}) {
    const { keepQualifiers, keepReferences, keepIds, keepTypes, keepSnaktypes, keepRanks } = parseKeepOptions(options);
    const { mainsnak, rank } = claim;
    const value = simplifySnak(mainsnak, options);
    // No need to test keepHashes as it has no effect if neither
    // keepQualifiers or keepReferences is true
    if (!(keepQualifiers || keepReferences || keepIds || keepTypes || keepSnaktypes || keepRanks)) {
        return value;
    }
    // When keeping other attributes, the value becomes an object instead of a direct value
    let valueObj = { value };
    if (isPlainObject(value) && 'value' in value) {
        valueObj = value;
    }
    else {
        valueObj = { value };
    }
    if (keepRanks)
        valueObj.rank = rank;
    if (keepQualifiers) {
        valueObj.qualifiers = simplifyQualifiers(claim.qualifiers, options);
    }
    if (keepReferences) {
        claim.references = claim.references || [];
        valueObj.references = simplifyReferences(claim.references, options);
    }
    if (keepIds)
        valueObj.id = claim.id;
    return valueObj;
}
export function simplifyClaims(claims, options = {}) {
    return applyObjectSimplification(claims, simplifyPropertyClaims, options);
}
export function simplifyPropertyClaims(propertyClaims, options = {}) {
    // Avoid to throw on empty inputs to allow to simplify claims array
    // without having to know if the entity as claims for this property
    // Ex: simplifyPropertyClaims(entity.claims.P124211616)
    if (propertyClaims == null || propertyClaims.length === 0)
        return [];
    const { keepNonTruthy, keepNonDeprecated } = parseKeepOptions(options);
    if (keepNonDeprecated) {
        propertyClaims = nonDeprecatedPropertyClaims(propertyClaims);
    }
    else if (!(keepNonTruthy)) {
        propertyClaims = truthyPropertyClaims(propertyClaims);
    }
    return applyArraySimplification(propertyClaims, simplifyClaim, options);
}
export function simplifySnaks(snaks = {}, options = {}) {
    return applyObjectSimplification(snaks, simplifyPropertySnaks, options);
}
export function simplifyPropertySnaks(propertySnaks, options = {}) {
    if (propertySnaks == null || propertySnaks.length === 0)
        return [];
    return applyArraySimplification(propertySnaks, simplifySnak, options);
}
function applyObjectSimplification(obj, simplifyFn, options) {
    const { propertyPrefix } = options;
    const simplified = {};
    for (let [propertyId, propertyArray] of Object.entries(obj)) {
        if (propertyPrefix) {
            propertyId = propertyPrefix + ':' + propertyId;
        }
        simplified[propertyId] = simplifyFn(propertyArray, options);
    }
    return simplified;
}
function applyArraySimplification(array, simplifyFn, options) {
    const simplifiedArray = array
        .map(claimOrSnak => simplifyFn(claimOrSnak, options))
        // Filter-out novalue and somevalue claims,
        // unless a novalueValue or a somevalueValue is passed in options
        // Considers null as defined
        .filter(obj => obj !== undefined);
    // Deduplicate values unless we return a rich value object
    if (simplifiedArray[0] && typeof simplifiedArray[0] !== 'object') {
        return uniq(simplifiedArray);
    }
    else {
        return simplifiedArray;
    }
}
export function simplifyQualifiers(qualifiers, options = {}) {
    return simplifySnaks(qualifiers, options);
}
export function simplifyPropertyQualifiers(propertyQualifiers, options = {}) {
    return simplifyPropertySnaks(propertyQualifiers, options);
}
export function simplifyQualifier(qualifier, options = {}) {
    return simplifySnak(qualifier, options);
}
export function simplifyReferences(references, options = {}) {
    return references.map(reference => simplifyReference(reference, options));
}
export function simplifyReference(reference, options = {}) {
    const snaks = simplifySnaks(reference.snaks, options);
    if (options.keepHashes)
        return { snaks, hash: reference.hash };
    else
        return snaks;
}
/** @deprecated use the new function name simplifyReference instead */
export const simplifyReferenceRecord = simplifyReference;
const keepOptions = ['keepQualifiers', 'keepReferences', 'keepIds', 'keepHashes', 'keepTypes', 'keepSnaktypes', 'keepRanks', 'keepRichValues'];
const parseKeepOptions = (options = {}) => {
    if (options.keepAll) {
        for (const optionName of keepOptions) {
            if (options[optionName] == null)
                options[optionName] = true;
        }
    }
    return options;
};
//# sourceMappingURL=simplify_claims.js.map