const buildUrl = require('../utils/build_url')
const { isPlainObject, forceArray, shortLang } = require('../utils/utils')

module.exports = function (ids, languages, props, format) {
  // polymorphism: arguments can be passed as an object keys
  if (isPlainObject(ids)) {
    // Not using destructuring assigment there as it messes with both babel and standard
    const params = ids
    ids = params.ids
    languages = params.languages
    props = params.props
    format = params.format
  }

  format = format || 'json'

  // ids can't be let empty
  if (!(ids && ids.length > 0)) throw new Error('no id provided')

  if (ids.length > 50) {
    console.warn(`getEntities accepts 50 ids max to match Wikidata API limitations:
      this request won't get all the desired entities.
      You can use getManyEntities instead to generate several request urls
      to work around this limitation`)
  }

  // Properties can be either one property as a string
  // or an array or properties;
  // either case me just want to deal with arrays
  ids = forceArray(ids)
  props = forceArray(props)

  const query = {
    action: 'wbgetentities',
    ids: ids.join('|'),
    format: format
  }

  if (languages) {
    languages = forceArray(languages).map(shortLang)
    query.languages = languages.join('|')
  }

  if (props && props.length > 0) query.props = props.join('|')

  return buildUrl(query)
}
