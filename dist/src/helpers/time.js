export function wikibaseTimeToDateObject(wikibaseTime) {
    // Also accept claim datavalue.value objects
    if (typeof wikibaseTime === 'object') {
        wikibaseTime = wikibaseTime.time;
    }
    const sign = wikibaseTime[0];
    let [yearMonthDay, withinDay] = wikibaseTime.slice(1).split('T');
    // Wikidata generates invalid ISO dates to indicate precision
    // ex: +1990-00-00T00:00:00Z to indicate 1990 with year precision
    yearMonthDay = yearMonthDay.replace(/-00/g, '-01');
    const rest = `${yearMonthDay}T${withinDay}`;
    return fullDateData(sign, rest);
}
const fullDateData = (sign, rest) => {
    const year = rest.split('-')[0];
    const needsExpandedYear = sign === '-' || year.length > 4;
    return needsExpandedYear ? expandedYearDate(sign, rest, year) : new Date(rest);
};
const expandedYearDate = (sign, rest, year) => {
    let date;
    // Using ISO8601 expanded notation for negative years or positive
    // years with more than 4 digits: adding up to 2 leading zeros
    // when needed. Can't find the documentation again, but testing
    // with `new Date(date)` gives a good clue of the implementation
    if (year.length === 4) {
        date = `${sign}00${rest}`;
    }
    else if (year.length === 5) {
        date = `${sign}0${rest}`;
    }
    else {
        date = sign + rest;
    }
    return new Date(date);
};
const toEpochTime = (wikibaseTime) => wikibaseTimeToDateObject(wikibaseTime).getTime();
const toISOString = (wikibaseTime) => wikibaseTimeToDateObject(wikibaseTime).toISOString();
// A date format that knows just three precisions:
// 'yyyy', 'yyyy-mm', and 'yyyy-mm-dd' (including negative and non-4 digit years)
// Should be able to handle the old and the new Wikidata time:
// - in the old one, units below the precision where set to 00
// - in the new one, those months and days are set to 01 in those cases,
//   so when we can access the full claim object, we check the precision
//   to recover the old format
const toSimpleDay = (wikibaseTime) => {
    // Also accept claim datavalue.value objects, and actually prefer those,
    // as we can check the precision
    if (typeof wikibaseTime === 'object') {
        const { time, precision } = wikibaseTime;
        // Year precision
        if (precision === 9)
            wikibaseTime = time.replace('-01-01T', '-00-00T');
        // Month precision
        else if (precision === 10)
            wikibaseTime = time.replace('-01T', '-00T');
        else
            wikibaseTime = time;
    }
    return wikibaseTime.split('T')[0]
        // Remove positive years sign
        .replace(/^\+/, '')
        // Remove years padding zeros
        .replace(/^(-?)0+/, '$1')
        // Remove days if not included in the Wikidata date precision
        .replace(/-00$/, '')
        // Remove months if not included in the Wikidata date precision
        .replace(/-00$/, '');
};
export const wikibaseTimeToEpochTime = toEpochTime;
export const wikibaseTimeToISOString = (value) => {
    try {
        return toISOString(value);
    }
    catch (_a) {
        const { sign, yearMonthDay, withinDay } = recoverDateAfterError(value);
        return `${sign}${yearMonthDay}T${withinDay}`;
    }
};
export const wikibaseTimeToSimpleDay = (value) => {
    try {
        return toSimpleDay(value);
    }
    catch (_a) {
        const { sign, yearMonthDay } = recoverDateAfterError(value);
        return `${sign}${yearMonthDay}`;
    }
};
function recoverDateAfterError(value) {
    value = typeof value === 'string' ? value : value.time;
    const sign = value[0];
    let [yearMonthDay, withinDay] = value.slice(1).split('T');
    if (!sign || !yearMonthDay || !withinDay) {
        throw new Error('TimeInput is invalid: ' + JSON.stringify(value));
    }
    yearMonthDay = yearMonthDay.replace(/-00/g, '-01');
    return { sign, yearMonthDay, withinDay };
}
//# sourceMappingURL=time.js.map