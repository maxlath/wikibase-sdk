# Use a custom Wikibase instance

All queries URLs are set for Wikidata API: `https://www.wikidata.org/w/api.php`.
To use a custom instance, you can simply replace the default API endpoint by your custom one:
```js
const defaultInstance = 'https://www.wikidata.org/w/api.php'
const customInstance = 'https://mywikibase.instance/w/api.php'
const customize = url => url.replace(defaultInstance, customInstance)

const url = customize(wdk.anyOfTheQueryUrlFunctions(params))
```
