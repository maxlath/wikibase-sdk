import should from 'should';
import { getReverseClaimsFactory } from '../src/queries/get_reverse_claims.js';
import { sparqlEndpoint } from './lib/tests_env.js';
const getReverseClaims = getReverseClaimsFactory(sparqlEndpoint);
describe('getReverseClaims', () => {
    it('env', () => {
        should(getReverseClaims).be.a.Function();
    });
    it('should reject invalid property ids', () => {
        // @ts-expect-error invalid property id
        should(() => getReverseClaims({ properties: 'foo', values: 'Q535' })).throw('invalid property id: foo (type: string)');
    });
    it('should return a SPARQL query url', () => {
        const url = getReverseClaims({ properties: 'P50', values: 'Q535' });
        should(url).be.a.String();
        should(url.startsWith('https://query.wikidata.org')).be.exactly(true);
        should(url.match(/SELECT/)).be.ok();
        should(url.match(/WHERE/)).be.ok();
        should(url.match(/LIMIT/)).not.be.ok();
        should(url.match(/subject%20wdt%3AP50%20wd%3AQ535/)).be.ok();
    });
    it('should accept an option object', () => {
        const url = getReverseClaims({ properties: 'P50', values: 'Q535', limit: 500 });
        should(url.match(/LIMIT%20500/)).be.ok();
    });
    it('should return a SPARQL query with filter for insensitive case', () => {
        const url = getReverseClaims({ properties: 'P2002', values: 'BouletCorp', caseInsensitive: true });
        should(url).be.a.String();
        should(url.startsWith('https://query.wikidata.org')).be.exactly(true);
        should(url.match(/SELECT/)).be.ok();
        should(url.match(/WHERE/)).be.ok();
        should(url.match(/LIMIT/)).not.be.ok();
        should(url.match(/FILTER%20%28lcase%28%3Fvalue%29%20%3D%20%27bouletcorp%27%29/)).be.ok();
    });
    it('should filter properties by default', () => {
        const url = getReverseClaims({ properties: 'P50', values: 'Q535' });
        should(url.match(/FILTER%20NOT%20EXISTS/)).be.ok();
    });
    it('should keep properties if requested', () => {
        const url = getReverseClaims({ properties: 'P50', values: 'Q535', keepProperties: true });
        should(url.match(/FILTER%20NOT%20EXISTS/)).not.be.ok();
    });
    it('should allow to request subjects for several properties at once', () => {
        const url = getReverseClaims({ properties: ['P50', 'P110'], values: 'Q281411' });
        should(url).match(/wdt%3AP50%7Cwdt%3AP110/);
    });
    it('should allow to request subjects for several values at once', () => {
        const url = getReverseClaims({ properties: 'P50', values: ['Q281411', 'Q206685'] });
        should(url).match(/UNION/);
        const url2 = getReverseClaims({ properties: 'P2002', values: ['wikicite', 'slpng_giants'], caseInsensitive: true });
        should(url2).match(/UNION/);
    });
    // Doing both a UNION and piping properties fails
    // Ex: https://query.wikidata.org/#SELECT%20DISTINCT%20%3Fsubject%20WHERE%20%7B%0A%20%20%7B%0A%20%20%20%20%3Fsubject%20wdt%3AP50%7Cwdt%3AP110%20wd%3AQ281411%20.%0A%20%20%20%20FILTER%20NOT%20EXISTS%20%7B%20%3Fsubject%20rdf%3Atype%20wikibase%3AProperty%20.%20%7D%0A%20%20%7D%20UNION%20%7B%0A%20%20%20%20%3Fsubject%20wdt%3AP50%7Cwdt%3AP110%20wd%3AQ206685%20.%0A%20%20%20%20FILTER%20NOT%20EXISTS%20%7B%20%3Fsubject%20rdf%3Atype%20wikibase%3AProperty%20.%20%7D%20%0A%20%20%7D%0A%7D%0ALIMIT%201000
    // it('should allow to request subjects for several properties and values at once', () => {
    //   const url = getReverseClaims([ 'P50', 'P110' ], [ 'Q281411', 'Q206685' ])
    //   should(url.match(/wdt%3AP50%7Cwdt%3AP110/g).length).equal(2)
    //   should(url).match(/UNION/)
    // })
});
//# sourceMappingURL=get_reverse_claims.js.map