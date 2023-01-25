// @ts-nocheck
import 'should'
import { getSitelinkUrl, getSitelinkData, isSitelinkKey } from '../src/helpers/sitelinks.js'

describe('getSitelinkUrl', () => {
  it('should be a function', () => {
    getSitelinkUrl.should.be.an.Function()
  })

  it('should return a sitelink URL', () => {
    getSitelinkUrl({ site: 'commons', title: 'Lyon' })
    .should.equal('https://commons.wikimedia.org/wiki/Lyon')

    getSitelinkUrl({ site: 'frwiki', title: 'Septembre' })
    .should.equal('https://fr.wikipedia.org/wiki/Septembre')

    getSitelinkUrl({ site: 'hywikisource', title: 'Հեղինակ:Վիկտոր Հյուգո' })
    .should.equal('https://hy.wikisource.org/wiki/%D5%80%D5%A5%D5%B2%D5%AB%D5%B6%D5%A1%D5%AF%3A%D5%8E%D5%AB%D5%AF%D5%BF%D5%B8%D6%80_%D5%80%D5%B5%D5%B8%D6%82%D5%A3%D5%B8')

    getSitelinkUrl({ site: 'zhwikiquote', title: '維克多·雨果' })
    .should.equal('https://zh.wikiquote.org/wiki/%E7%B6%AD%E5%85%8B%E5%A4%9A%C2%B7%E9%9B%A8%E6%9E%9C')

    // Couldn't find a wiktionary sitelink

    getSitelinkUrl({ site: 'nlwikibooks', title: 'Programmeren in SPARQL' })
    .should.equal('https://nl.wikibooks.org/wiki/Programmeren_in_SPARQL')

    getSitelinkUrl({ site: 'frwikiversity', title: 'SPARQL Protocol and RDF Query Language' })
    .should.equal('https://fr.wikiversity.org/wiki/SPARQL_Protocol_and_RDF_Query_Language')

    getSitelinkUrl({ site: 'dewikivoyage', title: 'Lyon' })
    .should.equal('https://de.wikivoyage.org/wiki/Lyon')

    getSitelinkUrl({ site: 'enwikinews', title: 'Category:Lyon' })
    .should.equal('https://en.wikinews.org/wiki/Category%3ALyon')

    getSitelinkUrl({ site: 'wikidata', title: 'Q1' })
    .should.equal('https://www.wikidata.org/wiki/Q1')

    getSitelinkUrl({ site: 'wikidatawiki', title: 'Q1' })
    .should.equal('https://www.wikidata.org/wiki/Q1')

    getSitelinkUrl({ site: 'wikidata', title: 'P50' })
    .should.equal('https://www.wikidata.org/wiki/Property:P50')

    getSitelinkUrl({ site: 'wikidatawiki', title: 'L622301' })
    .should.equal('https://www.wikidata.org/wiki/Lexeme:L622301')

    getSitelinkUrl({ site: 'wikidatawiki', title: 'L622301-F1' })
    .should.equal('https://www.wikidata.org/wiki/Lexeme:L622301#F1')

    getSitelinkUrl({ site: 'wikidatawiki', title: 'L16097-S1' })
    .should.equal('https://www.wikidata.org/wiki/Lexeme:L16097#S1')

    getSitelinkUrl({ site: 'wikidatawiki', title: 'E1' })
    .should.equal('https://www.wikidata.org/wiki/EntitySchema:E1')
  })

  it('should accept a sitelink object as unique argument', () => {
    getSitelinkUrl({ site: 'commons', title: 'Lyon' })
    .should.equal('https://commons.wikimedia.org/wiki/Lyon')

    getSitelinkUrl({ site: 'frwiki', title: 'Septembre' })
    .should.equal('https://fr.wikipedia.org/wiki/Septembre')

    getSitelinkUrl({ site: 'hywikisource', title: 'Հեղինակ:Վիկտոր Հյուգո' })
    .should.equal('https://hy.wikisource.org/wiki/%D5%80%D5%A5%D5%B2%D5%AB%D5%B6%D5%A1%D5%AF%3A%D5%8E%D5%AB%D5%AF%D5%BF%D5%B8%D6%80_%D5%80%D5%B5%D5%B8%D6%82%D5%A3%D5%B8')

    getSitelinkUrl({ site: 'zhwikiquote', title: '維克多·雨果' })
    .should.equal('https://zh.wikiquote.org/wiki/%E7%B6%AD%E5%85%8B%E5%A4%9A%C2%B7%E9%9B%A8%E6%9E%9C')

    // Couldn't find a wiktionary sitelink

    getSitelinkUrl({ site: 'nlwikibooks', title: 'Programmeren in SPARQL' })
    .should.equal('https://nl.wikibooks.org/wiki/Programmeren_in_SPARQL')

    getSitelinkUrl({ site: 'frwikiversity', title: 'SPARQL Protocol and RDF Query Language' })
    .should.equal('https://fr.wikiversity.org/wiki/SPARQL_Protocol_and_RDF_Query_Language')

    getSitelinkUrl({ site: 'dewikivoyage', title: 'Lyon' })
    .should.equal('https://de.wikivoyage.org/wiki/Lyon')

    getSitelinkUrl({ site: 'enwikinews', title: 'Category:Lyon' })
    .should.equal('https://en.wikinews.org/wiki/Category%3ALyon')

    getSitelinkUrl({ site: 'wikidata', title: 'Q1' })
    .should.equal('https://www.wikidata.org/wiki/Q1')

    getSitelinkUrl({ site: 'wikidatawiki', title: 'Q1' })
    .should.equal('https://www.wikidata.org/wiki/Q1')

    getSitelinkUrl({ site: 'wikidata', title: 'P50' })
    .should.equal('https://www.wikidata.org/wiki/Property:P50')
  })

  it('should replace spaces by underscores', () => {
    getSitelinkUrl({ site: 'eswikiquote', title: 'Gilles Deleuze' })
    .should.equal('https://es.wikiquote.org/wiki/Gilles_Deleuze')
  })

  it('should reject invalid sitelinks', () => {
    (() => getSitelinkUrl({ site: 'frperlinpinpin', title: 'Lyon' })).should.throw()
    ;(() => getSitelinkUrl({ site: 'frwikiwiki', title: 'Lyon' })).should.throw()
  })

  it('should support multi-part language codes', () => {
    getSitelinkUrl({ site: 'zh_classicalwiki', title: '編訂名詞館' })
    .should.startWith('https://zh-classical.wikipedia.org/')
    getSitelinkUrl({ site: 'be_x_oldwiki', title: 'Віктор_Юго' })
    .should.startWith('https://be-x-old.wikipedia.org/')
  })
})

