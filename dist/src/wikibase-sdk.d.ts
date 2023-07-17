import * as helpers from './helpers/helpers.js';
import * as parse from './helpers/parse_responses.js';
import * as rankHelpers from './helpers/rank.js';
import * as simplify from './helpers/simplify.js';
import * as sitelinksHelpers from './helpers/sitelinks.js';
import * as timeHelpers from './helpers/time.js';
import { cirrusSearchPagesFactory } from './queries/cirrus_search.js';
import { getEntitiesFactory } from './queries/get_entities.js';
import { getEntitiesFromSitelinksFactory } from './queries/get_entities_from_sitelinks.js';
import { getEntityRevisionFactory } from './queries/get_entity_revision.js';
import { getManyEntitiesFactory } from './queries/get_many_entities.js';
import { getReverseClaimsFactory } from './queries/get_reverse_claims.js';
import { getRevisionsFactory } from './queries/get_revisions.js';
import { searchEntitiesFactory } from './queries/search_entities.js';
import { sparqlQueryFactory } from './queries/sparql_query.js';
import type { InstanceConfig, Url } from './types/options.js';
declare const common: {
    readonly wikibaseTimeToDateObject: typeof timeHelpers.wikibaseTimeToDateObject;
    readonly wikibaseTimeToEpochTime: (value: timeHelpers.TimeInputValue) => string | number;
    readonly wikibaseTimeToISOString: (value: timeHelpers.TimeInputValue) => string;
    readonly wikibaseTimeToSimpleDay: (value: timeHelpers.TimeInputValue) => string;
    readonly truthyPropertyClaims: typeof rankHelpers.truthyPropertyClaims;
    readonly nonDeprecatedPropertyClaims: typeof rankHelpers.nonDeprecatedPropertyClaims;
    readonly truthyClaims: typeof rankHelpers.truthyClaims;
    readonly getSitelinkUrl: typeof sitelinksHelpers.getSitelinkUrl;
    readonly getSitelinkData: typeof sitelinksHelpers.getSitelinkData;
    readonly isSitelinkKey: (site: string) => boolean;
    readonly wikimediaLanguageCodes: readonly ["aa", "ab", "ace", "ady", "af", "ak", "als", "alt", "ami", "am", "ang", "anp", "an", "arc", "ar", "ary", "arz", "ast", "as", "atj", "avk", "av", "awa", "ay", "azb", "az", "ban", "bar", "bat_smg", "ba", "bcl", "be_x_old", "be", "bg", "bh", "bi", "bjn", "blk", "bm", "bn", "bo", "bpy", "br", "bs", "bug", "bxr", "ca", "cbk_zam", "cdo", "ceb", "ce", "cho", "chr", "ch", "chy", "ckb", "co", "crh", "cr", "csb", "cs", "cu", "cv", "cy", "dag", "da", "de", "din", "diq", "dsb", "dty", "dv", "dz", "ee", "el", "eml", "en", "eo", "es", "et", "eu", "ext", "fa", "ff", "fiu_vro", "fi", "fj", "fo", "frp", "frr", "fr", "fur", "fy", "gag", "gan", "ga", "gcr", "gd", "glk", "gl", "gn", "gom", "gor", "got", "guc", "gur", "gu", "guw", "gv", "hak", "ha", "haw", "he", "hif", "hi", "ho", "hr", "hsb", "ht", "hu", "hy", "hyw", "hz", "ia", "id", "ie", "ig", "ii", "ik", "ilo", "inh", "io", "is", "it", "iu", "jam", "ja", "jbo", "jv", "kaa", "kab", "ka", "kbd", "kbp", "kcg", "kg", "ki", "kj", "kk", "kl", "km", "kn", "koi", "ko", "krc", "kr", "ksh", "ks", "ku", "kv", "kw", "ky", "lad", "la", "lbe", "lb", "lez", "lfn", "lg", "lij", "li", "lld", "lmo", "ln", "lo", "lrc", "ltg", "lt", "lv", "mad", "mai", "map_bms", "mdf", "mg", "mhr", "mh", "min", "mi", "mk", "ml", "mni", "mn", "mnw", "mo", "mrj", "mr", "ms", "mt", "mus", "mwl", "myv", "my", "mzn", "nah", "nap", "na", "nds_nl", "nds", "ne", "new", "ng", "nia", "nl", "nn", "nov", "no", "nqo", "nrm", "nso", "nv", "ny", "oc", "olo", "om", "or", "os", "pag", "pam", "pap", "pa", "pcd", "pcm", "pdc", "pfl", "pih", "pi", "pl", "pms", "pnb", "pnt", "ps", "pt", "pwn", "qu", "rm", "rmy", "rn", "roa_rup", "roa_tara", "ro", "rue", "ru", "rw", "sah", "sat", "sa", "scn", "sco", "sc", "sd", "se", "sg", "shi", "shn", "sh", "shy", "simple", "si", "skr", "sk", "sl", "smn", "sm", "sn", "sources", "so", "sq", "srn", "sr", "ss", "stq", "st", "su", "sv", "sw", "szl", "szy", "ta", "tay", "tcy", "tet", "te", "tg", "th", "ti", "tk", "tl", "tn", "to", "tpi", "trv", "tr", "ts", "tt", "tum", "tw", "tyv", "ty", "udm", "ug", "uk", "ur", "uz", "vec", "vep", "ve", "vi", "vls", "vo", "war", "wa", "wo", "wuu", "xal", "xh", "xmf", "yi", "yo", "yue", "za", "zea", "zh_classical", "zh_min_nan", "zh_yue", "zh", "zu"];
    readonly isPropertyClaimsId: typeof helpers.isPropertyClaimsId;
    readonly isEntityPageTitle: typeof helpers.isEntityPageTitle;
    readonly getNumericId: typeof helpers.getNumericId;
    readonly getImageUrl: typeof helpers.getImageUrl;
    readonly getEntityIdFromGuid: typeof helpers.getEntityIdFromGuid;
    readonly isNumericId: (id: string) => id is `${number}`;
    readonly isEntityId: (id: string) => id is import("./index.js").EntityId;
    readonly isEntitySchemaId: (id: string) => id is `E${number}`;
    readonly isItemId: (id: string) => id is `Q${number}`;
    readonly isPropertyId: (id: string) => id is `P${number}`;
    readonly isLexemeId: (id: string) => id is `L${number}`;
    readonly isFormId: (id: string) => id is `L${number}-F${number}`;
    readonly isSenseId: (id: string) => id is `L${number}-S${number}`;
    readonly isMediaInfoId: (id: string) => id is `M${number}`;
    readonly isGuid: (id: string) => id is `Q${number}$${string}` | `P${number}$${string}` | `L${number}$${string}` | `M${number}$${string}` | `L${number}-F${number}$${string}` | `L${number}-S${number}$${string}` | `q${Lowercase<`${number}`>}$${string}` | `p${Lowercase<`${number}`>}$${string}` | `l${Lowercase<`${number}`>}$${string}` | `m${Lowercase<`${number}`>}$${string}` | `l${Lowercase<`${number}`>}-f${Lowercase<`${number}`>}$${string}` | `l${Lowercase<`${number}`>}-s${Lowercase<`${number}`>}$${string}`;
    readonly isHash: (id: string) => id is string;
    readonly isRevisionId: (id: string) => id is `${number}`;
    readonly isNonNestedEntityId: (id: string) => id is import("./index.js").NonNestedEntityId;
    readonly simplify: typeof simplify;
    readonly parse: typeof parse;
};
type ApiQueries = {
    readonly searchEntities: ReturnType<typeof searchEntitiesFactory>;
    readonly cirrusSearchPages: ReturnType<typeof cirrusSearchPagesFactory>;
    readonly getEntities: ReturnType<typeof getEntitiesFactory>;
    readonly getManyEntities: ReturnType<typeof getManyEntitiesFactory>;
    readonly getRevisions: ReturnType<typeof getRevisionsFactory>;
    readonly getEntityRevision: ReturnType<typeof getEntityRevisionFactory>;
    readonly getEntitiesFromSitelinks: ReturnType<typeof getEntitiesFromSitelinksFactory>;
};
type SparqlQueries = {
    readonly sparqlQuery: ReturnType<typeof sparqlQueryFactory>;
    readonly getReverseClaims: ReturnType<typeof getReverseClaimsFactory>;
};
type Instance = {
    readonly root: Url;
    readonly apiEndpoint: Url;
};
export type Wbk = {
    readonly instance: Instance;
} & ApiQueries & SparqlQueries & typeof common;
export declare function WBK(config: InstanceConfig): Wbk;
export {};
//# sourceMappingURL=wikibase-sdk.d.ts.map