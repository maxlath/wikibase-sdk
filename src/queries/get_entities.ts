import * as validate from '../helpers/validate.js'
import { forceArray, rejectObsoleteInterface, shortLang } from '../utils/utils.js'
import type { EntityId } from '../types/entity.js'
import type { Props, Url, UrlResultFormat, WmLanguageCode } from '../types/options.js'
import type { WbGetEntities } from '../types/wbgetentities.js'
import type { BuildUrlFunction } from '../utils/build_url.js'

export interface GetEntitiesOptions {
  ids: EntityId | EntityId[]
  languages?: WmLanguageCode | WmLanguageCode[]
  props?: Props | Props[]
  format?: UrlResultFormat
  redirects?: boolean
}

export function getEntitiesFactory (buildUrl: BuildUrlFunction) {
  return function getEntities ({
    ids,
    languages,
    props,
    format = 'json',
    redirects,
  }: GetEntitiesOptions): Url {
    rejectObsoleteInterface(arguments)

    // ids can't be let empty
    if (!(ids && ids.length > 0)) throw new Error('no id provided')

    // Allow to pass ids as a single string
    ids = forceArray(ids)

    ids.forEach(o => validate.entityId(o))

    if (ids.length > 50) {
      console.warn(`getEntities accepts 50 ids max to match Wikidata API limitations:
      this request won't get all the desired entities.
      You can use getManyEntities instead to generate several request urls
      to work around this limitation`)
    }

    // Properties can be either one property as a string
    // or an array or properties;
    // either case me just want to deal with arrays

    const query: WbGetEntities = {
      action: 'wbgetentities',
      ids: ids.join('|'),
      format,
    }

    if (redirects === false) query.redirects = 'no'

    if (languages) {
      languages = forceArray(languages).map(shortLang)
      query.languages = languages.join('|')
    }

    if (props && props.length > 0) query.props = forceArray(props).join('|')

    return buildUrl(query)
  }
}
