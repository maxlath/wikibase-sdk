import should from 'should';
import { getRevisionsFactory } from '../src/queries/get_revisions.js';
import { buildUrl } from './lib/tests_env.js';
import { parseQuery } from './lib/utils.js';
const sinceYesterdayInMilliSeconds = new Date().getTime() - 24 * 60 * 60 * 1000;
const sinceYesterdayInSeconds = Math.trunc(sinceYesterdayInMilliSeconds / 1000);
const getRevisions = getRevisionsFactory(buildUrl);
describe('getRevisions', () => {
    it('should reject invalid ids', () => {
        // @ts-expect-error invalid revision id
        should(() => getRevisions({ ids: 'foo' })).throw('invalid entity page title: foo (type: string)');
    });
    it('should accept namespaced ids invalid ids', () => {
        should(() => getRevisions({ ids: 'Item:Q123' })).not.throw();
        should(() => getRevisions({ ids: 'Property:P123' })).not.throw();
        should(() => getRevisions({ ids: 'Lexeme:L123' })).not.throw();
        // @ts-expect-error title is invalid
        should(() => getRevisions({ ids: 'Property:Q123' })).throw('invalid entity page title: Property:Q123 (type: string)');
    });
    it('should return a revision query url', () => {
        const url = getRevisions({ ids: 'Q3548931' });
        should(url).be.a.String();
        const query = parseQuery(url.split('?')[1]);
        should(query.action).equal('query');
        should(query.prop).equal('revisions');
        should(query.titles).equal('Q3548931');
        should(query.rvlimit).equal('max');
        should(query.format).equal('json');
        should(query.rvprop).equal('ids|flags|timestamp|user|userid|size|slotsize|sha1|slotsha1|contentmodel|comment|parsedcomment|content|tags|roles|oresscores');
        should(query.rvslots).equal('*');
    });
    it('should accept several ids', () => {
        const url = getRevisions({ ids: ['Q3548931', 'Q3548932'] });
        const query = parseQuery(url.split('?')[1]);
        should(query.titles).equal('Q3548931|Q3548932');
    });
    it('should accept custom parameters', () => {
        const url = getRevisions({ ids: 'Q3548931', limit: 2, start: sinceYesterdayInSeconds });
        const query = parseQuery(url.split('?')[1]);
        should(query.rvlimit).equal('2');
        should(query.rvstart).equal(sinceYesterdayInSeconds.toString());
    });
    it('should accept time in milliseconds', () => {
        const url = getRevisions({ ids: 'Q3548931', start: sinceYesterdayInMilliSeconds });
        const query = parseQuery(url.split('?')[1]);
        should(query.rvstart).equal(sinceYesterdayInSeconds.toString());
    });
    it('should accept time in ISO format', () => {
        const ISOtime = new Date(sinceYesterdayInMilliSeconds).toISOString();
        const url = getRevisions({ ids: 'Q3548931', end: ISOtime });
        const query = parseQuery(url.split('?')[1]);
        should(query.rvend).equal(sinceYesterdayInSeconds.toString());
    });
    it('should accept date objects in ISO format', () => {
        const dateObj = new Date(sinceYesterdayInMilliSeconds);
        const url = getRevisions({ ids: 'Q3548931', end: dateObj });
        const query = parseQuery(url.split('?')[1]);
        should(query.rvend).equal(sinceYesterdayInSeconds.toString());
    });
    it('should ignore parameters that the API refuses for multiple ids', () => {
        const dateObj = new Date(sinceYesterdayInMilliSeconds);
        const url = getRevisions({ ids: ['Q3548931', 'Q3548932'], end: dateObj });
        const query = parseQuery(url.split('?')[1]);
        should(query.rvend).not.be.ok();
    });
    it('should allow to set rvprop as a string', () => {
        const url = getRevisions({ ids: 'Q3548931', prop: 'tags|user' });
        const query = parseQuery(url.split('?')[1]);
        should(query.rvprop).equal('tags|user');
    });
    it('should allow to set rvprop as an array', () => {
        const url = getRevisions({ ids: 'Q3548931', prop: ['tags', 'user'] });
        const query = parseQuery(url.split('?')[1]);
        should(query.rvprop).equal('tags|user');
    });
    it('should allow to set rvuser', () => {
        const url = getRevisions({ ids: 'Q3548931', user: 'foo' });
        const query = parseQuery(url.split('?')[1]);
        should(query.rvuser).equal('foo');
    });
    it('should allow to set rvexcludeuser', () => {
        const url = getRevisions({ ids: 'Q3548931', excludeuser: 'foo' });
        const query = parseQuery(url.split('?')[1]);
        should(query.rvexcludeuser).equal('foo');
    });
    it('should allow to set rvtag', () => {
        const url = getRevisions({ ids: 'Q3548931', tag: 'foo' });
        const query = parseQuery(url.split('?')[1]);
        should(query.rvtag).equal('foo');
    });
});
//# sourceMappingURL=get_revisions.js.map