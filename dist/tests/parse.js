import should from 'should';
import * as parse from '../src/helpers/parse_responses.js';
import { cirrusSearchPagesResponse } from './data/cirrus_search_response.js';
import { wbgetentitiesResponse } from './data/wbgetentities_response.js';
import { assert } from './lib/utils.js';
describe('parse', () => {
    describe('wb', () => {
        describe('entities', () => {
            it('should be a function', () => {
                should(parse.entities).be.a.Function();
            });
            it('should parse an entities response', () => {
                const entities = parse.entities(wbgetentitiesResponse);
                should(entities).be.an.Object();
                should(entities.Q3235026).be.an.Object();
                assert(entities.Q3235026.type === 'item');
                should(entities.Q3235026.labels).be.an.Object();
                should(entities.Q3235026.descriptions).be.an.Object();
                should(entities.Q3235026.claims).be.an.Object();
            });
        });
        describe('pagesTitles', () => {
            it('should parse a cirrus search response', () => {
                const titles = parse.pagesTitles(cirrusSearchPagesResponse);
                should(titles).deepEqual(['Q1']);
            });
        });
    });
});
//# sourceMappingURL=parse.js.map