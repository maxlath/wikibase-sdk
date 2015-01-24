// Generated by CoffeeScript 1.8.0
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

  wd_.normalizeWikidataTime = function(wikidataTime) {
    var day, month, parts, rest, sign, year;
    parts = wikidataTime.split('-');
    switch (parts.length) {
      case 3:
        year = parts[0], month = parts[1], rest = parts[2];
        break;
      case 4:
        sign = parts[0], year = parts[1], month = parts[2], rest = parts[3];
        year = "-" + year;
        break;
      default:
        console.error("unknown wikidata time format");
    }
    day = rest.slice(0, 2);
    return new Date(year, month, day).getTime();
  };

  wd_.toPropertiesArray = function(obj) {
    if (typeof obj === 'string') {
      return obj = [obj];
    } else {
      return obj || [];
    }
  };

  module.exports = wd_;

}).call(this);
