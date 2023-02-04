/// <reference types="node" resolution-mode="require"/>
import type { EntityId, NamedspacedEntityId } from '../types/entity.js';
import type { BuildUrlFunction } from '../utils/build_url.js';
import type { URLFormatOptions } from 'url';
export interface GetRevisionsOptions {
    ids: EntityId | EntityId[] | NamedspacedEntityId | NamedspacedEntityId[];
    format?: URLFormatOptions;
    limit?: number;
    start?: Date | string | number;
    end?: Date | string | number;
    prop?: string | string[];
    user?: string;
    excludeuser?: string;
    tag?: string;
}
export declare function getRevisionsFactory(buildUrl: BuildUrlFunction): ({ ids, format, limit, start, end, prop, user, excludeuser, tag }: GetRevisionsOptions) => string;
