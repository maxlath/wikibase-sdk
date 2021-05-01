const toDateObject = require('./wikibase_time_to_date_object')

const helpers = {}
helpers.isNumericId = id => /^[1-9][0-9]*$/.test(id)
helpers.isEntityId = id => /^((Q|P|L)[1-9][0-9]*|L[1-9][0-9]*-(F|S)[1-9][0-9]*)$/.test(id)
helpers.isEntitySchemaId = id => /^E[1-9][0-9]*$/.test(id)
helpers.isItemId = id => /^Q[1-9][0-9]*$/.test(id)
helpers.isPropertyId = id => /^P[1-9][0-9]*$/.test(id)
helpers.isLexemeId = id => /^L[1-9][0-9]*$/.test(id)
helpers.isFormId = id => /^L[1-9][0-9]*-F[1-9][0-9]*$/.test(id)
helpers.isSenseId = id => /^L[1-9][0-9]*-S[1-9][0-9]*$/.test(id)
helpers.isGuid = guid => /^((Q|P|L)[1-9][0-9]*|L[1-9][0-9]*-(F|S)[1-9][0-9]*)\$[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(guid)
helpers.isHash = hash => /^[0-9a-f]{40}$/.test(hash)
helpers.isPropertyClaimsId = id => {
  const [ entityId, propertyId ] = id.split('#')
  return helpers.isEntityId(entityId) && helpers.isPropertyId(propertyId)
}
helpers.isRevisionId = id => /^\d+$/.test(id)

helpers.isEntityPageTitle = title => {
  if (typeof title !== 'string') return false
  let [ namespace, id ] = title.split(':')
  if (namespace && id) {
    return isEntityNamespace(namespace) && helpers[`is${namespace}Id`](id)
  } else {
    id = namespace
    return helpers.isItemId(id)
  }
}

const entityNamespaces = [ 'Item', 'Property', 'Lexeme' ]

const isEntityNamespace = str => entityNamespaces.includes(str)

const isNonNestedEntityId = id => /^(Q|P|L)[1-9][0-9]*$/.test(id)

helpers.getNumericId = id => {
  if (!isNonNestedEntityId(id)) throw new Error(`invalid entity id: ${id}`)
  return id.replace(/^(Q|P|L)/, '')
}

helpers.wikibaseTimeToDateObject = toDateObject

// Try to parse the date or return the input
const bestEffort = fn => value => {
  try {
    return fn(value)
  } catch (err) {
    value = value.time || value

    const sign = value[0]
    let [ yearMonthDay, withinDay ] = value.slice(1).split('T')
    yearMonthDay = yearMonthDay.replace(/-00/g, '-01')

    return `${sign}${yearMonthDay}T${withinDay}`
  }
}

const toEpochTime = wikibaseTime => toDateObject(wikibaseTime).getTime()
const toISOString = wikibaseTime => toDateObject(wikibaseTime).toISOString()

// A date format that knows just three precisions:
// 'yyyy', 'yyyy-mm', and 'yyyy-mm-dd' (including negative and non-4 digit years)
// Should be able to handle the old and the new Wikidata time:
// - in the old one, units below the precision where set to 00
// - in the new one, those months and days are set to 01 in those cases,
//   so when we can access the full claim object, we check the precision
//   to recover the old format
const toSimpleDay = wikibaseTime => {
  // Also accept claim datavalue.value objects, and actually prefer those,
  // as we can check the precision
  if (typeof wikibaseTime === 'object') {
    const { time, precision } = wikibaseTime
    // Year precision
    if (precision === 9) wikibaseTime = time.replace('-01-01T', '-00-00T')
    // Month precision
    else if (precision === 10) wikibaseTime = time.replace('-01T', '-00T')
    else wikibaseTime = time
  }

  return wikibaseTime.split('T')[0]
  // Remove positive years sign
  .replace(/^\+/, '')
  // Remove years padding zeros
  .replace(/^(-?)0+/, '$1')
  // Remove days if not included in the Wikidata date precision
  .replace(/-00$/, '')
  // Remove months if not included in the Wikidata date precision
  .replace(/-00$/, '')
}

helpers.wikibaseTimeToEpochTime = bestEffort(toEpochTime)
helpers.wikibaseTimeToISOString = bestEffort(toISOString)
helpers.wikibaseTimeToSimpleDay = bestEffort(toSimpleDay)

helpers.getImageUrl = (filename, width) => {
  let url = `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}`
  if (typeof width === 'number') url += `?width=${width}`
  return url
}

helpers.getEntityIdFromGuid = guid => {
  const parts = guid.split(/[$-]/)
  if (parts.length === 6) {
    // Examples:
    // - q520$BCA8D9DE-B467-473B-943C-6FD0C5B3D02C
    // - P6216-a7fd6230-496e-6b47-ca4a-dcec5dbd7f95
    return parts[0].toUpperCase()
  } else if (parts.length === 7) {
    // Examples:
    // - L525-S1$66D20252-8CEC-4DB1-8B00-D713CFF42E48
    // - L525-F2-52c9b382-02f5-4413-9923-26ade74f5a0d
    return parts.slice(0, 2).join('-').toUpperCase()
  } else {
    throw new Error(`invalid guid: ${guid}`)
  }
}

module.exports = helpers
