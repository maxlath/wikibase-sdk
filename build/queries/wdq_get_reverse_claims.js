// Generated by CoffeeScript 1.8.0
(function() {
  var buildUrl, wd_, wdq_;

  buildUrl = require('../utils/build_url');

  wd_ = require('../utils/utils');

  wdq_ = {
    claim: function(P, Q) {
      P = wd_.normalizeId(P, true);
      Q = wd_.normalizeId(Q, true);
      return buildUrl('wdq', {
        q: "CLAIM[" + P + ":" + Q + "]"
      });
    },
    string: function(P, string) {
      P = wd_.normalizeId(P, true);
      return buildUrl('wdq', {
        q: "STRING[" + P + ":" + string + "]"
      });
    }
  };

  module.exports = function(P, value) {
    if (wd_.isWikidataEntityId(value)) {
      return wdq_.claim(P, value);
    } else {
      return wdq_.string(P, value);
    }
  };

}).call(this);