describe('getSitelinkData', () => {
  it('should return a sitelink data from a sitelink key', () => {
    getSitelinkData('frwiki').lang.should.equal('fr')
    getSitelinkData('frwiki').project.should.equal('wikipedia')
    getSitelinkData('dewikiquote').lang.should.equal('de')
    getSitelinkData('dewikiquote').project.should.equal('wikiquote')
    getSitelinkData('commonswiki').project.should.equal('commons')
    getSitelinkData('wikidatawiki').project.should.equal('wikidata')
    // Using 'en' as placeholder
    getSitelinkData('wikidatawiki').lang.should.equal('en')
    getSitelinkData('commonswiki').lang.should.equal('en')
  })

  it('should return sitelink data from a URL', () => {
    getSitelinkData('https://de.wikipedia.org/wiki/The_Score_(2001)').lang.should.equal('de')
    getSitelinkData('https://de.wikipedia.org/wiki/The_Score_(2001)').project.should.equal('wikipedia')
    getSitelinkData('https://de.wikipedia.org/wiki/The_Score_(2001)').key.should.equal('dewiki')
    getSitelinkData('https://de.wikipedia.org/wiki/The_Score_(2001)').title.should.equal('The_Score_(2001)')

    getSitelinkData('https://www.wikidata.org/wiki/Q4115189').lang.should.equal('en')
    getSitelinkData('https://www.wikidata.org/wiki/Q4115189').project.should.equal('wikidata')
    getSitelinkData('https://www.wikidata.org/wiki/Q4115189').key.should.equal('wikidata')
    getSitelinkData('https://www.wikidata.org/wiki/Q4115189').title.should.equal('Q4115189')

    getSitelinkData('https://commons.wikimedia.org/wiki/Category:ITER').lang.should.equal('en')
    getSitelinkData('https://commons.wikimedia.org/wiki/Category:ITER').project.should.equal('commons')
    getSitelinkData('https://commons.wikimedia.org/wiki/Category:ITER').key.should.equal('commons')
    getSitelinkData('https://commons.wikimedia.org/wiki/Category:ITER').title.should.equal('Category:ITER')
  })

  it('should reject invalid sitelink key', () => {
    getSitelinkData.bind(null, 'foowiki').should.throw()
  })

  it('should parse encoded URL components', () => {
    getSitelinkData('https://de.wikipedia.org/wiki/The_Score_%282001%29').title.should.equal('The_Score_(2001)')
    getSitelinkData('https://de.wikipedia.org/wiki/The_Score_%282001%29').lang.should.equal('de')
    getSitelinkData('https://de.wikipedia.org/wiki/The_Score_%282001%29').project.should.equal('wikipedia')
    getSitelinkData('https://de.wikipedia.org/wiki/The_Score_%282001%29').key.should.equal('dewiki')
  })

  it('should support multi-part language codes', () => {
    const data = getSitelinkData('https://be-x-old.wikipedia.org/wiki/Беларускі_клясычны_правапіс')
    data.title.should.equal('Беларускі_клясычны_правапіс')
    data.lang.should.equal('be_x_old')
    data.project.should.equal('wikipedia')
    data.key.should.equal('be_x_oldwiki')
  })
})

describe('isSitelinkKey', () => {
  it('should return true for valid sitelink keys', () => {
    isSitelinkKey('frwiki').should.be.true()
    isSitelinkKey('be_x_oldwiki').should.be.true()
    isSitelinkKey('commonswiki').should.be.true()
    isSitelinkKey('wikidatawiki').should.be.true()
    isSitelinkKey('commons').should.be.false()
    isSitelinkKey('wikidata').should.be.false()
  })

  it('should return false for invalid sitelink keys', () => {
    isSitelinkKey('frperlinpinpin').should.be.false()
    isSitelinkKey('frwikilinpinpin').should.be.false()
    isSitelinkKey('imaginarylangwiki').should.be.false()
    isSitelinkKey('frwikiwiki').should.be.false()
    isSitelinkKey('be-x-oldwiki').should.be.false()
  })
})
