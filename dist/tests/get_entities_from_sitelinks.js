import should from 'should';
import { getEntitiesFromSitelinksFactory } from '../src/queries/get_entities_from_sitelinks.js';
import { buildUrl } from './lib/tests_env.js';
import { parseUrlQuery } from './lib/utils.js';
const getEntitiesFromSitelinks = getEntitiesFromSitelinksFactory(buildUrl);
describe('getEntitiesFromSitelinks', () => {
    describe('polymorphism', () => {
        it('rejects parameters as multiple arguments', () => {
            // @ts-expect-error old usage
            should(() => getEntitiesFromSitelinks('Lyon')).throw();
            // @ts-expect-error old usage
            should(() => getEntitiesFromSitelinks('Lyon', 'en')).throw();
        });
    });
    describe('action', () => {
        it('action should be wbgetentities', () => {
            const query = parseUrlQuery(getEntitiesFromSitelinks({ titles: 'Lyon' }));
            should(query.action).equal('wbgetentities');
        });
    });
    describe('titles', () => {
        it('accepts one title as a string', () => {
            const query = parseUrlQuery(getEntitiesFromSitelinks({ titles: 'Lyon' }));
            should(query.titles).equal('Lyon');
        });
        it('accepts titles as an array', () => {
            const query = parseUrlQuery(getEntitiesFromSitelinks({ titles: ['Lyon', 'Hamburg'] }));
            should(query.titles).equal('Lyon|Hamburg');
        });
    });
    describe('sitelinks', () => {
        it('accepts one site as a string', () => {
            const query = parseUrlQuery(getEntitiesFromSitelinks({ titles: 'Lyon', sites: 'itwiki' }));
            should(query.sites).equal('itwiki');
        });
        it('accepts titles as an array', () => {
            const query = parseUrlQuery(getEntitiesFromSitelinks({ titles: 'Lyon', sites: ['itwiki', 'eswikisource'] }));
            should(query.sites).equal('itwiki|eswikisource');
        });
        it('defaults to the English Wikipedia', () => {
            const query = parseUrlQuery(getEntitiesFromSitelinks({ titles: 'Lyon' }));
            should(query.sites).equal('enwiki');
        });
        it('converts 2-letters language codes to Wikipedia sites', () => {
            // @ts-expect-error 2-letter language codes are not sites
            const query = parseUrlQuery(getEntitiesFromSitelinks({ titles: 'Lyon', sites: ['it', 'fr'] }));
            should(query.sites).equal('itwiki|frwiki');
        });
    });
    describe('languages', () => {
        it('default to no language parameter', () => {
            const query = parseUrlQuery(getEntitiesFromSitelinks({ titles: 'Lyon' }));
            should(query.languages).not.be.ok();
        });
        it('accepts one language as a string', () => {
            const query = parseUrlQuery(getEntitiesFromSitelinks({ titles: 'Lyon', languages: 'fr' }));
            should(query.languages).equal('fr');
        });
        it('accepts language as an array', () => {
            const query = parseUrlQuery(getEntitiesFromSitelinks({ titles: 'Lyon', languages: ['fr', 'de'] }));
            should(query.languages).equal('fr|de');
        });
    });
    describe('properties', () => {
        it('defaults to no property specified', () => {
            const query = parseUrlQuery(getEntitiesFromSitelinks({ titles: 'Lyon' }));
            should(query.props).not.be.ok();
        });
    });
    describe('format', () => {
        it('default to json', () => {
            const query = parseUrlQuery(getEntitiesFromSitelinks({ titles: 'Lyon' }));
            should(query.format).equal('json');
        });
    });
    describe('redirects', () => {
        it('should default to no redirects parameter', () => {
            const query = parseUrlQuery(getEntitiesFromSitelinks({ titles: 'Lyon' }));
            should(query.redirects).not.be.ok();
        });
        it('should add a redirects parameter if false', () => {
            const query = parseUrlQuery(getEntitiesFromSitelinks({ titles: 'Lyon', redirects: false }));
            should(query.redirects).equal('no');
        });
    });
});
//# sourceMappingURL=get_entities_from_sitelinks.js.map