require('should')

const getSitelinkUrl = require('../lib/helpers/get_sitelink_url')

describe('helpers', function () {
  it('should be a function', function (done) {
    getSitelinkUrl.should.be.an.Function()
    done()
  })
  it('should return a sitelink URL', function (done) {
    getSitelinkUrl('commons', 'Lyon')
    .should.equal('https://commons.wikimedia.org/wiki/Lyon')

    getSitelinkUrl('frwiki', 'Septembre')
    .should.equal('https://fr.wikipedia.org/wiki/Septembre')

    getSitelinkUrl('hywikisource', 'Հեղինակ:Վիկտոր Հյուգո')
    .should.equal('https://hy.wikisource.org/wiki/%D5%80%D5%A5%D5%B2%D5%AB%D5%B6%D5%A1%D5%AF%3A%D5%8E%D5%AB%D5%AF%D5%BF%D5%B8%D6%80_%D5%80%D5%B5%D5%B8%D6%82%D5%A3%D5%B8')

    getSitelinkUrl('zhwikiquote', '維克多·雨果')
    .should.equal('https://zh.wikiquote.org/wiki/%E7%B6%AD%E5%85%8B%E5%A4%9A%C2%B7%E9%9B%A8%E6%9E%9C')

    // Couldn't find a wiktionary sitelink

    getSitelinkUrl('nlwikibooks', 'Programmeren in SPARQL')
    .should.equal('https://nl.wikibooks.org/wiki/Programmeren_in_SPARQL')

    getSitelinkUrl('frwikiversity', 'SPARQL Protocol and RDF Query Language')
    .should.equal('https://fr.wikiversity.org/wiki/SPARQL_Protocol_and_RDF_Query_Language')

    getSitelinkUrl('dewikivoyage', 'Lyon')
    .should.equal('https://de.wikivoyage.org/wiki/Lyon')

    getSitelinkUrl('enwikinews', 'Category:Lyon')
    .should.equal('https://en.wikinews.org/wiki/Category%3ALyon')

    done()
  })
  it('should accept a sitelink object as unique argument', function (done) {
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

    done()
  })
})
