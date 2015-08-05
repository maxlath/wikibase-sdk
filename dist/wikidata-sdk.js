(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.wdk = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],2:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],3:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":1,"./encode":2}],4:[function(require,module,exports){
// Generated by CoffeeScript 1.9.3
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

},{"../utils/build_url":7,"../utils/utils":11}],5:[function(require,module,exports){
// Generated by CoffeeScript 1.9.3
(function() {
  var buildUrl, wd_,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  wd_ = require('../utils/utils');

  buildUrl = require('../utils/build_url');

  module.exports = function(ids, languages, props, format) {
    var query, ref;
    if (languages == null) {
      languages = ['en'];
    }
    if (format == null) {
      format = 'json';
    }
    if (!((ids != null) || ids.length === 0)) {
      throw new Error('no id provided');
    }
    ref = [ids, languages, props].map(wd_.toPropertiesArray), ids = ref[0], languages = ref[1], props = ref[2];
    ids = wd_.normalizeIds(ids);
    if (indexOf.call(languages, 'en') < 0) {
      languages.push('en');
    }
    query = {
      action: 'wbgetentities',
      ids: ids.join('|'),
      languages: languages.join('|'),
      format: format
    };
    if ((props != null) && props.length > 0) {
      query.props = props.join('|');
    }
    return buildUrl('wikidata', query);
  };

}).call(this);

},{"../utils/build_url":7,"../utils/utils":11}],6:[function(require,module,exports){
// Generated by CoffeeScript 1.9.3
(function() {
  var buildUrl, wd_;

  wd_ = require('../utils/utils');

  buildUrl = require('../utils/build_url');

  module.exports = function(search, language, limit, format) {
    var query;
    if (language == null) {
      language = 'en';
    }
    if (limit == null) {
      limit = '20';
    }
    if (format == null) {
      format = 'json';
    }
    if (!((search != null ? search.length : void 0) > 0)) {
      throw new Error("search can't be undefined");
    }
    query = {
      action: 'wbsearchentities',
      search: search,
      language: language,
      limit: limit,
      format: format
    };
    return buildUrl('wikidata', query);
  };

}).call(this);

},{"../utils/build_url":7,"../utils/utils":11}],7:[function(require,module,exports){
// Generated by CoffeeScript 1.9.3
(function() {
  var err, qs, roots;

  try {
    qs = require('querystring');
  } catch (_error) {
    err = _error;
    qs = require('./querystring_lite');
  }

  roots = {
    wikidata: 'https://www.wikidata.org/w/api.php',
    commons: 'http://commons.wikimedia.org',
    wdq: 'http://wdq.wmflabs.org/api'
  };

  module.exports = function(domain, queryObj) {
    return roots[domain] + '?' + qs.stringify(queryObj);
  };

}).call(this);

},{"./querystring_lite":9,"querystring":3}],8:[function(require,module,exports){
// Generated by CoffeeScript 1.9.3
(function() {
  var simplifyClaims, wd_;

  wd_ = require('./utils');

  simplifyClaims = require('./simplify_claims');

  module.exports = {
    wd: {
      entities: function(res) {
        var entities, entity, id;
        res = res.body || res;
        entities = res.entities;
        for (id in entities) {
          entity = entities[id];
          entity.claims = simplifyClaims(entity.claims);
        }
        return entities;
      }
    },
    wdq: {
      entities: function(res) {
        var ref;
        res = res.body || res;
        return (ref = res.items) != null ? ref.map(function(item) {
          return wd_.normalizeId(item);
        }) : void 0;
      }
    }
  };

}).call(this);

},{"./simplify_claims":10,"./utils":11}],9:[function(require,module,exports){
// Generated by CoffeeScript 1.9.3
(function() {
  module.exports = {
    stringify: function(queryObj) {
      var k, qstring, v;
      qstring = '';
      for (k in queryObj) {
        v = queryObj[k];
        if (v != null) {
          qstring += "&" + k + "=" + v;
        }
      }
      qstring = qstring.slice(1);
      if (typeof encodeURI !== "undefined" && encodeURI !== null) {
        return encodeURI(qstring);
      }
      return qstring;
    }
  };

}).call(this);

},{}],10:[function(require,module,exports){
// Generated by CoffeeScript 1.9.3
(function() {
  var simpifyStatement, wd_;

  wd_ = require('./utils');

  module.exports = function(claims) {
    var claim, id, simpleClaims;
    simpleClaims = {};
    for (id in claims) {
      claim = claims[id];
      simpleClaims[id] = claim.map(simpifyStatement);
    }
    return simpleClaims;
  };

  simpifyStatement = function(statement) {
    var datatype, datavalue, mainsnak, ref, value;
    mainsnak = statement.mainsnak;
    if (mainsnak != null) {
      ref = [mainsnak.datatype, mainsnak.datavalue], datatype = ref[0], datavalue = ref[1];
      switch (datatype) {
        case 'string':
        case 'commonsMedia':
          value = datavalue.value;
          break;
        case 'wikibase-item':
          value = 'Q' + datavalue.value['numeric-id'];
          break;
        case 'time':
          value = wd_.normalizeWikidataTime(datavalue.value.time);
          break;
        default:
          value = null;
      }
      return value;
    } else {

    }
  };

}).call(this);

},{"./utils":11}],11:[function(require,module,exports){
// Generated by CoffeeScript 1.9.3
(function() {
  var wd_;

  wd_ = {};

  wd_.isNumericId = function(id) {
    return /^[0-9]+$/.test(id);
  };

  wd_.isWikidataId = function(id) {
    return /^(Q|P)[0-9]+$/.test(id);
  };

  wd_.isWikidataEntityId = function(id) {
    return /^Q[0-9]+$/.test(id);
  };

  wd_.isWikidataPropertyId = function(id) {
    return /^P[0-9]+$/.test(id);
  };

  wd_.normalizeId = function(id, numericId, type) {
    if (type == null) {
      type = 'Q';
    }
    if (wd_.isNumericId(id)) {
      if (numericId) {
        return id;
      } else {
        return "" + type + id;
      }
    } else if (wd_.isWikidataId(id)) {
      if (numericId) {
        return id.slice(1);
      } else {
        return id;
      }
    } else {
      throw new Error('invalid id');
    }
  };

  wd_.normalizeIds = function(ids, numericId, type) {
    if (type == null) {
      type = 'Q';
    }
    return ids.map(function(id) {
      return wd_.normalizeId(id, numericId, type);
    });
  };

  wd_.wikidataTimeToDateObject = function(wikidataTime) {
    var date, rest, sign;
    sign = wikidataTime[0];
    rest = wikidataTime.slice(1);
    if (sign === '-') {
      date = "-00" + rest;
      return new Date(date);
    } else {
      return new Date(rest);
    }
  };

  wd_.wikidataTimeToEpochTime = function(wikidataTime) {
    return wd_.wikidataTimeToDateObject(wikidataTime).getTime();
  };

  wd_.wikidataTimeToISOString = function(wikidataTime) {
    return wd_.wikidataTimeToDateObject(wikidataTime).toISOString();
  };

  wd_.normalizeWikidataTime = wd_.wikidataTimeToEpochTime;

  wd_.toPropertiesArray = function(obj) {
    if (typeof obj === 'string') {
      return obj = [obj];
    } else {
      return obj || [];
    }
  };

  module.exports = wd_;

}).call(this);

},{}],12:[function(require,module,exports){
// Generated by CoffeeScript 1.9.3
(function() {
  module.exports = {
    searchEntities: require('./queries/wikidata_search_entities'),
    getEntities: require('./queries/wikidata_get_entities'),
    getReverseClaims: require('./queries/wdq_get_reverse_claims'),
    simplifyClaims: require('./utils/simplify_claims'),
    parse: require('./utils/parse_responses'),
    utils: require('./utils/utils')
  };

}).call(this);

},{"./queries/wdq_get_reverse_claims":4,"./queries/wikidata_get_entities":5,"./queries/wikidata_search_entities":6,"./utils/parse_responses":8,"./utils/simplify_claims":10,"./utils/utils":11}]},{},[12])(12)
});