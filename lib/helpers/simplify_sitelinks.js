const { getSitelinkUrl } = require('./sitelinks')

module.exports = (sitelinks, options = {}) => {
  let { addUrl, keepBadges, keepAll } = options
  keepBadges = keepBadges || keepAll
  return Object.keys(sitelinks).reduce(aggregateValues({
    sitelinks,
    addUrl,
    keepBadges
  }), {})
}

const aggregateValues = ({ sitelinks, addUrl, keepBadges }) => (index, key) => {
  // Accomodating for wikibase-cli, which might set the sitelink to null
  // to signify that a requested sitelink was not found
  if (sitelinks[key] == null) {
    index[key] = sitelinks[key]
    return index
  }

  const { title, badges } = sitelinks[key]
  if (addUrl || keepBadges) {
    index[key] = { title }
    if (addUrl) index[key].url = getSitelinkUrl(key, title)
    if (keepBadges) index[key].badges = badges
  } else {
    index[key] = title
  }
  return index
}
