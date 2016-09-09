helpers = require '../helpers/helpers'
sparqlQuery = require './sparql_query'

module.exports = (property, value, limit=1000)->
  if helpers.isWikidataEntityId(value) then value = "wd:#{value}"
  else if typeof value is 'string' then value = "\"#{value}\""

  sparql = """
    SELECT ?subject WHERE {
      ?subject wdt:#{property} #{value} .
    }
    LIMIT #{limit}
    """

  return sparqlQuery sparql
