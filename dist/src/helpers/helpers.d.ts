import type { EntityId, EntityPageTitle, Guid, GuidAltSyntax, NonNestedEntityId, NumericId, PropertyClaimsId } from '../types/entity.js';
import type { Url } from '../utils/build_url.js';
export declare const isNumericId: (id: string) => id is `${number}`;
export declare const isEntityId: (id: string) => id is EntityId;
export declare const isEntitySchemaId: (id: string) => id is `E${number}`;
export declare const isItemId: (id: string) => id is `Q${number}`;
export declare const isPropertyId: (id: string) => id is `P${number}`;
export declare const isLexemeId: (id: string) => id is `L${number}`;
export declare const isFormId: (id: string) => id is `L${number}-F${number}`;
export declare const isSenseId: (id: string) => id is `L${number}-S${number}`;
export declare const isMediaInfoId: (id: string) => id is `M${number}`;
export declare const isGuid: (id: string) => id is `L${number}-F${number}$${string}` | `L${number}-S${number}$${string}` | `Q${number}$${string}` | `L${number}$${string}` | `P${number}$${string}` | `E${number}$${string}` | `M${number}$${string}` | `l${Lowercase<`${number}`>}-f${Lowercase<`${number}`>}$${string}` | `l${Lowercase<`${number}`>}-s${Lowercase<`${number}`>}$${string}` | `q${Lowercase<`${number}`>}$${string}` | `l${Lowercase<`${number}`>}$${string}` | `p${Lowercase<`${number}`>}$${string}` | `e${Lowercase<`${number}`>}$${string}` | `m${Lowercase<`${number}`>}$${string}`;
export declare const isHash: (id: string) => id is string;
export declare const isRevisionId: (id: string) => id is `${number}`;
export declare const isNonNestedEntityId: (id: string) => id is NonNestedEntityId;
export declare function isPropertyClaimsId(id: string): id is PropertyClaimsId;
export declare function isEntityPageTitle(title: string): title is EntityPageTitle;
export declare function getNumericId(id: string): NumericId;
export declare function getImageUrl(filename: string, width?: number): Url;
export declare function getEntityIdFromGuid(guid: Guid | GuidAltSyntax): EntityId;
//# sourceMappingURL=helpers.d.ts.map