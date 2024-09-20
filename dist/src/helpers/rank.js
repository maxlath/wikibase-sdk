import { typedEntries } from '../utils/utils.js';
export function truthyPropertyClaims(propertyClaims) {
    const aggregate = {};
    for (const claim of propertyClaims) {
        const { rank } = claim;
        aggregate[rank] = aggregate[rank] || [];
        aggregate[rank].push(claim);
    }
    // on truthyness: https://www.mediawiki.org/wiki/Wikibase/Indexing/RDF_Dump_Format#Truthy_statements
    return aggregate.preferred || aggregate.normal || [];
}
export function nonDeprecatedPropertyClaims(propertyClaims) {
    return propertyClaims.filter(claim => claim.rank !== 'deprecated');
}
export function truthyClaims(claims) {
    const truthClaimsOnly = {};
    for (const [property, value] of typedEntries(claims)) {
        truthClaimsOnly[property] = truthyPropertyClaims(value);
    }
    return truthClaimsOnly;
}
//# sourceMappingURL=rank.js.map