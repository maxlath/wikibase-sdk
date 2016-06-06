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
  var wd_, wikidataTimeToDateObject;

  wikidataTimeToDateObject = require('./wikidata_time_to_date_object');

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

  wd_.getNumericId = function(id) {
    if (!wd_.isWikidataId(id)) {
      throw new Error("invalid wikidata id: " + id);
    }
    return id.replace(/Q|P/, '');
  };

  wd_.normalizeIds = function(ids, numericId, type) {
    if (type == null) {
      type = 'Q';
    }
    return ids.map(function(id) {
      return wd_.normalizeId(id, numericId, type);
    });
  };

  wd_.wikidataTimeToDateObject = wikidataTimeToDateObject;

  wd_.wikidataTimeToEpochTime = function(wikidataTime) {
    return wikidataTimeToDateObject(wikidataTime).getTime();
  };

  wd_.wikidataTimeToISOString = function(wikidataTime) {
    return wikidataTimeToDateObject(wikidataTime).toISOString();
  };

  wd_.normalizeWikidataTime = wd_.wikidataTimeToEpochTime;

  module.exports = wd_;

}).call(this);

},{"./wikidata_time_to_date_object":7}],5:[function(require,module,exports){
// Generated by CoffeeScript 1.9.3
(function() {
  var simplifyClaims, wd_;

  wd_ = require('./helpers');

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

},{"./helpers":4,"./simplify_claims":6}],6:[function(require,module,exports){
// Generated by CoffeeScript 1.9.3
(function() {
  var nonNull, simplifyClaim, simplifyClaims, simplifyPropertyClaims, wd_;

  wd_ = require('./helpers');

  simplifyClaims = function(claims) {
    var id, propClaims, simpleClaims;
    simpleClaims = {};
    for (id in claims) {
      propClaims = claims[id];
      simpleClaims[id] = simplifyPropertyClaims(propClaims);
    }
    return simpleClaims;
  };

  simplifyPropertyClaims = function(propClaims) {
    return propClaims.map(simplifyClaim).filter(nonNull);
  };

  nonNull = function(obj) {
    return obj != null;
  };

  simplifyClaim = function(claim) {
    var datatype, datavalue, mainsnak;
    mainsnak = claim.mainsnak;
    if (mainsnak == null) {
      return null;
    }
    datatype = mainsnak.datatype, datavalue = mainsnak.datavalue;
    if (datavalue == null) {
      return null;
    }
    switch (datatype) {
      case 'string':
      case 'commonsMedia':
      case 'url':
      case 'external-id':
        return datavalue.value;
      case 'monolingualtext':
        return datavalue.value.text;
      case 'wikibase-item':
        return 'Q' + datavalue.value['numeric-id'];
      case 'time':
        return wd_.normalizeWikidataTime(datavalue.value.time);
      default:
        return null;
    }
  };

  module.exports = {
    simplifyClaims: simplifyClaims,
    simplifyPropertyClaims: simplifyPropertyClaims,
    simplifyClaim: simplifyClaim
  };

}).call(this);

},{"./helpers":4}],7:[function(require,module,exports){
// Generated by CoffeeScript 1.9.3
(function() {
  var fullDateData, negativeDate, parseInvalideDate, positiveDate;

  module.exports = function(wikidataTime) {
    var date, rest, sign;
    sign = wikidataTime[0];
    rest = wikidataTime.slice(1);
    date = fullDateData(sign, rest);
    if (date.toString() === 'Invalid Date') {
      return parseInvalideDate(sign, rest);
    } else {
      return date;
    }
  };

  fullDateData = function(sign, rest) {
    if (sign === '-') {
      return negativeDate(rest);
    } else {
      return positiveDate(rest);
    }
  };

  positiveDate = function(rest) {
    return new Date(rest);
  };

  negativeDate = function(rest) {
    var date;
    date = "-00" + rest;
    return new Date(date);
  };

  parseInvalideDate = function(sign, rest) {
    var day, month, ref, year;
    ref = rest.split('T')[0].split('-'), year = ref[0], month = ref[1], day = ref[2];
    return fullDateData(sign, year);
  };

}).call(this);

},{}],8:[function(require,module,exports){
// Generated by CoffeeScript 1.9.3
(function() {
  var buildUrl, forceArray, isPlainObject, parseSite, ref, shortLang;

  buildUrl = require('../utils/build_url');

  ref = require('../utils/utils'), isPlainObject = ref.isPlainObject, forceArray = ref.forceArray, shortLang = ref.shortLang;

  module.exports = function(titles, sites, languages, props, format) {
    var query, ref1;
    if (isPlainObject(titles)) {
      ref1 = titles, titles = ref1.titles, sites = ref1.sites, languages = ref1.languages, props = ref1.props, format = ref1.format;
    }
    format || (format = 'json');
    if ((titles == null) || titles.length === 0) {
      throw new Error('no title provided');
    }
    if ((sites == null) || sites.length === 0) {
      sites = ['enwiki'];
    }
    titles = forceArray(titles);
    sites = forceArray(sites).map(parseSite);
    props = forceArray(props);
    query = {
      action: 'wbgetentities',
      titles: titles.join('|'),
      sites: sites.join('|'),
      format: format
    };
    if (languages != null) {
      languages = forceArray(languages).map(shortLang);
      query.languages = languages.join('|');
    }
    if ((props != null ? props.length : void 0) > 0) {
      query.props = props.join('|');
    }
    return buildUrl('wikidata', query);
  };

  parseSite = function(site) {
    if (site.length === 2) {
      return site + "wiki";
    } else {
      return site;
    }
  };

}).call(this);

},{"../utils/build_url":15,"../utils/utils":17}],9:[function(require,module,exports){
// Generated by CoffeeScript 1.9.3
(function() {
  var buildUrl, wd_, wdq_;

  buildUrl = require('../utils/build_url');

  wd_ = require('../helpers/helpers');

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

},{"../helpers/helpers":4,"../utils/build_url":15}],10:[function(require,module,exports){
// Generated by CoffeeScript 1.9.3
(function() {
  var buildUrl, forceArray, isPlainObject, ref, shortLang, wd_;

  wd_ = require('../helpers/helpers');

  buildUrl = require('../utils/build_url');

  ref = require('../utils/utils'), isPlainObject = ref.isPlainObject, forceArray = ref.forceArray, shortLang = ref.shortLang;

  module.exports = function(ids, languages, props, format) {
    var query, ref1;
    if (isPlainObject(ids)) {
      ref1 = ids, ids = ref1.ids, languages = ref1.languages, props = ref1.props, format = ref1.format;
    }
    format || (format = 'json');
    if (!((ids != null) || ids.length === 0)) {
      throw new Error('no id provided');
    }
    if (ids.length > 50) {
      console.warn("getEntities accepts 50 ids max to match Wikidata API limitations:\nthis request won't get all the desired entities.\nYou can use getManyEntities instead to generate several request urls\nto work around this limitation");
    }
    ids = wd_.normalizeIds(forceArray(ids));
    props = forceArray(props);
    query = {
      action: 'wbgetentities',
      ids: ids.join('|'),
      format: format
    };
    if (languages != null) {
      languages = forceArray(languages).map(shortLang);
      query.languages = languages.join('|');
    }
    if ((props != null ? props.length : void 0) > 0) {
      query.props = props.join('|');
    }
    return buildUrl('wikidata', query);
  };

}).call(this);

},{"../helpers/helpers":4,"../utils/build_url":15,"../utils/utils":17}],11:[function(require,module,exports){
// Generated by CoffeeScript 1.9.3
(function() {
  var getEntities, getIdsGroups, isPlainObject;

  getEntities = require('./wikidata_get_entities');

  isPlainObject = require('../utils/utils').isPlainObject;

  module.exports = function(ids, languages, props, format) {
    var ref;
    if (isPlainObject(ids)) {
      ref = ids, ids = ref.ids, languages = ref.languages, props = ref.props, format = ref.format;
    }
    if (!(ids instanceof Array)) {
      throw new Error("getManyEntities expects an array of ids");
    }
    return getIdsGroups(ids).map(function(idsGroup) {
      return getEntities(idsGroup, languages, props, format);
    });
  };

  getIdsGroups = function(ids) {
    var group, groups;
    groups = [];
    while (ids.length > 0) {
      group = ids.slice(0, 50);
      ids = ids.slice(50);
      groups.push(group);
    }
    return groups;
  };

}).call(this);

},{"../utils/utils":17,"./wikidata_get_entities":10}],12:[function(require,module,exports){
// Generated by CoffeeScript 1.9.3
(function() {
  var buildUrl, isPlainObject, wd_;

  wd_ = require('../helpers/helpers');

  buildUrl = require('../utils/build_url');

  isPlainObject = require('../utils/utils').isPlainObject;

  module.exports = function(search, language, limit, format, uselang) {
    var ref;
    if (isPlainObject(search)) {
      ref = search, search = ref.search, language = ref.language, limit = ref.limit, format = ref.format, uselang = ref.uselang;
    }
    if (!((search != null ? search.length : void 0) > 0)) {
      throw new Error("search can't be empty");
    }
    language || (language = 'en');
    uselang || (uselang = language);
    limit || (limit = '20');
    format || (format = 'json');
    return buildUrl('wikidata', {
      action: 'wbsearchentities',
      search: search,
      language: language,
      limit: limit,
      format: format,
      uselang: uselang
    });
  };

}).call(this);

},{"../helpers/helpers":4,"../utils/build_url":15,"../utils/utils":17}],13:[function(require,module,exports){
// Generated by CoffeeScript 1.9.3
(function() {
  var identifyVars, isLabelKey, parseUri, parseValue,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  module.exports = function(input) {
    var ref, results, varName, vars, varsWithLabel, varsWithout;
    if (typeof input === 'string') {
      input = JSON.parse(input);
    }
    vars = input.head.vars;
    results = input.results.bindings;
    if (vars.length === 1) {
      varName = vars[0];
      return results.map(function(result) {
        return parseValue(result[varName]);
      });
    } else {
      ref = identifyVars(vars), varsWithLabel = ref[0], varsWithout = ref[1];
      return results.map(function(result) {
        var i, j, len, len1, simpifiedResult;
        simpifiedResult = {};
        for (i = 0, len = varsWithLabel.length; i < len; i++) {
          varName = varsWithLabel[i];
          simpifiedResult[varName] = {
            value: parseValue(result[varName]),
            label: result[varName + "Label"].value
          };
        }
        for (j = 0, len1 = varsWithout.length; j < len1; j++) {
          varName = varsWithout[j];
          simpifiedResult[varName] = parseValue(result[varName]);
        }
        return simpifiedResult;
      });
    }
  };

  parseValue = function(valueOjb) {
    switch (valueOjb.type) {
      case 'uri':
        return parseUri(valueOjb.value);
      default:
        return valueOjb.value;
    }
  };

  parseUri = function(uri) {
    return uri.replace('http://www.wikidata.org/entity/', '');
  };

  isLabelKey = function(key) {
    return /^\w+Label$/.test(key);
  };

  identifyVars = function(vars) {
    var i, len, ref, varName, varsWithLabel, varsWithoutLabel;
    varsWithLabel = [];
    varsWithoutLabel = [];
    for (i = 0, len = vars.length; i < len; i++) {
      varName = vars[i];
      if (ref = varName + "Label", indexOf.call(vars, ref) >= 0) {
        varsWithLabel.push(varName);
      } else if (!/^\w+Label$/.test(varName)) {
        varsWithoutLabel.push(varName);
      }
    }
    return [varsWithLabel, varsWithoutLabel];
  };

}).call(this);

},{}],14:[function(require,module,exports){
// Generated by CoffeeScript 1.9.3
(function() {
  module.exports = function(sparql) {
    var query;
    query = encodeURIComponent(sparql);
    return "https://query.wikidata.org/sparql?format=json&query=" + query;
  };

}).call(this);

},{}],15:[function(require,module,exports){
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

},{"./querystring_lite":16,"querystring":3}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
// Generated by CoffeeScript 1.9.3
(function() {
  module.exports = {
    shortLang: function(language) {
      return language.slice(0, 3);
    },
    forceArray: function(array) {
      if (typeof array === 'string') {
        array = [array];
      }
      return array || [];
    },
    isPlainObject: function(obj) {
      if (obj == null) {
        return false;
      }
      if (typeof obj !== 'object') {
        return false;
      }
      if (obj instanceof Array) {
        return false;
      }
      return true;
    }
  };

}).call(this);

},{}],18:[function(require,module,exports){
// Generated by CoffeeScript 1.9.3
(function() {
  var helpers, k, ref, simplifyClaim, simplifyClaims, simplifyPropertyClaims, v, wdk;

  module.exports = wdk = {};

  helpers = require('./helpers/helpers');

  wdk.searchEntities = require('./queries/wikidata_search_entities');

  wdk.getEntities = require('./queries/wikidata_get_entities');

  wdk.getManyEntities = require('./queries/wikidata_get_many_entities');

  wdk.getWikidataIdsFromSitelinks = require('./queries/get_wikidata_ids_from_sitelinks');

  wdk.sparqlQuery = require('./queries/wikidata_sparql_query');

  wdk.getReverseClaims = require('./queries/wdq_get_reverse_claims');

  wdk.parse = require('./helpers/parse_responses');

  ref = require('./helpers/simplify_claims'), simplifyClaim = ref.simplifyClaim, simplifyPropertyClaims = ref.simplifyPropertyClaims, simplifyClaims = ref.simplifyClaims;

  wdk.simplifyClaim = simplifyClaim;

  wdk.simplifyPropertyClaims = simplifyPropertyClaims;

  wdk.simplifyClaims = simplifyClaims;

  wdk.simplifySparqlResults = require('./queries/wikidata_simplify_sparql_results');

  wdk.getWikidataIdsFromWikipediaTitles = wdk.getWikidataIdsFromSitelinks;

  wdk.helpers = helpers;

  for (k in helpers) {
    v = helpers[k];
    wdk[k] = v;
  }

}).call(this);

},{"./helpers/helpers":4,"./helpers/parse_responses":5,"./helpers/simplify_claims":6,"./queries/get_wikidata_ids_from_sitelinks":8,"./queries/wdq_get_reverse_claims":9,"./queries/wikidata_get_entities":10,"./queries/wikidata_get_many_entities":11,"./queries/wikidata_search_entities":12,"./queries/wikidata_simplify_sparql_results":13,"./queries/wikidata_sparql_query":14}]},{},[18])(18)
});