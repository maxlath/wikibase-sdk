import { wikibaseTimeToEpochTime, wikibaseTimeToISOString, wikibaseTimeToSimpleDay } from './time.js';
function stringValue(datavalue) {
    return datavalue.value;
}
function monolingualtext(datavalue, options) {
    return options.keepRichValues ? datavalue.value : datavalue.value.text;
}
function entity(datavalue, options) {
    const { entityPrefix: prefix } = options;
    const { value } = datavalue;
    let id;
    if (value.id) {
        id = value.id;
    }
    else {
        // Legacy
        const letter = entityLetter[value['entity-type']];
        id = `${letter}${value['numeric-id']}`;
    }
    return typeof prefix === 'string' ? `${prefix}:${id}` : id;
}
const entityLetter = {
    item: 'Q',
    'entity-schema': 'E',
    lexeme: 'L',
    property: 'P',
    form: 'F',
    sense: 'S',
};
function quantity(datavalue, options) {
    const { value } = datavalue;
    const amount = parseFloat(value.amount);
    if (options.keepRichValues) {
        const richValue = {
            amount: parseFloat(value.amount),
            // ex: http://www.wikidata.org/entity/
            unit: value.unit.replace(/^https?:\/\/.*\/entity\//, ''),
        };
        if (value.upperBound != null)
            richValue.upperBound = parseFloat(value.upperBound);
        if (value.lowerBound != null)
            richValue.lowerBound = parseFloat(value.lowerBound);
        return richValue;
    }
    else {
        return amount;
    }
}
function coordinate(datavalue, options) {
    if (options.keepRichValues) {
        return datavalue.value;
    }
    else {
        return [datavalue.value.latitude, datavalue.value.longitude];
    }
}
function time(datavalue, options) {
    let timeValue;
    if (typeof options.timeConverter === 'function') {
        timeValue = options.timeConverter(datavalue.value);
    }
    else {
        timeValue = getTimeConverter(options.timeConverter)(datavalue.value);
    }
    if (options.keepRichValues) {
        const { timezone, before, after, precision, calendarmodel } = datavalue.value;
        return { time: timeValue, timezone, before, after, precision, calendarmodel };
    }
    else {
        return timeValue;
    }
}
// Each time converter should be able to accept 2 keys of arguments:
// - either datavalue.value objects (prefered as it gives access to the precision)
// - or the time string (datavalue.value.time)
export const timeConverters = {
    iso: wikibaseTimeToISOString,
    epoch: wikibaseTimeToEpochTime,
    'simple-day': wikibaseTimeToSimpleDay,
    none: (wikibaseTime) => typeof wikibaseTime === 'string' ? wikibaseTime : wikibaseTime.time,
};
function getTimeConverter(key = 'iso') {
    const converter = timeConverters[key];
    if (!converter)
        throw new Error(`invalid converter key: ${JSON.stringify(key).substring(0, 100)}`);
    return converter;
}
export const parsers = {
    commonsMedia: stringValue,
    'external-id': stringValue,
    'entity-schema': entity,
    'geo-shape': stringValue,
    'globe-coordinate': coordinate,
    math: stringValue,
    monolingualtext,
    'musical-notation': stringValue,
    quantity,
    string: stringValue,
    'tabular-data': stringValue,
    time,
    url: stringValue,
    'wikibase-form': entity,
    'wikibase-item': entity,
    'wikibase-lexeme': entity,
    'wikibase-property': entity,
    'wikibase-sense': entity,
};
const legacyParsers = {
    'musical notation': parsers['musical-notation'],
    // Known case: mediainfo won't have datatype="globe-coordinate", but datavalue.type="globecoordinate"
    globecoordinate: parsers['globe-coordinate'],
};
export function parseSnak(datatype, datavalue, options) {
    let parser;
    if (datatype) {
        // @ts-expect-error legacyParsers datatypes aren't in DataValueByDataType
        parser = parsers[datatype] || legacyParsers[datatype];
    }
    else {
        parser = parsers[datavalue.type];
    }
    if (!parser) {
        throw new Error(`${datatype} claim parser isn't implemented. Please report to https://github.com/maxlath/wikibase-sdk/issues`);
    }
    return parser(datavalue, options);
}
//# sourceMappingURL=parse_snak.js.map