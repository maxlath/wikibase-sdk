import should from 'should';
import { getEntityRevisionFactory } from '../src/queries/get_entity_revision.js';
import { instance, wgScriptPath } from './lib/tests_env.js';
import { parseQuery } from './lib/utils.js';
const getEntityRevision = getEntityRevisionFactory(instance, wgScriptPath);
describe('getEntityRevision', () => {
    it('should reject an invalid entity id', () => {
        // @ts-expect-error not an entity id
        should(() => getEntityRevision({ id: '3548931' })).throw('invalid entity id: 3548931 (type: string)');
    });
    it('should reject an invalid revision', () => {
        // @ts-expect-error not a valid revision
        should(() => getEntityRevision({ id: 'Q123', revision: 'foo' })).throw('invalid revision id: foo (type: string)');
    });
    it('should return an entity revision url [multiple args interface]', () => {
        const url = getEntityRevision({ id: 'Q3548931', revision: '3548931' });
        should(url).be.a.String();
        const [host, query] = url.split('?');
        const parsedQuery = parseQuery(query);
        should(host).equal('https://www.wikidata.org/w/index.php');
        should(parsedQuery.title).equal('Special:EntityData/Q3548931.json');
        should(parsedQuery.revision).equal('3548931');
    });
    it('should return an entity revision url [object interface]', () => {
        const url = getEntityRevision({ id: 'Q3548931', revision: '3548931' });
        should(url).be.a.String();
        const [host, query] = url.split('?');
        const parsedQuery = parseQuery(query);
        should(host).equal('https://www.wikidata.org/w/index.php');
        should(parsedQuery.title).equal('Special:EntityData/Q3548931.json');
        should(parsedQuery.revision).equal('3548931');
    });
});
//# sourceMappingURL=get_entity_revision.js.map