import { typedEntries } from '../utils/utils.js';
function singleValue(data) {
    const simplified = {};
    for (const [lang, obj] of typedEntries(data)) {
        simplified[lang] = obj != null ? obj.value : null;
    }
    return simplified;
}
function multiValue(data) {
    const simplified = {};
    for (const [lang, obj] of typedEntries(data)) {
        simplified[lang] = obj != null ? obj.map(o => o.value) : [];
    }
    return simplified;
}
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
//# sourceMappingURL=simplify_text_attributes.js.map