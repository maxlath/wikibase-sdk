const simplifyTextAttributes = multivalue => data => {
    const simplified = {};
    Object.keys(data).forEach(lang => {
        const obj = data[lang];
        if (obj != null) {
            simplified[lang] = multivalue ? obj.map(getValue) : obj.value;
        }
        else {
            simplified[lang] = multivalue ? [] : null;
        }
    });
    return simplified;
};
const getValue = obj => obj.value;
const singleValue = simplifyTextAttributes(false);
const multiValue = simplifyTextAttributes(true);
export function simplifyLabels(labels) {
    return singleValue(labels);
}
export function simplifyDescriptions(descriptions) {
    return singleValue(descriptions);
}
export function simplifyAliases(aliases) {
    return multiValue(aliases);
}
export function simplifyLemmas(lemmas) {
    return singleValue(lemmas);
}
export function simplifyRepresentations(representations) {
    return singleValue(representations);
}
export function simplifyGlosses(glosses) {
    return singleValue(glosses);
}
