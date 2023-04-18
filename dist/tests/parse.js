import should from 'should';
import * as parse from '../src/helpers/parse_responses.js';
import { readJsonFile } from './lib/utils.js';
const cirrusSearchPagesResponse = readJsonFile('./tests/data/cirrus_search_response.json');
const wbgetentitiesResponse = readJsonFile('./tests/data/wbgetentities_response.json');
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
                // @ts-expect-error
                should(entities.Q3235026.labels).be.an.Object();
                // @ts-expect-error
                should(entities.Q3235026.descriptions).be.an.Object();
                // @ts-expect-error
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