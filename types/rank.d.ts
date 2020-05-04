import {Claim} from './claim.d'

export function truthyClaims(claims: Record<string, Claim[]>): Record<string, Claim[]>;
export function truthyPropertyClaims(claims: Claim[]): Claim[];
