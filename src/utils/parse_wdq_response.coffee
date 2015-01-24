wd_ = require './utils'

module.exports = (response)->
  response.items?.map (item)-> wd_.normalizeId(item)
