(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.wdk = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var toDateObject = require('./wikidata_time_to_date_object');

var helpers = {};
helpers.isNumericId = function (id) {
  return (/^[0-9]+$/.test(id)
  );
};
helpers.isEntityId = function (id) {
  return (/^(Q|P)[0-9]+$/.test(id)
  );
};
helpers.isItemId = function (id) {
  return (/^Q[0-9]+$/.test(id)
  );
};
helpers.isPropertyId = function (id) {
  return (/^P[0-9]+$/.test(id)
  );
};

helpers.getNumericId = function (id) {
  if (!helpers.isEntityId(id)) throw new Error('invalid wikidata id: ' + id);
  return id.replace(/Q|P/, '');
};

helpers.wikidataTimeToDateObject = toDateObject;

// Try to parse the date or return the input
var bestEffort = function bestEffort(fn) {
  return function (value) {
    try {
      return fn(value);
    } catch (err) {
      return value;
    }
  };
};

var toEpochTime = function toEpochTime(wikidataTime) {
  return toDateObject(wikidataTime).getTime();
};
var toISOString = function toISOString(wikidataTime) {
  return toDateObject(wikidataTime).toISOString();
};

helpers.wikidataTimeToEpochTime = bestEffort(toEpochTime);
helpers.wikidataTimeToISOString = bestEffort(toISOString);

module.exports = helpers;

},{"./wikidata_time_to_date_object":10}],2:[function(require,module,exports){
'use strict';

var _require = require('./helpers'),
    wikidataTimeToISOString = _require.wikidataTimeToISOString,
    wikidataTimeToEpochTime = _require.wikidataTimeToEpochTime;

var simple = function simple(datavalue) {
  return datavalue.value;
};

var monolingualtext = function monolingualtext(datavalue, options) {
  return options.keepRichValues ? datavalue.value : datavalue.value.text;
};

var item = function item(datavalue, options) {
  return prefixedId(datavalue, options.entityPrefix);
};

var property = function property(datavalue, options) {
  return prefixedId(datavalue, options.propertyPrefix);
};

var entityLetter = { item: 'Q', property: 'P' };
var prefixedId = function prefixedId(datavalue, prefix) {
  var value = datavalue.value;

  var id = value.id || entityLetter[value['entity-type']] + value['numeric-id'];
  return typeof prefix === 'string' ? prefix + ':' + id : id;
};

var quantity = function quantity(datavalue, options) {
  var value = datavalue.value;

  var amount = parseFloat(value.amount);
  if (options.keepRichValues) {
    var _amount = parseFloat(value.amount);
    var unit = value.unit.replace('http://www.wikidata.org/entity/', '');
    var upperBound = parseFloat(value.upperBound);
    var lowerBound = parseFloat(value.lowerBound);
    return { amount: _amount, unit: unit, upperBound: upperBound, lowerBound: lowerBound };
  } else {
    return amount;
  }
};

var coordinate = function coordinate(datavalue) {
  return [datavalue.value.latitude, datavalue.value.longitude];
};

var time = function time(datavalue, options) {
  return getTimeConverter(options.timeConverter)(datavalue.value.time);
};

var getTimeConverter = function getTimeConverter() {
  var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'iso';
  return timeConverters[key];
};

var identity = function identity(arg) {
  return arg;
};

var timeConverters = {
  iso: wikidataTimeToISOString,
  epoch: wikidataTimeToEpochTime,
  none: identity
};

var claimParsers = {
  string: simple,
  commonsMedia: simple,
  url: simple,
  'external-id': simple,
  math: simple,
  monolingualtext: monolingualtext,
  'wikibase-item': item,
  'wikibase-property': property,
  time: time,
  quantity: quantity,
  'globe-coordinate': coordinate,
  'geo-shape': simple,
  'tabular-data': simple
};

module.exports = function (datatype, datavalue, options) {
  // If you get an error like 'TypeError: claimParsers[datatype] is not a function'
  // it means that the current datatype isn't supported yet:
  // please report to https://github.com/maxlath/wikidata-sdk/issues
  return claimParsers[datatype](datavalue, options);
};

},{"./helpers":1}],3:[function(require,module,exports){
'use strict';

var simplifyEntity = require('./simplify_entity');

module.exports = {
  wd: {
    entities: function entities(res) {
      res = res.body || res;
      var _res = res,
          entities = _res.entities;

      Object.keys(entities).forEach(function (entityId) {
        entities[entityId] = simplifyEntity(entities[entityId]);
      });
      return entities;
    }
  }
};

},{"./simplify_entity":5}],4:[function(require,module,exports){
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var parseClaim = require('./parse_claim');

var _require = require('../utils/utils'),
    uniq = _require.uniq;

// Expects an entity 'claims' object
// Ex: entity.claims


var simplifyClaims = function simplifyClaims(claims) {
  for (var _len = arguments.length, options = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    options[_key - 1] = arguments[_key];
  }

  var _parseOptions = parseOptions(options),
      propertyPrefix = _parseOptions.propertyPrefix;

  var simpleClaims = {};
  for (var id in claims) {
    var propClaims = claims[id];
    if (propertyPrefix) {
      id = propertyPrefix + ':' + id;
    }
    simpleClaims[id] = simplifyPropertyClaims.apply(undefined, [propClaims].concat(options));
  }
  return simpleClaims;
};

// Expects the 'claims' array of a particular property
// Ex: entity.claims.P369
var simplifyPropertyClaims = function simplifyPropertyClaims(propClaims) {
  for (var _len2 = arguments.length, options = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    options[_key2 - 1] = arguments[_key2];
  }

  var _parseOptions2 = parseOptions(options),
      keepNonTruthy = _parseOptions2.keepNonTruthy,
      areSubSnaks = _parseOptions2.areSubSnaks;

  if (!(keepNonTruthy || areSubSnaks)) {
    propClaims = filterOutNonTruthyClaims(propClaims);
  }

  propClaims = propClaims.map(function (claim) {
    return simplifyClaim.apply(undefined, [claim].concat(options));
  }).filter(nonNull);

  // Deduplicate values unless we return a rich value object
  if (propClaims[0] && _typeof(propClaims[0]) !== 'object') {
    return uniq(propClaims);
  } else {
    return propClaims;
  }
};

var aggregatePerRank = function aggregatePerRank(aggregate, claim) {
  var rank = claim.rank;

  aggregate[rank] || (aggregate[rank] = []);
  aggregate[rank].push(claim);
  return aggregate;
};

var filterOutNonTruthyClaims = function filterOutNonTruthyClaims(claims) {
  var aggregate = claims.reduce(aggregatePerRank, {});
  // on truthyness: https://www.mediawiki.org/wiki/Wikibase/Indexing/RDF_Dump_Format#Truthy_statements
  return aggregate.preferred || aggregate.normal || [];
};

var nonNull = function nonNull(obj) {
  return obj != null;
};

// Expects a single claim object
// Ex: entity.claims.P369[0]
var simplifyClaim = function simplifyClaim(claim) {
  for (var _len3 = arguments.length, options = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    options[_key3 - 1] = arguments[_key3];
  }

  options = parseOptions(options);
  var _options = options,
      keepQualifiers = _options.keepQualifiers,
      keepReferences = _options.keepReferences,
      keepIds = _options.keepIds,
      keepHashes = _options.keepHashes;
  // tries to replace wikidata deep claim object by a simple value
  // e.g. a string, an entity Qid or an epoch time number

  var mainsnak = claim.mainsnak;


  var datatype, datavalue, isQualifierSnak, isReferenceSnak;
  if (mainsnak) {
    datatype = mainsnak.datatype;
    datavalue = mainsnak.datavalue;
    // Known case: snaktype set to `somevalue`
    if (!datavalue) return null;
  } else {
    // Should only happen in snaktype: `novalue` cases or alikes
    if (!(claim && claim.datavalue)) return null;
    // Qualifiers have no mainsnak, and define datatype, datavalue on claim
    datavalue = claim.datavalue;
    datatype = claim.datatype;
    // Duck typing the sub-snak type
    if (claim.hash) isQualifierSnak = true;else isReferenceSnak = true;
  }

  var value = parseClaim(datatype, datavalue, options);

  // Qualifiers should not attempt to keep sub-qualifiers or references
  if (isQualifierSnak) {
    if (keepHashes) return { value: value, hash: claim.hash };else return value;
  }

  if (isReferenceSnak) return value;

  // No need to test keepHashes as it has no effect if neither
  // keepQualifiers or keepReferences is true
  if (!(keepQualifiers || keepReferences || keepIds)) return value;

  // When keeping qualifiers or references, the value becomes an object
  // instead of a direct value
  var richValue = { value: value };

  // Using a new object so that the original options object isn't modified
  var subSnaksOptions = Object.assign({}, options, { areSubSnaks: true, keepHashes: keepHashes });

  if (keepQualifiers) {
    richValue.qualifiers = simplifyClaims(claim.qualifiers, subSnaksOptions);
  }

  if (keepReferences) {
    claim.references = claim.references || [];
    richValue.references = claim.references.map(function (refRecord) {
      var snaks = simplifyClaims(refRecord.snaks, subSnaksOptions);
      if (keepHashes) return { snaks: snaks, hash: refRecord.hash };else return snaks;
    });
  }

  if (keepIds) richValue.id = claim.id;

  return richValue;
};

var parseOptions = function parseOptions(options) {
  if (options == null) return {};

  if (options[0] && _typeof(options[0]) === 'object') return options[0];

  // Legacy interface

  var _options2 = _slicedToArray(options, 3),
      entityPrefix = _options2[0],
      propertyPrefix = _options2[1],
      keepQualifiers = _options2[2];

  return { entityPrefix: entityPrefix, propertyPrefix: propertyPrefix, keepQualifiers: keepQualifiers };
};

module.exports = { simplifyClaims: simplifyClaims, simplifyPropertyClaims: simplifyPropertyClaims, simplifyClaim: simplifyClaim };

},{"../utils/utils":21,"./parse_claim":2}],5:[function(require,module,exports){
'use strict';

var _require = require('./simplify_claims'),
    simplifyClaims = _require.simplifyClaims;

var simplify = require('./simplify_text_attributes');
var simplifySitelinks = require('./simplify_sitelinks');

module.exports = function (entity, options) {
  return {
    id: entity.id,
    type: entity.type,
    modified: entity.modified,
    labels: simplify.labels(entity.labels),
    descriptions: simplify.descriptions(entity.descriptions),
    aliases: simplify.aliases(entity.aliases),
    claims: simplifyClaims(entity.claims, options),
    sitelinks: simplifySitelinks(entity.sitelinks, options)
  };
};

},{"./simplify_claims":4,"./simplify_sitelinks":6,"./simplify_text_attributes":8}],6:[function(require,module,exports){
'use strict';

var _require = require('./sitelinks_helpers'),
    getSitelinkUrl = _require.getSitelinkUrl;

module.exports = function (sitelinks) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var addUrl = options.addUrl;

  return Object.keys(sitelinks).reduce(aggregateValues(sitelinks, addUrl), {});
};

var aggregateValues = function aggregateValues(sitelinks, addUrl) {
  return function (index, key) {
    var title = sitelinks[key].title;

    if (addUrl) {
      index[key] = { title: title, url: getSitelinkUrl(key, title) };
    } else {
      index[key] = title;
    }
    return index;
  };
};

},{"./sitelinks_helpers":9}],7:[function(require,module,exports){
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

module.exports = function (input) {
  if (typeof input === 'string') input = JSON.parse(input);

  var vars = input.head.vars;

  var results = input.results.bindings;

  if (vars.length === 1) {
    var varName = vars[0];
    return results.map(function (result) {
      return parseValue(result[varName]);
    })
    // filtering-out bnodes
    .filter(function (result) {
      return result != null;
    });
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
  return uri.replace('http://www.wikidata.org/entity/', '').replace('http://www.wikidata.org/prop/direct/', '');
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

},{}],8:[function(require,module,exports){
"use strict";

var simplifyTextAttributes = function simplifyTextAttributes(multivalue) {
  return function (data) {
    return Object.keys(data).reduce(aggregateValues(data, multivalue), {});
  };
};

var aggregateValues = function aggregateValues(data, multivalue) {
  return function (index, lang) {
    var obj = data[lang];
    index[lang] = multivalue ? obj.map(getValue) : obj.value;
    return index;
  };
};

var getValue = function getValue(obj) {
  return obj.value;
};

var singleValue = simplifyTextAttributes(false);

module.exports = {
  labels: singleValue,
  descriptions: singleValue,
  aliases: simplifyTextAttributes(true)
};

},{}],9:[function(require,module,exports){
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _require = require('../utils/utils'),
    fixedEncodeURIComponent = _require.fixedEncodeURIComponent,
    replaceSpaceByUnderscores = _require.replaceSpaceByUnderscores,
    isPlainObject = _require.isPlainObject;

var langPattern = /^[a-z]{2}[a-z_]{0,10}$/;

var _require2 = require('./helpers'),
    isPropertyId = _require2.isPropertyId;

var wikidataBase = 'https://www.wikidata.org/wiki/';

var getSitelinkUrl = function getSitelinkUrl(site, title) {
  if (isPlainObject(site)) {
    title = site.title;
    site = site.site;
  }

  if (!site) throw new Error('missing a site');
  if (!title) throw new Error('missing a title');

  if (site === 'commons') return 'https://commons.wikimedia.org/wiki/' + title;
  if (site === 'wikidata') {
    if (isPropertyId(title)) return wikidataBase + 'Property:' + title;
    return '' + wikidataBase + title;
  }

  var _getSitelinkData = getSitelinkData(site),
      lang = _getSitelinkData.lang,
      project = _getSitelinkData.project;

  title = fixedEncodeURIComponent(replaceSpaceByUnderscores(title));
  return 'https://' + lang + '.' + project + '.org/wiki/' + title;
};

var getSitelinkData = function getSitelinkData(site) {
  if (site === 'commons') return { lang: 'en', project: 'commons' };
  if (site === 'wikidata') return { lang: 'en', project: 'wikidata' };

  var _site$split = site.split('wik'),
      _site$split2 = _slicedToArray(_site$split, 2),
      lang = _site$split2[0],
      projectSuffix = _site$split2[1];

  if (!langPattern.test(lang)) throw new Error('invalid project lang: ' + lang);
  var project = projectsBySuffix[projectSuffix];
  if (!project) throw new Error('project not found');
  return { lang: lang, project: project };
};

var isSitelinkKey = function isSitelinkKey(site) {
  try {
    // relies on getSitelinkData validation
    getSitelinkData(site);
    return true;
  } catch (err) {
    return false;
  }
};

var projectsBySuffix = {
  i: 'wikipedia',
  isource: 'wikisource',
  iquote: 'wikiquote',
  tionary: 'wiktionary',
  ibooks: 'wikibooks',
  iversity: 'wikiversity',
  ivoyage: 'wikivoyage',
  inews: 'wikinews'
};

module.exports = { getSitelinkUrl: getSitelinkUrl, getSitelinkData: getSitelinkData, isSitelinkKey: isSitelinkKey };

},{"../utils/utils":21,"./helpers":1}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
'use strict';

var wdk = module.exports = {};

wdk.searchEntities = require('./queries/search_entities');
wdk.getEntities = require('./queries/get_entities');
wdk.getManyEntities = require('./queries/get_many_entities');
wdk.getWikidataIdsFromSitelinks = require('./queries/get_wikidata_ids_from_sitelinks');
wdk.sparqlQuery = require('./queries/sparql_query');
wdk.getReverseClaims = require('./queries/get_reverse_claims');
wdk.getRevisions = require('./queries/get_revisions');

wdk.parse = require('./helpers/parse_responses');

var claimsSimplifiers = require('./helpers/simplify_claims');
var simplifySparqlResults = require('./helpers/simplify_sparql_results');

wdk.simplify = require('../lib/helpers/simplify_text_attributes');
wdk.simplify.entity = require('../lib/helpers/simplify_entity');
wdk.simplify.claim = claimsSimplifiers.simplifyClaim;
wdk.simplify.propertyClaims = claimsSimplifiers.simplifyPropertyClaims;
wdk.simplify.claims = claimsSimplifiers.simplifyClaims;
wdk.simplify.sitelinks = require('../lib/helpers/simplify_sitelinks');
wdk.simplify.sparqlResults = simplifySparqlResults;

// Legacy
wdk.simplifySparqlResults = require('./helpers/simplify_sparql_results');
Object.assign(wdk, claimsSimplifiers);

// Aliases
wdk.getWikidataIdsFromWikipediaTitles = wdk.getWikidataIdsFromSitelinks;

var helpers = require('../lib/helpers/helpers');
var sitelinksHelpers = require('../lib/helpers/sitelinks_helpers');
Object.assign(wdk, helpers, sitelinksHelpers);

},{"../lib/helpers/helpers":1,"../lib/helpers/simplify_entity":5,"../lib/helpers/simplify_sitelinks":6,"../lib/helpers/simplify_text_attributes":8,"../lib/helpers/sitelinks_helpers":9,"./helpers/parse_responses":3,"./helpers/simplify_claims":4,"./helpers/simplify_sparql_results":7,"./queries/get_entities":12,"./queries/get_many_entities":13,"./queries/get_reverse_claims":14,"./queries/get_revisions":15,"./queries/get_wikidata_ids_from_sitelinks":16,"./queries/search_entities":17,"./queries/sparql_query":18}],12:[function(require,module,exports){
'use strict';

var buildUrl = require('../utils/build_url');

var _require = require('../utils/utils'),
    isPlainObject = _require.isPlainObject,
    forceArray = _require.forceArray,
    shortLang = _require.shortLang;

module.exports = function (ids, languages, props, format) {
  // Polymorphism: arguments can be passed as an object keys
  if (isPlainObject(ids)) {
    var _ids = ids;
    ids = _ids.ids;
    languages = _ids.languages;
    props = _ids.props;
    format = _ids.format;
  }

  format = format || 'json';

  // ids can't be let empty
  if (!(ids && ids.length > 0)) throw new Error('no id provided');

  // Allow to pass ids as a single string
  ids = forceArray(ids);

  if (ids.length > 50) {
    console.warn('getEntities accepts 50 ids max to match Wikidata API limitations:\n      this request won\'t get all the desired entities.\n      You can use getManyEntities instead to generate several request urls\n      to work around this limitation');
  }

  // Properties can be either one property as a string
  // or an array or properties;
  // either case me just want to deal with arrays

  var query = {
    action: 'wbgetentities',
    ids: ids.join('|'),
    format: format
  };

  if (languages) {
    languages = forceArray(languages).map(shortLang);
    query.languages = languages.join('|');
  }

  if (props && props.length > 0) query.props = forceArray(props).join('|');

  return buildUrl(query);
};

},{"../utils/build_url":19,"../utils/utils":21}],13:[function(require,module,exports){
'use strict';

var getEntities = require('./get_entities');

var _require = require('../utils/utils'),
    isPlainObject = _require.isPlainObject;

module.exports = function (ids, languages, props, format) {
  // Polymorphism: arguments can be passed as an object keys
  if (isPlainObject(ids)) {
    var _ids = ids;
    ids = _ids.ids;
    languages = _ids.languages;
    props = _ids.props;
    format = _ids.format;
  }

  if (!(ids instanceof Array)) throw new Error('getManyEntities expects an array of ids');

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

},{"../utils/utils":21,"./get_entities":12}],14:[function(require,module,exports){
'use strict';

var helpers = require('../helpers/helpers');
var sparqlQuery = require('./sparql_query');
// Fiter-out properties. Can't be filtered by
// `?subject a wikibase:Item`, as those triples are omitted
// https://www.mediawiki.org/wiki/Wikibase/Indexing/RDF_Dump_Format#WDQS_data_differences
var itemsOnly = 'FILTER NOT EXISTS { ?subject rdf:type wikibase:Property . } ';

module.exports = function (property, value) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var limit = options.limit,
      caseInsensitive = options.caseInsensitive,
      keepProperties = options.keepProperties;

  limit = limit || 1000;
  var sparqlFn = caseInsensitive ? caseInsensitiveValueQuery : directValueQuery;
  var valueString = getValueString(value);
  var filter = keepProperties ? '' : itemsOnly;
  var sparql = sparqlFn(property, valueString, filter, limit);
  return sparqlQuery(sparql);
};

function getValueString(value) {
  if (helpers.isItemId(value)) {
    value = 'wd:' + value;
  } else if (typeof value === 'string') {
    value = '\'' + value + '\'';
  }
  return value;
}

function directValueQuery(property, value, filter, limit) {
  return 'SELECT ?subject WHERE {\n      ?subject wdt:' + property + ' ' + value + ' .\n      ' + filter + '\n    }\n    LIMIT ' + limit;
}

// Discussion on how to make this query optimal:
// http://stackoverflow.com/q/43073266/3324977
function caseInsensitiveValueQuery(property, value, filter, limit) {
  return 'SELECT ?subject WHERE {\n    ?subject wdt:' + property + ' ?value .\n    FILTER (lcase(?value) = ' + value.toLowerCase() + ')\n    ' + filter + '\n  }\n  LIMIT ' + limit;
}

},{"../helpers/helpers":1,"./sparql_query":18}],15:[function(require,module,exports){
'use strict';

var buildUrl = require('../utils/build_url');

var _require = require('../utils/utils'),
    forceArray = _require.forceArray;

module.exports = function (ids) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  ids = forceArray(ids);
  var uniqueId = ids.length === 1;
  var query = {
    action: 'query',
    prop: 'revisions'
  };
  query.titles = ids.join('|');
  query.format = options.format || 'json';
  if (uniqueId) query.rvlimit = options.limit || 'max';
  if (uniqueId && options.start) query.rvstart = getEpochSeconds(options.start);
  if (uniqueId && options.end) query.rvend = getEpochSeconds(options.end);
  return buildUrl(query);
};

var getEpochSeconds = function getEpochSeconds(date) {
  // Return already formatted epoch seconds:
  // if a date in milliseconds appear to be earlier than 2000-01-01, that's probably
  // already seconds actually
  if (typeof date === 'number' && date < earliestPointInMs) return date;
  return Math.trunc(new Date(date).getTime() / 1000);
};

var earliestPointInMs = new Date('2000-01-01').getTime();

},{"../utils/build_url":19,"../utils/utils":21}],16:[function(require,module,exports){
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

  // Normalizing only works if there is only one site and title
  if (sites.length === 1 && titles.length === 1) {
    query.normalize = true;
  }

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

},{"../utils/build_url":19,"../utils/utils":21}],17:[function(require,module,exports){
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

},{"../utils/build_url":19,"../utils/utils":21}],18:[function(require,module,exports){
'use strict';

var _require = require('../utils/utils'),
    fixedEncodeURIComponent = _require.fixedEncodeURIComponent;

module.exports = function (sparql) {
  var query = fixedEncodeURIComponent(sparql);
  return 'https://query.wikidata.org/sparql?format=json&query=' + query;
};

},{"../utils/utils":21}],19:[function(require,module,exports){
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

},{"./querystring_lite":20,"querystring":24}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = {
  // Ex: keep only 'fr' in 'fr_FR'
  shortLang: function shortLang(language) {
    return language.toLowerCase().split(/[^a-z]/)[0];
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
  },

  // encodeURIComponent ignores !, ', (, ), and *
  // cf https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent#Description
  fixedEncodeURIComponent: function fixedEncodeURIComponent(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, encodeCharacter);
  },

  replaceSpaceByUnderscores: function replaceSpaceByUnderscores(str) {
    return str.replace(/\s/g, '_');
  },

  uniq: function uniq(array) {
    return Array.from(new Set(array));
  }
};

var encodeCharacter = function encodeCharacter(char) {
  return '%' + char.charCodeAt(0).toString(16);
};

},{}],22:[function(require,module,exports){
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

},{}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":22,"./encode":23}]},{},[11])(11)
});