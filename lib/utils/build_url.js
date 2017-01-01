// replacing what we need of querystring in case
// querystring isnt available (esp. in the browser)
var qs
try {
  qs = require('querystring')
} catch (err) {
  qs = require('./querystring_lite')
}

const roots = {
  wikidata: 'https://www.wikidata.org/w/api.php',
  commons: 'http://commons.wikimedia.org'
}

module.exports = (domain, queryObj) => roots[domain] + '?' + qs.stringify(queryObj)
