import type { Claim, Statement } from '../types/claim.js';
import type { PropertyId } from '../types/entity.js';
export declare const ranks: readonly ["normal", "preferred", "deprecated"];
export declare function truthyPropertyClaims<T extends (Claim | Statement)>(propertyClaims: T[]): T[];
export declare function nonDeprecatedPropertyClaims<T extends (Claim | Statement)>(propertyClaims: T[]): T[];
export declare function truthyClaims<T extends (Claim | Statement)>(claims: Record<PropertyId, T[]>): Record<PropertyId, T[]>;
//# sourceMappingURL=rank.d.ts.map