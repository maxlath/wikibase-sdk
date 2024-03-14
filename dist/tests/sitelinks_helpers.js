import should from 'should';
import { getSitelinkUrl, getSitelinkData, isSite } from '../src/helpers/sitelinks.js';
describe('getSitelinkUrl', () => {
    it('should be a function', () => {
        should(getSitelinkUrl).be.a.Function();
    });
    it('should return a sitelink URL', () => {
        should(getSitelinkUrl({ site: 'commons', title: 'Lyon' })).equal('https://commons.wikimedia.org/wiki/Lyon');
        should(getSitelinkUrl({ site: 'frwiki', title: 'Septembre' })).equal('https://fr.wikipedia.org/wiki/Septembre');
        should(getSitelinkUrl({ site: 'hywikisource', title: 'Հեղինակ:Վիկտոր Հյուգո' })).equal('https://hy.wikisource.org/wiki/%D5%80%D5%A5%D5%B2%D5%AB%D5%B6%D5%A1%D5%AF%3A%D5%8E%D5%AB%D5%AF%D5%BF%D5%B8%D6%80_%D5%80%D5%B5%D5%B8%D6%82%D5%A3%D5%B8');
        should(getSitelinkUrl({ site: 'zhwikiquote', title: '維克多·雨果' })).equal('https://zh.wikiquote.org/wiki/%E7%B6%AD%E5%85%8B%E5%A4%9A%C2%B7%E9%9B%A8%E6%9E%9C');
        // Couldn't find a wiktionary sitelink
        should(getSitelinkUrl({ site: 'nlwikibooks', title: 'Programmeren in SPARQL' })).equal('https://nl.wikibooks.org/wiki/Programmeren_in_SPARQL');
        should(getSitelinkUrl({ site: 'frwikiversity', title: 'SPARQL Protocol and RDF Query Language' })).equal('https://fr.wikiversity.org/wiki/SPARQL_Protocol_and_RDF_Query_Language');
        should(getSitelinkUrl({ site: 'dewikivoyage', title: 'Lyon' })).equal('https://de.wikivoyage.org/wiki/Lyon');
        should(getSitelinkUrl({ site: 'enwikinews', title: 'Category:Lyon' })).equal('https://en.wikinews.org/wiki/Category%3ALyon');
        should(getSitelinkUrl({ site: 'wikidata', title: 'Q1' })).equal('https://www.wikidata.org/wiki/Q1');
        should(getSitelinkUrl({ site: 'wikidatawiki', title: 'Q1' })).equal('https://www.wikidata.org/wiki/Q1');
        should(getSitelinkUrl({ site: 'wikidata', title: 'P50' })).equal('https://www.wikidata.org/wiki/Property:P50');
        should(getSitelinkUrl({ site: 'wikidatawiki', title: 'L622301' })).equal('https://www.wikidata.org/wiki/Lexeme:L622301');
        should(getSitelinkUrl({ site: 'wikidatawiki', title: 'L622301-F1' })).equal('https://www.wikidata.org/wiki/Lexeme:L622301#F1');
        should(getSitelinkUrl({ site: 'wikidatawiki', title: 'L16097-S1' })).equal('https://www.wikidata.org/wiki/Lexeme:L16097#S1');
        should(getSitelinkUrl({ site: 'wikidatawiki', title: 'E1' })).equal('https://www.wikidata.org/wiki/EntitySchema:E1');
    });
    it('should accept a sitelink object as unique argument', () => {
        should(getSitelinkUrl({ site: 'commons', title: 'Lyon' })).equal('https://commons.wikimedia.org/wiki/Lyon');
        should(getSitelinkUrl({ site: 'frwiki', title: 'Septembre' })).equal('https://fr.wikipedia.org/wiki/Septembre');
        should(getSitelinkUrl({ site: 'hywikisource', title: 'Հեղինակ:Վիկտոր Հյուգո' })).equal('https://hy.wikisource.org/wiki/%D5%80%D5%A5%D5%B2%D5%AB%D5%B6%D5%A1%D5%AF%3A%D5%8E%D5%AB%D5%AF%D5%BF%D5%B8%D6%80_%D5%80%D5%B5%D5%B8%D6%82%D5%A3%D5%B8');
        should(getSitelinkUrl({ site: 'zhwikiquote', title: '維克多·雨果' })).equal('https://zh.wikiquote.org/wiki/%E7%B6%AD%E5%85%8B%E5%A4%9A%C2%B7%E9%9B%A8%E6%9E%9C');
        // Couldn't find a wiktionary sitelink
        should(getSitelinkUrl({ site: 'nlwikibooks', title: 'Programmeren in SPARQL' })).equal('https://nl.wikibooks.org/wiki/Programmeren_in_SPARQL');
        should(getSitelinkUrl({ site: 'frwikiversity', title: 'SPARQL Protocol and RDF Query Language' })).equal('https://fr.wikiversity.org/wiki/SPARQL_Protocol_and_RDF_Query_Language');
        should(getSitelinkUrl({ site: 'dewikivoyage', title: 'Lyon' })).equal('https://de.wikivoyage.org/wiki/Lyon');
        should(getSitelinkUrl({ site: 'enwikinews', title: 'Category:Lyon' })).equal('https://en.wikinews.org/wiki/Category%3ALyon');
        should(getSitelinkUrl({ site: 'wikidata', title: 'Q1' })).equal('https://www.wikidata.org/wiki/Q1');
        should(getSitelinkUrl({ site: 'wikidatawiki', title: 'Q1' })).equal('https://www.wikidata.org/wiki/Q1');
        should(getSitelinkUrl({ site: 'wikidata', title: 'P50' })).equal('https://www.wikidata.org/wiki/Property:P50');
    });
    it('should replace spaces by underscores', () => {
        should(getSitelinkUrl({ site: 'eswikiquote', title: 'Gilles Deleuze' })).equal('https://es.wikiquote.org/wiki/Gilles_Deleuze');
    });
    it('should reject invalid sitelinks', () => {
        // @ts-expect-error invalid site
        should(() => getSitelinkUrl({ site: 'frperlinpinpin', title: 'Lyon' })).throw();
        // @ts-expect-error invalid site
        should(() => getSitelinkUrl({ site: 'frwikiwiki', title: 'Lyon' })).throw();
    });
    it('should support multi-part language codes', () => {
        should(getSitelinkUrl({ site: 'zh_classicalwiki', title: '編訂名詞館' })).startWith('https://zh-classical.wikipedia.org/');
        should(getSitelinkUrl({ site: 'be_x_oldwiki', title: 'Віктор_Юго' })).startWith('https://be-x-old.wikipedia.org/');
    });
});
describe('getSitelinkData', () => {
    it('should return a sitelink data from a sitelink key', () => {
        should(getSitelinkData('frwiki').lang).equal('fr');
        should(getSitelinkData('frwiki').project).equal('wikipedia');
        should(getSitelinkData('dewikiquote').lang).equal('de');
        should(getSitelinkData('dewikiquote').project).equal('wikiquote');
        should(getSitelinkData('commonswiki').project).equal('commons');
        should(getSitelinkData('wikidatawiki').project).equal('wikidata');
        // Using 'en' as placeholder
        should(getSitelinkData('wikidatawiki').lang).equal('en');
        should(getSitelinkData('commonswiki').lang).equal('en');
    });
    it('should return sitelink data from a URL', () => {
        should(getSitelinkData('https://de.wikipedia.org/wiki/The_Score_(2001)').lang).equal('de');
        should(getSitelinkData('https://de.wikipedia.org/wiki/The_Score_(2001)').project).equal('wikipedia');
        should(getSitelinkData('https://de.wikipedia.org/wiki/The_Score_(2001)').key).equal('dewiki');
        should(getSitelinkData('https://de.wikipedia.org/wiki/The_Score_(2001)').title).equal('The_Score_(2001)');
        should(getSitelinkData('https://www.wikidata.org/wiki/Q4115189').lang).equal('en');
        should(getSitelinkData('https://www.wikidata.org/wiki/Q4115189').project).equal('wikidata');
        should(getSitelinkData('https://www.wikidata.org/wiki/Q4115189').key).equal('wikidata');
        should(getSitelinkData('https://www.wikidata.org/wiki/Q4115189').title).equal('Q4115189');
        should(getSitelinkData('https://commons.wikimedia.org/wiki/Category:ITER').lang).equal('en');
        should(getSitelinkData('https://commons.wikimedia.org/wiki/Category:ITER').project).equal('commons');
        should(getSitelinkData('https://commons.wikimedia.org/wiki/Category:ITER').key).equal('commons');
        should(getSitelinkData('https://commons.wikimedia.org/wiki/Category:ITER').title).equal('Category:ITER');
    });
    it('should reject invalid sitelink key', () => {
        should(() => getSitelinkData('foowiki')).throw();
    });
    it('should parse encoded URL components', () => {
        should(getSitelinkData('https://de.wikipedia.org/wiki/The_Score_%282001%29').title).equal('The_Score_(2001)');
        should(getSitelinkData('https://de.wikipedia.org/wiki/The_Score_%282001%29').lang).equal('de');
        should(getSitelinkData('https://de.wikipedia.org/wiki/The_Score_%282001%29').project).equal('wikipedia');
        should(getSitelinkData('https://de.wikipedia.org/wiki/The_Score_%282001%29').key).equal('dewiki');
    });
    it('should support multi-part language codes', () => {
        const data = getSitelinkData('https://be-x-old.wikipedia.org/wiki/Беларускі_клясычны_правапіс');
        should(data.title).equal('Беларускі_клясычны_правапіс');
        should(data.lang).equal('be-x-old');
        should(data.project).equal('wikipedia');
        should(data.key).equal('be_x_oldwiki');
    });
});
describe('isSite', () => {
    it('should return true for valid sitelink keys', () => {
        should(isSite('frwiki')).be.true();
        should(isSite('be_x_oldwiki')).be.true();
        should(isSite('commonswiki')).be.true();
        should(isSite('wikidatawiki')).be.true();
        should(isSite('commons')).be.false();
        should(isSite('wikidata')).be.false();
    });
    it('should return false for invalid sitelink keys', () => {
        should(isSite('frperlinpinpin')).be.false();
        should(isSite('frwikilinpinpin')).be.false();
        should(isSite('imaginarylangwiki')).be.false();
        should(isSite('frwikiwiki')).be.false();
        should(isSite('be-x-oldwiki')).be.false();
    });
});
//# sourceMappingURL=sitelinks_helpers.js.map