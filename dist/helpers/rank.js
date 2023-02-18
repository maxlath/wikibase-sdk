export function truthyPropertyClaims(propertyClaims) {
    const aggregate = propertyClaims.reduce(aggregatePerRank, {});
    // on truthyness: https://www.mediawiki.org/wiki/Wikibase/Indexing/RDF_Dump_Format#Truthy_statements
    return aggregate.preferred || aggregate.normal || [];
}
export function nonDeprecatedPropertyClaims(propertyClaims) {
    return propertyClaims.filter(claim => claim.rank !== 'deprecated');
}
const aggregatePerRank = (aggregate, claim) => {
    const { rank } = claim;
    aggregate[rank] || (aggregate[rank] = []);
    aggregate[rank].push(claim);
    return aggregate;
};
export function truthyClaims(claims) {
    const truthClaimsOnly = {};
    Object.keys(claims).forEach(property => {
        truthClaimsOnly[property] = truthyPropertyClaims(claims[property]);
    });
    return truthClaimsOnly;
}
//# sourceMappingURL=rank.js.map