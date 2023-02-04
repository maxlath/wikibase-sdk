import { simplifyClaim as claim, simplifyPropertyClaims as propertyClaims, simplifyClaims as claims, simplifyQualifier as qualifier, simplifyPropertyQualifiers as propertyQualifiers, simplifyQualifiers as qualifiers, simplifyReferences as references, } from './simplify_claims.js';
import { simplifyForm as form, simplifyForms as forms, } from './simplify_forms.js';
import { simplifySense as sense, simplifySenses as senses, } from './simplify_senses.js';
import sitelinks from './simplify_sitelinks.js';
import { simplifySparqlResults } from './simplify_sparql_results.js';
import { simplifyLabels as labels, simplifyDescriptions as descriptions, simplifyAliases as aliases, simplifyLemmas as lemmas, simplifyRepresentations as representations, simplifyGlosses as glosses, } from './simplify_text_attributes.js';
export const simplify = {
    labels,
    descriptions,
    aliases,
    claim,
    propertyClaims,
    claims,
    qualifier,
    propertyQualifiers,
    qualifiers,
    references,
    sitelinks,
    // Aliases
    snak: claim,
    propertySnaks: propertyClaims,
    snaks: claims,
    // Lexemes
    lemmas,
    representations,
    glosses,
    form,
    forms,
    sense,
    senses,
    sparqlResults: simplifySparqlResults,
    // Set in ./simplify_entity
    // entity,
    // entities,
};
