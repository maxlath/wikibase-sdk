// replacing what we need of querystring in case
// querystring isnt available (esp. in the browser)
var qs
try {
  qs = require('querystring')
} catch (err) {
  qs = require('./querystring_lite')
}

const wikidataApiRoot = 'https://www.wikidata.org/w/api.php'

module.exports = (queryObj) => wikidataApiRoot + '?' + qs.stringify(queryObj)
