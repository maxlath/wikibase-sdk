const { getSitelinkUrl } = require('./sitelinks')

module.exports = (sitelinks, options = {}) => {
  const { addUrl } = options
  return Object.keys(sitelinks).reduce(aggregateValues(sitelinks, addUrl), {})
}

const aggregateValues = (sitelinks, addUrl) => (index, key) => {
  // Accomodating for wikibase-cli, which might set the sitelink to null
  // to signify that a requested sitelink was not found
  if (sitelinks[key] == null) {
    index[key] = sitelinks[key]
    return index
  }
  const { title } = sitelinks[key]
  if (addUrl) {
    index[key] = { title, url: getSitelinkUrl(key, title) }
  } else {
    index[key] = title
  }
  return index
}
