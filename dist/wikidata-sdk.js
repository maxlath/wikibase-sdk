(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.wdk = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
helpers.isGuid = function (guid) {
  return (/^(Q|P|L)\d+\$[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(guid)
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
      value = value.time || value;
      return value.replace('-00-00', '-01-01');
    }
  };
};

var toEpochTime = function toEpochTime(wikidataTime) {
  return toDateObject(wikidataTime).getTime();
};
var toISOString = function toISOString(wikidataTime) {
  return toDateObject(wikidataTime).toISOString();
};

// A date format that knows just three precisions:
// 'yyyy', 'yyyy-mm', and 'yyyy-mm-dd' (including negative and non-4 digit years)
// Should be able to handle the old and the new Wikidata time:
// - in the old one, units below the precision where set to 00
// - in the new one, those months and days are set to 01 in those cases,
//   so when we can access the full claim object, we check the precision
//   to recover the old format
var toSimpleDay = function toSimpleDay(wikidataTime) {
  // Also accept claim datavalue.value objects, and actually prefer those,
  // as we can check the precision
  if ((typeof wikidataTime === 'undefined' ? 'undefined' : _typeof(wikidataTime)) === 'object') {
    var _wikidataTime = wikidataTime,
        time = _wikidataTime.time,
        precision = _wikidataTime.precision;
    // Year precision

    if (precision === 9) wikidataTime = time.replace('-01-01T', '-00-00T');
    // Month precision
    else if (precision === 10) wikidataTime = time.replace('-01T', '-00T');else wikidataTime = time;
  }

  return wikidataTime.split('T')[0]
  // Remove positive years sign
  .replace(/^\+/, '')
  // Remove years padding zeros
  .replace(/^(-?)0+/, '$1')
  // Remove days if not included in the Wikidata date precision
  .replace(/-00$/, '')
  // Remove months if not included in the Wikidata date precision
  .replace(/-00$/, '');
};

helpers.wikidataTimeToEpochTime = bestEffort(toEpochTime);
helpers.wikidataTimeToISOString = bestEffort(toISOString);
helpers.wikidataTimeToSimpleDay = bestEffort(toSimpleDay);

helpers.getImageUrl = function (filename, width) {
  var url = 'https://commons.wikimedia.org/wiki/Special:FilePath/' + filename;
  if (typeof width === 'number') url += '?width=' + width;
  return url;
};

module.exports = helpers;

},{"./wikidata_time_to_date_object":11}],2:[function(require,module,exports){
'use strict';

var _require = require('./helpers'),
    wikidataTimeToISOString = _require.wikidataTimeToISOString,
    wikidataTimeToEpochTime = _require.wikidataTimeToEpochTime,
    wikidataTimeToSimpleDay = _require.wikidataTimeToSimpleDay;

var simple = function simple(datavalue) {
  return datavalue.value;
};

var monolingualtext = function monolingualtext(datavalue, options) {
  return options.keepRichValues ? datavalue.value : datavalue.value.text;
};

var entity = function entity(datavalue, options) {
  return prefixedId(datavalue, options.entityPrefix);
};

var entityLetter = {
  item: 'Q',
  lexeme: 'L',
  property: 'P'
};

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
  return getTimeConverter(options.timeConverter)(datavalue.value);
};

var getTimeConverter = function getTimeConverter() {
  var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'iso';
  return timeConverters[key];
};

// Each time converter should be able to accept 2 keys of arguments:
// - either datavalue.value objects (prefered as it gives access to the precision)
// - or the time string (datavalue.value.time)
var timeConverters = {
  iso: wikidataTimeToISOString,
  epoch: wikidataTimeToEpochTime,
  'simple-day': wikidataTimeToSimpleDay,
  none: function none(wikidataTime) {
    return wikidataTime.time || wikidataTime;
  }
};

var parsers = {
  string: simple,
  commonsMedia: simple,
  url: simple,
  'external-id': simple,
  math: simple,
  monolingualtext: monolingualtext,
  'wikibase-item': entity,
  'wikibase-lexeme': entity,
  'wikibase-property': entity,
  time: time,
  quantity: quantity,
  'globe-coordinate': coordinate,
  'geo-shape': simple,
  'tabular-data': simple
};

module.exports = {
  parsers: parsers,
  parse: function parse(datatype, datavalue, options, claimId) {
    if (!datatype) {
      // Ex: https://www.wikidata.org/w/index.php?title=Q2105758&oldid=630350590
      console.error('invalid claim', claimId);
      return null;
    }

    try {
      return parsers[datatype](datavalue, options);
    } catch (err) {
      if (err.message === 'parsers[datatype] is not a function') {
        err.message = datatype + ' claim parser isn\'t implemented\n        Claim id: ' + claimId + '\n        Please report to https://github.com/maxlath/wikidata-sdk/issues';
      }
      throw err;
    }
  }
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

var _require = require('./parse_claim'),
    parseClaim = _require.parse;

var _require2 = require('../utils/utils'),
    uniq = _require2.uniq;

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

  // Avoid to throw on empty inputs to allow to simplify claims array
  // without having to know if the entity as claims for this property
  // Ex: simplifyPropertyClaims(entity.claims.P124211616)
  if (propClaims == null || propClaims.length === 0) return [];

  var _parseOptions2 = parseOptions(options),
      keepNonTruthy = _parseOptions2.keepNonTruthy,
      areSubSnaks = _parseOptions2.areSubSnaks;

  if (!(keepNonTruthy || areSubSnaks)) {
    propClaims = truthyPropertyClaims(propClaims);
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

var truthyPropertyClaims = function truthyPropertyClaims(propClaims) {
  var aggregate = propClaims.reduce(aggregatePerRank, {});
  // on truthyness: https://www.mediawiki.org/wiki/Wikibase/Indexing/RDF_Dump_Format#Truthy_statements
  return aggregate.preferred || aggregate.normal || [];
};

var truthyClaims = function truthyClaims(claims) {
  var truthClaimsOnly = {};
  Object.keys(claims).forEach(function (property) {
    truthClaimsOnly[property] = truthyPropertyClaims(claims[property]);
  });
  return truthClaimsOnly;
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
      keepHashes = _options.keepHashes,
      keepTypes = _options.keepTypes;
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

  var value = parseClaim(datatype, datavalue, options, claim.id);

  // Qualifiers should not attempt to keep sub-qualifiers or references
  if (isQualifierSnak) {
    if (!(keepHashes || keepTypes)) return value;

    var _richValue = { value: value };

    if (keepHashes) _richValue.hash = claim.hash;
    if (keepTypes) _richValue.type = datatype;

    return _richValue;
  }

  if (isReferenceSnak) {
    if (!keepTypes) return value;

    return { type: datatype, value: value };
  }

  // No need to test keepHashes as it has no effect if neither
  // keepQualifiers or keepReferences is true
  if (!(keepQualifiers || keepReferences || keepIds || keepTypes)) return value;

  // When keeping qualifiers or references, the value becomes an object
  // instead of a direct value
  var richValue = { value: value };

  if (keepTypes) {
    richValue.type = datatype;
  }

  var subSnaksOptions = getSubSnakOptions(options);
  subSnaksOptions.keepHashes = keepHashes;

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

var simplifyQualifiers = function simplifyQualifiers(claims, options) {
  return simplifyClaims(claims, getSubSnakOptions(options));
};

var simplifyPropertyQualifiers = function simplifyPropertyQualifiers(propClaims, options) {
  return simplifyPropertyClaims(propClaims, getSubSnakOptions(options));
};

// Using a new object so that the original options object isn't modified
var getSubSnakOptions = function getSubSnakOptions(options) {
  return Object.assign({}, options, { areSubSnaks: true });
};

module.exports = {
  simplifyClaims: simplifyClaims,
  simplifyPropertyClaims: simplifyPropertyClaims,
  simplifyClaim: simplifyClaim,
  truthyClaims: truthyClaims,
  truthyPropertyClaims: truthyPropertyClaims,
  simplifyQualifiers: simplifyQualifiers,
  simplifyPropertyQualifiers: simplifyPropertyQualifiers,
  simplifyQualifier: simplifyClaim
};

},{"../utils/utils":22,"./parse_claim":2}],5:[function(require,module,exports){
'use strict';

var _require = require('./simplify_claims'),
    simplifyClaims = _require.simplifyClaims;

var simplify = require('./simplify_text_attributes');
var simplifySitelinks = require('./simplify_sitelinks');

var simplifyEntity = function simplifyEntity(entity, options) {
  var simplified = {
    id: entity.id,
    type: entity.type,
    modified: entity.modified
  };

  simplifyIfDefined(entity, simplified, 'labels');
  simplifyIfDefined(entity, simplified, 'descriptions');
  simplifyIfDefined(entity, simplified, 'aliases');

  if (entity.claims != null) {
    simplified.claims = simplifyClaims(entity.claims, options);
  }

  if (entity.sitelinks != null) {
    simplified.sitelinks = simplifySitelinks(entity.sitelinks, options);
  }

  return simplified;
};

var simplifyIfDefined = function simplifyIfDefined(entity, simplified, attribute) {
  if (entity[attribute] != null) {
    simplified[attribute] = simplify[attribute](entity[attribute]);
  }
};

var simplifyEntities = function simplifyEntities(entities) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var entityPrefix = options.entityPrefix;

  return Object.keys(entities).reduce(function (obj, key) {
    var entity = entities[key];
    if (entityPrefix) key = entityPrefix + ':' + key;
    obj[key] = simplifyEntity(entity, options);
    return obj;
  }, {});
};

module.exports = { simplifyEntity: simplifyEntity, simplifyEntities: simplifyEntities };

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
  }

  var _identifyVars = identifyVars(vars),
      richVars = _identifyVars.richVars,
      standaloneVars = _identifyVars.standaloneVars;

  return results.map(getSimplifiedResult(richVars, standaloneVars));
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

  // return the raw value if the datatype is missing
};var passValue = function passValue(valueObj) {
  return valueObj.value;
};

var parseUri = function parseUri(uri) {
  if (uri.startsWith('http://www.wikidata.org/entity/statement/')) {
    return convertStatementUriToGuid(uri);
  }

  return uri.replace('http://www.wikidata.org/entity/', '').replace('http://www.wikidata.org/prop/direct/', '');
};

var convertStatementUriToGuid = function convertStatementUriToGuid(uri) {
  uri = uri.replace('http://www.wikidata.org/entity/statement/', '');
  var parts = uri.split('-');
  return parts[0] + '$' + parts.slice(1).join('-');
};

var identifyVars = function identifyVars(vars) {
  var data = { richVars: [], standaloneVars: [] };
  return vars.reduce(spreadVars(vars), data);
};

var spreadVars = function spreadVars(vars) {
  return function (data, varName) {
    if (vars.some(isAssociatedVar(varName))) {
      data.richVars.push(varName);
      return data;
    }

    if (!associatedVarPattern.test(varName)) {
      data.standaloneVars.push(varName);
      return data;
    }

    var associatedVar = varName.replace(associatedVarPattern, '$1')
    // The pattern regex fails to capture AltLabel prefixes alone,
    // due to the comflict with Label
    .replace(/Alt$/, '');

    if (!vars.includes(associatedVar)) {
      data.standaloneVars.push(varName);
    }

    return data;
  };
};

var associatedVarPattern = /^(\w+)(Label|Description|AltLabel)$/;

var isAssociatedVar = function isAssociatedVar(varNameA) {
  return function (varNameB) {
    if (varNameA + 'Label' === varNameB) return true;
    if (varNameA + 'Description' === varNameB) return true;
    if (varNameA + 'AltLabel' === varNameB) return true;
    return false;
  };
};

var getSimplifiedResult = function getSimplifiedResult(richVars, standaloneVars) {
  return function (result) {
    var simplifiedResult = {};
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = richVars[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var varName = _step.value;

        var value = parseValue(result[varName]);
        if (value != null) {
          simplifiedResult[varName] = { value: value };
          addAssociatedValue(result, varName, 'label', simplifiedResult[varName]);
          addAssociatedValue(result, varName, 'description', simplifiedResult[varName]);
          addAssociatedValue(result, varName, 'aliases', simplifiedResult[varName]);
        }
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

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = standaloneVars[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var _varName = _step2.value;

        simplifiedResult[_varName] = parseValue(result[_varName]);
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

    return simplifiedResult;
  };
};

var addAssociatedValue = function addAssociatedValue(result, varName, associatedVarName, varData) {
  var fullAssociatedVarName = varName + varNameSuffixMap[associatedVarName];
  var fullAssociatedVarData = result[fullAssociatedVarName];
  if (fullAssociatedVarData != null) {
    varData[associatedVarName] = fullAssociatedVarData.value;
  }
};

var varNameSuffixMap = {
  label: 'Label',
  description: 'Description',
  aliases: 'AltLabel'
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

var _require2 = require('./helpers'),
    isPropertyId = _require2.isPropertyId;

var wikidataBase = 'https://www.wikidata.org/wiki/';
var languages = require('./sitelinks_languages');

var getSitelinkUrl = function getSitelinkUrl(site, title) {
  if (isPlainObject(site)) {
    title = site.title;
    site = site.site;
  }

  if (!site) throw new Error('missing a site');
  if (!title) throw new Error('missing a title');

  var shortSiteKey = site.replace(/wiki$/, '');
  var specialUrlBuilder = siteUrlBuilders[shortSiteKey] || siteUrlBuilders[site];
  if (specialUrlBuilder) return specialUrlBuilder(title);

  var _getSitelinkData = getSitelinkData(site),
      lang = _getSitelinkData.lang,
      project = _getSitelinkData.project;

  title = fixedEncodeURIComponent(replaceSpaceByUnderscores(title));
  return 'https://' + lang + '.' + project + '.org/wiki/' + title;
};

var wikimediaSite = function wikimediaSite(subdomain) {
  return function (title) {
    return 'https://' + subdomain + '.wikimedia.org/wiki/' + title;
  };
};

var siteUrlBuilders = {
  commons: wikimediaSite('commons'),
  mediawiki: function mediawiki(title) {
    return 'https://www.mediawiki.org/wiki/' + title;
  },
  meta: wikimediaSite('meta'),
  species: wikimediaSite('species'),
  wikidata: function wikidata(title) {
    if (isPropertyId(title)) return wikidataBase + 'Property:' + title;
    return '' + wikidataBase + title;
  }
};

var getSitelinkData = function getSitelinkData(site) {
  var specialProjectName = specialSites[site];
  if (specialProjectName) return { lang: 'en', project: specialProjectName };

  var _site$split = site.split('wik'),
      _site$split2 = _slicedToArray(_site$split, 3),
      lang = _site$split2[0],
      projectSuffix = _site$split2[1],
      rest = _site$split2[2];

  // Detecting cases like 'frwikiwiki' that would return [ 'fr', 'i', 'i' ]


  if (rest != null) throw new Error('invalid sitelink: ' + site);

  if (languages.indexOf(lang) === -1) {
    throw new Error('sitelink lang not found: ' + lang);
  }

  var project = projectsBySuffix[projectSuffix];
  if (!project) throw new Error('sitelink project not found: ' + project);

  return { lang: lang, project: project };
};

var specialSites = {
  commonswiki: 'commons',
  mediawikiwiki: 'mediawiki',
  metawiki: 'meta',
  specieswiki: 'specieswiki',
  wikidatawiki: 'wikidata'
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

},{"../utils/utils":22,"./helpers":1,"./sitelinks_languages":10}],10:[function(require,module,exports){
'use strict';

// Taken from https://www.wikidata.org/w/api.php?action=help&modules=wbgetentities
// sites list, once removed their project suffix and deduplicated
module.exports = ['aa', 'ab', 'af', 'ak', 'als', 'am', 'ang', 'an', 'ar', 'ast', 'as', 'av', 'ay', 'az', 'ba', 'be', 'bg', 'bh', 'bi', 'bm', 'bn', 'bo', 'br', 'bs', 'ca', 'chr', 'ch', 'co', 'cr', 'csb', 'cs', 'cv', 'cy', 'da', 'de', 'dv', 'dz', 'el', 'en', 'eo', 'es', 'et', 'eu', 'fa', 'fi', 'fj', 'fo', 'fr', 'fy', 'ga', 'gd', 'gl', 'gn', 'got', 'gu', 'gv', 'ha', 'he', 'hif', 'hi', 'hr', 'hsb', 'ht', 'hu', 'hy', 'ia', 'id', 'ie', 'ik', 'io', 'is', 'it', 'iu', 'ja', 'jbo', 'jv', 'ka', 'kk', 'kl', 'km', 'kn', 'ko', 'kr', 'ks', 'ku', 'kw', 'ky', 'la', 'lb', 'li', 'ln', 'lo', 'lt', 'lv', 'mg', 'mh', 'mi', 'mk', 'ml', 'mn', 'mo', 'mr', 'ms', 'mt', 'my', 'nah', 'na', 'nds', 'ne', 'nl', 'nn', 'no', 'oc', 'om', 'or', 'pa', 'pi', 'pl', 'pms', 'pnb', 'ps', 'pt', 'qu', 'rm', 'rn', 'roa_rup', 'ro', 'ru', 'rw', 'sah', 'sa', 'scn', 'sc', 'sd', 'se', 'sg', 'sh', 'simple', 'si', 'sk', 'sl', 'sm', 'sn', 'so', 'sq', 'sr', 'ss', 'st', 'su', 'sv', 'sw', 'ta', 'te', 'tg', 'th', 'ti', 'tk', 'tl', 'tn', 'to', 'tpi', 'tr', 'ts', 'tt', 'tw', 'ug', 'uk', 'ur', 'uz', 'vec', 'vi', 'vo', 'wa', 'wo', 'xh', 'yi', 'yo', 'za', 'zh_min_nan', 'zh', 'zu', 'aa', 'ab', 'ace', 'af', 'ak', 'als', 'am', 'an', 'ang', 'ar', 'arc', 'arz', 'as', 'ast', 'av', 'ay', 'az', 'ba', 'bar', 'bat_smg', 'bcl', 'be', 'be_x_old', 'bg', 'bh', 'bi', 'bjn', 'bm', 'bn', 'bo', 'bpy', 'br', 'bs', 'bug', 'bxr', 'ca', 'cbk_zam', 'cdo', 'ce', 'ceb', 'ch', 'cho', 'chr', 'chy', 'ckb', 'co', 'cr', 'crh', 'cs', 'csb', 'cu', 'cv', 'cy', 'da', 'de', 'diq', 'dsb', 'dv', 'dz', 'ee', 'el', 'eml', 'en', 'eo', 'es', 'et', 'eu', 'ext', 'fa', 'ff', 'fi', 'fiu_vro', 'fj', 'fo', 'fr', 'frp', 'frr', 'fur', 'fy', 'ga', 'gag', 'gan', 'gd', 'gl', 'glk', 'gn', 'got', 'gu', 'gv', 'ha', 'hak', 'haw', 'he', 'hi', 'hif', 'ho', 'hr', 'hsb', 'ht', 'hu', 'hy', 'hz', 'ia', 'id', 'ie', 'ig', 'ii', 'ik', 'ilo', 'io', 'is', 'it', 'iu', 'ja', 'jbo', 'jv', 'ka', 'kaa', 'kab', 'kbd', 'kg', 'ki', 'kj', 'kk', 'kl', 'km', 'kn', 'ko', 'koi', 'kr', 'krc', 'ks', 'ksh', 'ku', 'kv', 'kw', 'ky', 'la', 'lad', 'lb', 'lbe', 'lez', 'lg', 'li', 'lij', 'lmo', 'ln', 'lo', 'lt', 'ltg', 'lv', 'mai', 'map_bms', 'mdf', 'mg', 'mh', 'mhr', 'mi', 'min', 'mk', 'ml', 'mn', 'mo', 'mr', 'mrj', 'ms', 'mt', 'mus', 'mwl', 'my', 'myv', 'mzn', 'na', 'nah', 'nap', 'nds', 'nds_nl', 'ne', 'new', 'ng', 'nl', 'nn', 'no', 'nov', 'nrm', 'nso', 'nv', 'ny', 'oc', 'om', 'or', 'os', 'pa', 'pag', 'pam', 'pap', 'pcd', 'pdc', 'pfl', 'pi', 'pih', 'pl', 'pms', 'pnb', 'pnt', 'ps', 'pt', 'qu', 'rm', 'rmy', 'rn', 'ro', 'roa_rup', 'roa_tara', 'ru', 'rue', 'rw', 'sa', 'sah', 'sc', 'scn', 'sco', 'sd', 'se', 'sg', 'sh', 'si', 'simple', 'sk', 'sl', 'sm', 'sn', 'so', 'sq', 'sr', 'srn', 'ss', 'st', 'stq', 'su', 'sv', 'sw', 'szl', 'ta', 'te', 'tet', 'tg', 'th', 'ti', 'tk', 'tl', 'tn', 'to', 'tpi', 'tr', 'ts', 'tt', 'tum', 'tw', 'ty', 'tyv', 'udm', 'ug', 'uk', 'ur', 'uz', 've', 'vec', 'vep', 'vi', 'vls', 'vo', 'wa', 'war', 'wo', 'wuu', 'xal', 'xh', 'xmf', 'yi', 'yo', 'za', 'zea', 'zh', 'zh_classical', 'zh_min_nan', 'zh_yue', 'zu', 'lrc', 'gom', 'azb', 'ady', 'jam', 'tcy', 'olo', 'dty', 'atj', 'kbp', 'din', 'gor', 'inh', 'lfn', 'sat'];

},{}],11:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function (wikidataTime) {
  // Also accept claim datavalue.value objects
  if ((typeof wikidataTime === 'undefined' ? 'undefined' : _typeof(wikidataTime)) === 'object') {
    wikidataTime = wikidataTime.time;
  }

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
  var year = rest.split('-')[0];
  var date;
  // Using ISO8601 expanded notation for negative years: adding 2 leading zeros
  // when needed. Can't find the documentation again, but testing
  // with `new Date(date)` gives a good clue of the implementation
  if (year.length === 4) {
    date = '-00' + rest;
  } else if (year.length === 5) {
    date = '-0' + rest;
  } else {
    date = '-' + rest;
  }
  return new Date(date);
};

var parseInvalideDate = function parseInvalideDate(sign, rest) {
  // This is probably a date of unsuffisient precision
  // such as 1953-00-00T00:00:00Z, thus invalid
  // It should at least have a year, so let's fallback to ${year}-01-01
  var year = rest.split('T')[0].split('-')[0];
  return fullDateData(sign, year);
};

},{}],12:[function(require,module,exports){
'use strict';

var wdk = module.exports = {};

wdk.searchEntities = require('./queries/search_entities');
wdk.getEntities = require('./queries/get_entities');
wdk.getManyEntities = require('./queries/get_many_entities');
wdk.sparqlQuery = require('./queries/sparql_query');
wdk.getReverseClaims = require('./queries/get_reverse_claims');
wdk.getRevisions = require('./queries/get_revisions');
wdk.getEntitiesFromSitelinks = require('./queries/get_entities_from_sitelinks');
// Legacy
wdk.getWikidataIdsFromSitelinks = wdk.getEntitiesFromSitelinks;

wdk.parse = require('./helpers/parse_responses');

var claimsSimplifiers = require('./helpers/simplify_claims');
var simplifySparqlResults = require('./helpers/simplify_sparql_results');

wdk.simplify = require('../lib/helpers/simplify_text_attributes');

var _require = require('../lib/helpers/simplify_entity'),
    simplifyEntity = _require.simplifyEntity,
    simplifyEntities = _require.simplifyEntities;

wdk.simplify.entity = simplifyEntity;
wdk.simplify.entities = simplifyEntities;

wdk.simplify.claim = claimsSimplifiers.simplifyClaim;
wdk.simplify.propertyClaims = claimsSimplifiers.simplifyPropertyClaims;
wdk.simplify.claims = claimsSimplifiers.simplifyClaims;
wdk.simplify.qualifier = claimsSimplifiers.simplifyQualifiers;
wdk.simplify.propertyQualifiers = claimsSimplifiers.simplifyPropertyQualifiers;
wdk.simplify.qualifiers = claimsSimplifiers.simplifyQualifier;

wdk.simplify.sitelinks = require('../lib/helpers/simplify_sitelinks');
wdk.simplify.sparqlResults = simplifySparqlResults;

// Legacy
wdk.simplifySparqlResults = require('./helpers/simplify_sparql_results');
// Legacy + truthyClaims + truthyPropertyClaims
Object.assign(wdk, claimsSimplifiers);

// Aliases
wdk.getWikidataIdsFromWikipediaTitles = wdk.getWikidataIdsFromSitelinks;

var helpers = require('../lib/helpers/helpers');
var sitelinksHelpers = require('../lib/helpers/sitelinks_helpers');
Object.assign(wdk, helpers, sitelinksHelpers);

},{"../lib/helpers/helpers":1,"../lib/helpers/simplify_entity":5,"../lib/helpers/simplify_sitelinks":6,"../lib/helpers/simplify_text_attributes":8,"../lib/helpers/sitelinks_helpers":9,"./helpers/parse_responses":3,"./helpers/simplify_claims":4,"./helpers/simplify_sparql_results":7,"./queries/get_entities":13,"./queries/get_entities_from_sitelinks":14,"./queries/get_many_entities":15,"./queries/get_reverse_claims":16,"./queries/get_revisions":17,"./queries/search_entities":18,"./queries/sparql_query":19}],13:[function(require,module,exports){
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

},{"../utils/build_url":20,"../utils/utils":22}],14:[function(require,module,exports){
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

    // Normalizing only works if there is only one site and title
  };if (sites.length === 1 && titles.length === 1) {
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

},{"../utils/build_url":20,"../utils/utils":22}],15:[function(require,module,exports){
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

},{"../utils/utils":22,"./get_entities":13}],16:[function(require,module,exports){
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

  var valueFn = caseInsensitive ? caseInsensitiveValueQuery : directValueQuery;
  var filter = keepProperties ? '' : itemsOnly;

  // Allow to request values for several properties at once
  if (property instanceof Array) {
    property = property.map(prefixifyProperty).join('|');
  } else {
    property = prefixifyProperty(property);
  }

  var valueBlock = getValueBlock(value, valueFn, property, filter);
  var sparql = 'SELECT DISTINCT ?subject WHERE { ' + valueBlock + ' }';
  if (limit) sparql += ' LIMIT ' + limit;
  return sparqlQuery(sparql);
};

function getValueBlock(value, valueFn, property, filter) {
  if (!(value instanceof Array)) {
    return valueFn(property, getValueString(value), filter);
  }

  var valuesBlocks = value.map(getValueString).map(function (valStr) {
    return valueFn(property, valStr, filter);
  });

  return '{ ' + valuesBlocks.join('} UNION {') + ' }';
}

function getValueString(value) {
  if (helpers.isItemId(value)) {
    value = 'wd:' + value;
  } else if (typeof value === 'string') {
    value = '\'' + value + '\'';
  }
  return value;
}

function directValueQuery(property, value, filter, limit) {
  return '?subject ' + property + ' ' + value + ' .\n    ' + filter;
}

// Discussion on how to make this query optimal:
// http://stackoverflow.com/q/43073266/3324977
function caseInsensitiveValueQuery(property, value, filter, limit) {
  return '?subject ' + property + ' ?value .\n    FILTER (lcase(?value) = ' + value.toLowerCase() + ')\n    ' + filter;
}

var prefixifyProperty = function prefixifyProperty(property) {
  return 'wdt:' + property;
};

},{"../helpers/helpers":1,"./sparql_query":19}],17:[function(require,module,exports){
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

},{"../utils/build_url":20,"../utils/utils":22}],18:[function(require,module,exports){
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

},{"../utils/build_url":20,"../utils/utils":22}],19:[function(require,module,exports){
'use strict';

var _require = require('../utils/utils'),
    fixedEncodeURIComponent = _require.fixedEncodeURIComponent;

module.exports = function (sparql) {
  var query = fixedEncodeURIComponent(sparql);
  return 'https://query.wikidata.org/sparql?format=json&query=' + query;
};

},{"../utils/utils":22}],20:[function(require,module,exports){
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

},{"./querystring_lite":21,"querystring":25}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
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

},{}],25:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":23,"./encode":24}]},{},[12])(12)
});
