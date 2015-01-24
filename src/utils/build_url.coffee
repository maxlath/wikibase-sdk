# replacing what we need of querystring in case
# querystring isnt available (esp. in the browser)
try qs = require 'querystring'
catch err then qs = require './querystring_lite'

roots =
  wikidata: 'https://www.wikidata.org/w/api.php'
  commons: 'http://commons.wikimedia.org'
  wdq: 'http://wdq.wmflabs.org/api'

module.exports = (domain, queryObj)->
  roots[domain] + '?' + qs.stringify(queryObj)