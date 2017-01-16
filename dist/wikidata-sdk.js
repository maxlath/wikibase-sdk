(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.wdk = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var wikidataTimeToDateObject = require('./wikidata_time_to_date_object');

var helpers = {};
helpers.isNumericId = function (id) {
  return (/^[0-9]+$/.test(id)
  );
};
helpers.isWikidataId = function (id) {
  return (/^(Q|P)[0-9]+$/.test(id)
  );
};
helpers.isWikidataEntityId = function (id) {
  return (/^Q[0-9]+$/.test(id)
  );
};
helpers.isWikidataPropertyId = function (id) {
  return (/^P[0-9]+$/.test(id)
  );
};

helpers.normalizeId = function (id, numericId) {
  var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'Q';

  if (helpers.isNumericId(id)) {
    return numericId ? id : '' + type + id;
  } else if (helpers.isWikidataId(id)) {
    return numericId ? id.slice(1) : id;
  } else {
    throw new Error('invalid id');
  }
};

helpers.getNumericId = function (id) {
  if (!helpers.isWikidataId(id)) throw new Error('invalid wikidata id: ' + id);
  return id.replace(/Q|P/, '');
};

helpers.normalizeIds = function (ids, numericId) {
  var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'Q';

  return ids.map(function (id) {
    return helpers.normalizeId(id, numericId, type);
  });
};

helpers.wikidataTimeToDateObject = wikidataTimeToDateObject;

helpers.wikidataTimeToEpochTime = function (wikidataTime) {
  return wikidataTimeToDateObject(wikidataTime).getTime();
};

helpers.wikidataTimeToISOString = function (wikidataTime) {
  return wikidataTimeToDateObject(wikidataTime).toISOString();
};

// keeping normalizeWikidataTime as legacy
helpers.normalizeWikidataTime = helpers.wikidataTimeToEpochTime;

module.exports = helpers;

},{"./wikidata_time_to_date_object":4}],2:[function(require,module,exports){
'use strict';

var simplifyClaims = require('./simplify_claims');

module.exports = {
  wd: {
    entities: function entities(res) {
      res = res.body || res;
      var _res = res,
          entities = _res.entities;

      for (var id in entities) {
        var entity = entities[id];
        entity.claims = simplifyClaims(entity.claims);
      }
      return entities;
    }
  }
};

},{"./simplify_claims":3}],3:[function(require,module,exports){
'use strict';

var helpers = require('./helpers');

// Expects an entity 'claims' object
// Ex: entity.claims
var simplifyClaims = function simplifyClaims(claims, entityPrefix, propertyPrefix, keepQualifiers) {
  var simpleClaims = {};
  for (var id in claims) {
    var propClaims = claims[id];
    if (propertyPrefix) {
      id = propertyPrefix + ':' + id;
    }
    simpleClaims[id] = simplifyPropertyClaims(propClaims, entityPrefix, propertyPrefix, keepQualifiers);
  }
  return simpleClaims;
};

// Expects the 'claims' array of a particular property
// Ex: entity.claims.P369
var simplifyPropertyClaims = function simplifyPropertyClaims(propClaims, entityPrefix, propertyPrefix, keepQualifiers) {
  return propClaims.map(function (claim) {
    return simplifyClaim(claim, entityPrefix, propertyPrefix, keepQualifiers);
  }).filter(nonNull);
};

var nonNull = function nonNull(obj) {
  return obj != null;
};

// Expects a single claim object
// Ex: entity.claims.P369[0]
var simplifyClaim = function simplifyClaim(claim, entityPrefix, propertyPrefix, keepQualifiers) {
  // tries to replace wikidata deep claim object by a simple value
  // e.g. a string, an entity Qid or an epoch time number
  var mainsnak = claim.mainsnak,
      qualifiers = claim.qualifiers;

  // should only happen in snaktype: `novalue` cases or alikes

  if (mainsnak == null) return null;

  var datatype = mainsnak.datatype,
      datavalue = mainsnak.datavalue;
  // known case: snaktype set to `somevalue`

  if (datavalue == null) return null;

  var value = null;

  switch (datatype) {
    case 'string':
    case 'commonsMedia':
    case 'url':
    case 'external-id':
      value = datavalue.value;
      break;
    case 'monolingualtext':
      value = datavalue.value.text;
      break;
    case 'wikibase-item':
      value = prefixedId(datavalue, entityPrefix);
      break;
    case 'wikibase-property':
      value = prefixedId(datavalue, propertyPrefix);
      break;
    case 'time':
      value = helpers.normalizeWikidataTime(datavalue.value.time);
      break;
    case 'quantity':
      value = parseFloat(datavalue.value.amount);
      break;
    case 'globe-coordinate':
      value = getLatLngFromCoordinates(datavalue.value);
      break;
  }

  if (keepQualifiers) {
    var simpleQualifiers = {};

    for (var qualifierProp in qualifiers) {
      simpleQualifiers[qualifierProp] = qualifiers[qualifierProp].map(prepareQualifierClaim);
    }

    return {
      value: value,
      qualifiers: simplifyClaims(simpleQualifiers, entityPrefix, propertyPrefix)
    };
  } else {
    return value;
  }
};

var prefixedId = function prefixedId(datavalue, prefix) {
  var id = datavalue.value.id;

  return typeof prefix === 'string' ? prefix + ':' + id : id;
};

var getLatLngFromCoordinates = function getLatLngFromCoordinates(value) {
  return [value.latitude, value.longitude];
};

var prepareQualifierClaim = function prepareQualifierClaim(claim) {
  return { mainsnak: claim };
};

module.exports = {
  simplifyClaims: simplifyClaims,
  simplifyPropertyClaims: simplifyPropertyClaims,
  simplifyClaim: simplifyClaim
};

},{"./helpers":1}],4:[function(require,module,exports){
'use strict';

module.exports = function (wikidataTime) {
  var sign = wikidataTime[0];
  var rest = wikidataTime.slice(1);
  var date = fullDateData(sign, rest);

  if (date.toString() === 'Invalid Date') {
    return parseInvalideDate(sign, rest);
  } else {
    return date;
  }
};

var fullDateData = function fullDateData(sign, rest) {
  return sign === '-' ? negativeDate(rest) : positiveDate(rest);
};

var positiveDate = function positiveDate(rest) {
  return new Date(rest);
};
var negativeDate = function negativeDate(rest) {
  // using ISO8601 expanded notation for negative years: adding 2 leading zeros
  var date = '-00' + rest;
  return new Date(date);
};

var parseInvalideDate = function parseInvalideDate(sign, rest) {
  // This is probably a date of unsuffisient precision
  // such as 1953-00-00T00:00:00Z, thus invalid
  // It should at least have a year, so let's fallback to ${year}-01-01
  var year = rest.split('T')[0].split('-')[0];
  return fullDateData(sign, year);
};

},{}],5:[function(require,module,exports){
'use strict';

var wdk = module.exports = {};

wdk.searchEntities = require('./queries/search_entities');
wdk.getEntities = require('./queries/get_entities');
wdk.getManyEntities = require('./queries/get_many_entities');
wdk.getWikidataIdsFromSitelinks = require('./queries/get_wikidata_ids_from_sitelinks');
wdk.sparqlQuery = require('./queries/sparql_query');
wdk.getReverseClaims = require('./queries/get_reverse_claims');
wdk.parse = require('./helpers/parse_responses');

var _require = require('./helpers/simplify_claims'),
    simplifyClaim = _require.simplifyClaim,
    simplifyPropertyClaims = _require.simplifyPropertyClaims,
    simplifyClaims = _require.simplifyClaims;

wdk.simplifyClaim = simplifyClaim;
wdk.simplifyPropertyClaims = simplifyPropertyClaims;
wdk.simplifyClaims = simplifyClaims;

wdk.simplifySparqlResults = require('./queries/simplify_sparql_results');

// Aliases
wdk.getWikidataIdsFromWikipediaTitles = wdk.getWikidataIdsFromSitelinks;

// Making helpers both available from root
// and from wdk.helpers
var helpers = require('./helpers/helpers');
wdk.helpers = helpers;
// equivalent to _.extend wdk, helpers
for (var key in helpers) {
  wdk[key] = helpers[key];
}

},{"./helpers/helpers":1,"./helpers/parse_responses":2,"./helpers/simplify_claims":3,"./queries/get_entities":6,"./queries/get_many_entities":7,"./queries/get_reverse_claims":8,"./queries/get_wikidata_ids_from_sitelinks":9,"./queries/search_entities":10,"./queries/simplify_sparql_results":11,"./queries/sparql_query":12}],6:[function(require,module,exports){
'use strict';

var helpers = require('../helpers/helpers');
var buildUrl = require('../utils/build_url');

var _require = require('../utils/utils'),
    isPlainObject = _require.isPlainObject,
    forceArray = _require.forceArray,
    shortLang = _require.shortLang;

module.exports = function (ids, languages, props, format) {
  // polymorphism: arguments can be passed as an object keys
  if (isPlainObject(ids)) {
    // Not using destructuring assigment there as it messes with both babel and standard
    var params = ids;
    ids = params.ids;
    languages = params.languages;
    props = params.props;
    format = params.format;
  }

  format = format || 'json';

  // ids can't be let empty
  if (!(ids && ids.length > 0)) throw new Error('no id provided');

  if (ids.length > 50) {
    console.warn('getEntities accepts 50 ids max to match Wikidata API limitations:\n      this request won\'t get all the desired entities.\n      You can use getManyEntities instead to generate several request urls\n      to work around this limitation');
  }

  // Properties can be either one property as a string
  // or an array or properties;
  // either case me just want to deal with arrays
  ids = helpers.normalizeIds(forceArray(ids));
  props = forceArray(props);

  var query = {
    action: 'wbgetentities',
    ids: ids.join('|'),
    format: format
  };

  if (languages) {
    languages = forceArray(languages).map(shortLang);
    query.languages = languages.join('|');
  }

  if (props && props.length > 0) query.props = props.join('|');

  return buildUrl(query);
};

},{"../helpers/helpers":1,"../utils/build_url":13,"../utils/utils":15}],7:[function(require,module,exports){
'use strict';

var _templateObject = _taggedTemplateLiteral(['getManyEntities expects an array of ids'], ['getManyEntities expects an array of ids']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var getEntities = require('./get_entities');

var _require = require('../utils/utils'),
    isPlainObject = _require.isPlainObject;

module.exports = function (ids, languages, props, format) {
  // polymorphism: arguments can be passed as an object keys
  if (isPlainObject(ids)) {
    // Not using destructuring assigment there as it messes with both babel and standard
    var params = ids;
    ids = params.ids;
    languages = params.languages;
    props = params.props;
    format = params.format;
  }

  if (!(ids instanceof Array)) throw new (Error(_templateObject))();

  return getIdsGroups(ids).map(function (idsGroup) {
    return getEntities(idsGroup, languages, props, format);
  });
};

var getIdsGroups = function getIdsGroups(ids) {
  var groups = [];
  while (ids.length > 0) {
    var group = ids.slice(0, 50);
    ids = ids.slice(50);
    groups.push(group);
  }
  return groups;
};

},{"../utils/utils":15,"./get_entities":6}],8:[function(require,module,exports){
'use strict';

var helpers = require('../helpers/helpers');
var sparqlQuery = require('./sparql_query');

module.exports = function (property, value) {
  var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1000;

  if (helpers.isWikidataEntityId(value)) {
    value = 'wd:' + value;
  } else if (typeof value === 'string') {
    value = '`' + value + '`';
  }

  var sparql = '\n    SELECT ?subject WHERE {\n      ?subject wdt:' + property + ' ' + value + ' .\n    }\n    LIMIT ' + limit + '\n    ';

  return sparqlQuery(sparql);
};

},{"../helpers/helpers":1,"./sparql_query":12}],9:[function(require,module,exports){
'use strict';

var buildUrl = require('../utils/build_url');

var _require = require('../utils/utils'),
    isPlainObject = _require.isPlainObject,
    forceArray = _require.forceArray,
    shortLang = _require.shortLang;

module.exports = function (titles, sites, languages, props, format) {
  // polymorphism: arguments can be passed as an object keys
  if (isPlainObject(titles)) {
    // Not using destructuring assigment there as it messes with both babel and standard
    var params = titles;
    titles = params.titles;
    sites = params.sites;
    languages = params.languages;
    props = params.props;
    format = params.format;
  }

  format = format || 'json';

  // titles cant be let empty
  if (!(titles && titles.length > 0)) throw new Error('no title provided');
  // default to the English Wikipedia
  if (!(sites && sites.length > 0)) sites = ['enwiki'];

  // Properties can be either one property as a string
  // or an array or properties;
  // either case me just want to deal with arrays
  titles = forceArray(titles);
  sites = forceArray(sites).map(parseSite);
  props = forceArray(props);

  var query = {
    action: 'wbgetentities',
    titles: titles.join('|'),
    sites: sites.join('|'),
    format: format
  };

  if (languages) {
    languages = forceArray(languages).map(shortLang);
    query.languages = languages.join('|');
  }

  if (props && props.length > 0) query.props = props.join('|');

  return buildUrl(query);
};

// convert 2 letters language code to Wikipedia sitelinks code
var parseSite = function parseSite(site) {
  return site.length === 2 ? site + 'wiki' : site;
};

},{"../utils/build_url":13,"../utils/utils":15}],10:[function(require,module,exports){
'use strict';

var buildUrl = require('../utils/build_url');

var _require = require('../utils/utils'),
    isPlainObject = _require.isPlainObject;

module.exports = function (search, language, limit, format, uselang) {
  // polymorphism: arguments can be passed as an object keys
  if (isPlainObject(search)) {
    // Not using destructuring assigment there as it messes with both babel and standard
    var params = search;
    search = params.search;
    language = params.language;
    limit = params.limit;
    format = params.format;
    uselang = params.uselang;
  }

  if (!(search && search.length > 0)) throw new Error("search can't be empty");

  language = language || 'en';
  uselang = uselang || language;
  limit = limit || '20';
  format = format || 'json';

  return buildUrl({
    action: 'wbsearchentities',
    search: search,
    language: language,
    limit: limit,
    format: format,
    uselang: uselang
  });
};

},{"../utils/build_url":13,"../utils/utils":15}],11:[function(require,module,exports){
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function (input) {
  if (typeof input === 'string') input = JSON.parse(input);

  var vars = input.head.vars;

  var results = input.results.bindings;

  if (vars.length === 1) {
    var _ret = function () {
      var varName = vars[0];
      return {
        v: results.map(function (result) {
          return parseValue(result[varName]);
        })
        // filtering-out bnodes
        .filter(function (result) {
          return result != null;
        })
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  } else {
    var _identifyVars = identifyVars(vars),
        _identifyVars2 = _slicedToArray(_identifyVars, 2),
        varsWithLabel = _identifyVars2[0],
        varsWithout = _identifyVars2[1];

    return results.map(getSimplifiedResult(varsWithLabel, varsWithout));
  }
};

var parseValue = function parseValue(valueObj) {
  if (!valueObj) return;
  var datatype = valueObj.datatype;

  datatype = datatype && datatype.replace('http://www.w3.org/2001/XMLSchema#', '');
  var parser = parsers[valueObj.type] || getDatatypesParsers(datatype);
  return parser(valueObj);
};

var parsers = {
  uri: function uri(valueObj) {
    return parseUri(valueObj.value);
  },
  // blank nodes will be filtered-out in order to get things simple
  bnode: function bnode() {
    return null;
  }
};

var numberParser = function numberParser(valueObj) {
  return parseFloat(valueObj.value);
};

var getDatatypesParsers = function getDatatypesParsers(datatype) {
  datatype = datatype && datatype.replace('http://www.w3.org/2001/XMLSchema#', '');
  return datatypesParsers[datatype] || passValue;
};

var datatypesParsers = {
  decimal: numberParser,
  integer: numberParser,
  float: numberParser,
  double: numberParser,
  boolean: function boolean(valueObj) {
    return valueObj.value === 'true';
  }
};

// return the raw value if the datatype is missing
var passValue = function passValue(valueObj) {
  return valueObj.value;
};

var parseUri = function parseUri(uri) {
  return uri.replace('http://www.wikidata.org/entity/', '');
};

var identifyVars = function identifyVars(vars) {
  var varsWithLabel = [];
  var varsWithoutLabel = [];

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = vars[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var varName = _step.value;

      if (vars.indexOf(varName + 'Label') > -1) {
        varsWithLabel.push(varName);
      } else if (!/^\w+Label$/.test(varName)) {
        varsWithoutLabel.push(varName);
      }
      // letting aside `${varName}Label` vars
      // as they will simply be embedded in varName results
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return [varsWithLabel, varsWithoutLabel];
};

var getSimplifiedResult = function getSimplifiedResult(varsWithLabel, varsWithout) {
  return function (result) {
    var simplifiedResult = {};
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = varsWithLabel[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var varName = _step2.value;

        var value = parseValue(result[varName]);
        if (value != null) {
          var label = result[varName + 'Label'] && result[varName + 'Label'].value;
          simplifiedResult[varName] = { value: value, label: label };
        }
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = varsWithout[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var _varName = _step3.value;

        simplifiedResult[_varName] = parseValue(result[_varName]);
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }

    return simplifiedResult;
  };
};

},{}],12:[function(require,module,exports){
"use strict";

module.exports = function (sparql) {
  var query = encodeURIComponent(sparql);
  return "https://query.wikidata.org/sparql?format=json&query=" + query;
};

},{}],13:[function(require,module,exports){
'use strict';

var wikidataApiRoot = 'https://www.wikidata.org/w/api.php';
var isBrowser = typeof location !== 'undefined' && typeof document !== 'undefined';
var qs = isBrowser ? require('./querystring_lite') : require('querystring');

module.exports = function (queryObj) {
  // Request CORS headers if the request is made from a browser
  // See https://www.wikidata.org/w/api.php ('origin' parameter)
  if (isBrowser) queryObj.origin = '*';
  return wikidataApiRoot + '?' + qs.stringify(queryObj);
};

},{"./querystring_lite":14,"querystring":18}],14:[function(require,module,exports){
'use strict';

module.exports = {
  stringify: function stringify(queryObj) {
    var qstring = '';
    for (var key in queryObj) {
      var value = queryObj[key];
      if (value) qstring += '&' + key + '=' + value;
    }

    qstring = qstring.slice(1);

    // encodeURI should be accessible in a browser environment
    // otherwise if neither node.js querystring nor encodeURI
    // are accessible, just return the string
    if (encodeURI) return encodeURI(qstring);
    return qstring;
  }
};

},{}],15:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = {
  // languages have to be 2-letters language codes
  shortLang: function shortLang(language) {
    return language.slice(0, 2);
  },

  // a polymorphism helper:
  // accept either a string or an array and return an array
  forceArray: function forceArray(array) {
    if (typeof array === 'string') array = [array];
    return array || [];
  },

  // simplistic implementation to filter-out arrays
  isPlainObject: function isPlainObject(obj) {
    if (!obj || (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object' || obj instanceof Array) return false;
    return true;
  }
};

},{}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":16,"./encode":17}]},{},[5])(5)
});