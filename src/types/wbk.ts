import type { Claim, Claims, PropertyClaims, PropertyQualifiers, PropertySnaks, Qualifier, Qualifiers, References, Snak, Snaks } from './claim.js'
import type { Entities, Entity, EntityId, Guid, SimplifiedEntities, SimplifiedEntity } from './entity.js'
import type { Form, Forms, Sense, Senses, SimplifiedForm, SimplifiedForms, SimplifiedSense, SimplifiedSenses } from './lexeme.js'
import type { Url } from './options.js'
import type { SimplifiedClaim, SimplifiedClaims, SimplifiedPropertyClaims, SimplifiedPropertyQualifiers, SimplifiedQualifier, SimplifiedQualifiers } from './simplify_claims.js'
import type { SimplifiedSitelinks, Site, Sitelinks } from './sitelinks.js'
import type { SimplifiedSparqlResults, SparqlResults } from './sparql.js'
import type { Aliases, Descriptions, Glosses, Labels, Lemmas, Representations, SimplifiedAliases, SimplifiedDescriptions, SimplifiedGlosses, SimplifiedLabels, SimplifiedLemmas, SimplifiedRepresentations } from './terms.js'
import type { CirrusSearchPagesResponse, Titles, WbGetEntitiesResponse } from '../helpers/parse_responses.js'
import type { GetSitelinkUrlOptions, SitelinkData } from '../helpers/sitelinks.js'
import type { TimeInputValue } from '../index.js'
import type { CirrusSearchPagesOptions } from '../queries/cirrus_search.js'
import type { GetEntitiesOptions } from '../queries/get_entities.js'
import type { GetEntitiesFromSitelinksOptions } from '../queries/get_entities_from_sitelinks.js'
import type { GetEntityRevisionOptions } from '../queries/get_entity_revision.js'
import type { GetManyEntitiesOptions } from '../queries/get_many_entities.js'
import type { GetReverseClaimsOptions } from '../queries/get_reverse_claims.js'
import type { GetRevisionsOptions } from '../queries/get_revisions.js'
import type { SearchEntitiesOptions } from '../queries/search_entities.js'
import type { SimplifiedPropertySnaks, SimplifiedReferences, SimplifiedSnak, SimplifiedSnaks } from '../types/simplify_claims.js'

export interface WbParsers {
  entities (res: WbGetEntitiesResponse): SimplifiedEntities;
  pagesTitles (res: CirrusSearchPagesResponse): Titles;
}

export interface Wbk {
  instance: {
    root: Url;
    apiEndpoint: Url;
  };

  // API Queries
  searchEntities (options: SearchEntitiesOptions): Url;
  cirrusSearchPages (options: CirrusSearchPagesOptions): Url;
  getEntities (options: GetEntitiesOptions): Url;
  getManyEntities (options: GetManyEntitiesOptions): Url;
  getRevisions (options: GetRevisionsOptions): Url;
  getEntityRevision (options: GetEntityRevisionOptions): Url;
  getEntitiesFromSitelinks (options: GetEntitiesFromSitelinksOptions): Url;

  // SPARQL Queries
  sparqlQuery (sparql: string): Url;
  getReverseClaims (options: GetReverseClaimsOptions): Url

  simplify: {
    labels (labels: Labels): SimplifiedLabels;
    descriptions (descriptions: Descriptions): SimplifiedDescriptions;
    aliases (aliases: Aliases): SimplifiedAliases;
    claim (claim: Claim): SimplifiedClaim;
    propertyClaims (propertyClaims: PropertyClaims): SimplifiedPropertyClaims;
    claims (claims: Claims): SimplifiedClaims;
    qualifier (qualifier: Qualifier): SimplifiedQualifier;
    propertyQualifiers (propertyQualifiers: PropertyQualifiers): SimplifiedPropertyQualifiers;
    qualifiers (qualifiers: Qualifiers): SimplifiedQualifiers;
    references (references: References): SimplifiedReferences;
    sitelinks (sitelinks: Sitelinks): SimplifiedSitelinks;
    snak (snak: Snak): SimplifiedSnak;
    propertySnaks (propertySnaks: PropertySnaks): SimplifiedPropertySnaks;
    snaks (snaks: Snaks): SimplifiedSnaks;
    lemmas (lemmas: Lemmas): SimplifiedLemmas;
    representations (representations: Representations): SimplifiedRepresentations;
    glosses (glosses: Glosses): SimplifiedGlosses;
    form (form: Form): SimplifiedForm;
    forms (forms: Forms): SimplifiedForms;
    sense (sense: Sense): SimplifiedSense;
    senses (senses: Senses): SimplifiedSenses;
    sparqlResults (sparqlResults: SparqlResults): SimplifiedSparqlResults;
    entity (entity: Entity): SimplifiedEntity;
    entities (entities: Entities): SimplifiedEntities;
  };

  parse: {
    wb: WbParsers,
    wd: WbParsers,
  },

  // Helpers
  getEntityIdFromGuid (guid: Guid): EntityId;
  getImageUrl (filename: string, width?: number): Url;
  getNumericId (id: string): string;
  isEntityId (str: string): boolean;
  isEntityPageTitle (str: string): boolean;
  isEntitySchemaId (str: string): boolean;
  isFormId (str: string): boolean;
  isGuid (str: string): boolean;
  isHash (str: string): boolean;
  isItemId (str: string): boolean;
  isLexemeId (str: string): boolean;
  isNumericId (str: string): boolean;
  isPropertyClaimsId (str: string): boolean;
  isPropertyId (str: string): boolean;
  isRevisionId (str: string): boolean;
  isSenseId (str: string): boolean;

  wikibaseTimeToEpochTime (wikibaseTime: TimeInputValue): number;
  wikibaseTimeToISOString (wikibaseTime: TimeInputValue): string;
  wikibaseTimeToSimpleDay (wikibaseTime: TimeInputValue): string;
  wikibaseTimeToDateObject (wikibaseTime: TimeInputValue): Date;

  // Sitelinks helpers
  getSitelinkUrl ({ site, title }: GetSitelinkUrlOptions): Url;
  getSitelinkData (site: Site | Url): SitelinkData;
  isSitelinkKey (str: string): boolean;

  // Ranks helpers
  truthyPropertyClaims (propertyClaims: PropertyClaims): PropertyClaims;
  nonDeprecatedPropertyClaims (propertyClaims: PropertyClaims): PropertyClaims;
  truthyClaims (claims: Claims): Claims;
}
