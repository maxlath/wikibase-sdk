import { isPlainObject } from '../utils/utils.js'
import { GetEntities } from './get_entities.js'

export const GetManyEntities = buildUrl => {
  const getEntities = GetEntities(buildUrl)
  return (ids, languages, props, format, redirects) => {
    // Polymorphism: arguments can be passed as an object keys
    if (isPlainObject(ids)) {
      ({ ids, languages, props, format, redirects } = ids)
    }

    if (!(ids instanceof Array)) throw new Error('getManyEntities expects an array of ids')

    return getIdsGroups(ids)
    .map(idsGroup => getEntities(idsGroup, languages, props, format, redirects))
  }
}

const getIdsGroups = ids => {
  const groups = []
  while (ids.length > 0) {
    const group = ids.slice(0, 50)
    ids = ids.slice(50)
    groups.push(group)
  }
  return groups
}
