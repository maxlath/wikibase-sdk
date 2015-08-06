buildUrl = require '../utils/build_url'
wd_ = require '../helpers/helpers'

wdq_ =
  claim: (P, Q)->
    P = wd_.normalizeId(P, true)
    Q = wd_.normalizeId(Q, true)
    buildUrl 'wdq', {q: "CLAIM[#{P}:#{Q}]" }

  string: (P, string)->
    P = wd_.normalizeId(P, true)
    buildUrl 'wdq', {q: "STRING[#{P}:#{string}]" }


module.exports = (P, value)->
  if wd_.isWikidataEntityId(value) then wdq_.claim(P, value)
  else wdq_.string(P, value)