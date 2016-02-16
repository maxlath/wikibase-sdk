module.exports = (sparql)->
  query = encodeURIComponent sparql
  "https://query.wikidata.org/sparql?format=json&query=#{query}"
