import type { Entities, Item, Lexeme, MediaInfo, Property, SimplifiedEntity, SimplifiedItem, SimplifiedLexeme, SimplifiedMediaInfo, SimplifiedProperty } from '../types/entity.js';
import type { Form, Sense, SimplifiedForm, SimplifiedSense } from '../types/lexeme.js';
import type { SimplifyEntityOptions } from '../types/options.js';
export declare function simplifyEntity(entity: Item, options?: SimplifyEntityOptions): SimplifiedItem;
export declare function simplifyEntity(entity: Property, options?: SimplifyEntityOptions): SimplifiedProperty;
export declare function simplifyEntity(entity: Lexeme, options?: SimplifyEntityOptions): SimplifiedLexeme;
export declare function simplifyEntity(entity: Form, options?: SimplifyEntityOptions): SimplifiedForm;
export declare function simplifyEntity(entity: Sense, options?: SimplifyEntityOptions): SimplifiedSense;
export declare function simplifyEntity(entity: MediaInfo, options?: SimplifyEntityOptions): SimplifiedMediaInfo;
export declare function simplifyEntities(entities: Entities, options?: SimplifyEntityOptions): Record<string, SimplifiedEntity>;
//# sourceMappingURL=simplify_entity.d.ts.map