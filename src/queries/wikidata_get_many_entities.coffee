getEntities = require './wikidata_get_entities'
{ isPlainObject } = require '../utils/utils'

module.exports = (ids, languages, props, format)->
  # polymorphism: arguments can be passed as an object keys
  if isPlainObject ids
    { ids, languages, props, format } = ids

  unless ids instanceof Array
    throw new Error "getManyEntities expects an array of ids"

  getIdsGroups ids
  .map (idsGroup)-> getEntities idsGroup, languages, props, format

getIdsGroups = (ids)->
  groups = []
  while ids.length > 0
    group = ids[0...50]
    ids = ids[50..-1]
    groups.push group

  return groups
