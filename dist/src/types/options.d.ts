import type { SimplifyClaimsOptions } from './simplify_claims.js';
export interface InstanceConfig {
    instance?: string;
    sparqlEndpoint?: string;
    wgScriptPath?: string;
}
export type Props = 'info' | 'sitelinks' | 'sitelinks/urls' | 'aliases' | 'labels' | 'descriptions' | 'claims' | 'datatype';
export type UrlResultFormat = 'xml' | 'json';
export type LanguageCode = string;
export interface SimplifyEntityOptions extends SimplifyClaimsOptions, SimplifySitelinkOptions {
}
export interface SimplifySitelinkOptions {
    addUrl?: boolean;
    keepBadges?: boolean;
    keepAll?: boolean;
}
/** @deprecated use LanguageCode or WikimediaLanguageCode */
export type WmLanguageCode = LanguageCode;
//# sourceMappingURL=options.d.ts.map