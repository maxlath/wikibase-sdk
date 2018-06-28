# Simplify entities data

## Summary

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Simplify entity](#simplify-entity)
- [Simplify entities](#simplify-entities)
- [Simplify claims](simplify_claims.md)
- [Simplify labels](#simplify-labels)
- [Simplify descriptions](#simplify-descriptions)
- [Simplify aliases](#simplify-aliases)
- [Simplify sitelinks](#simplify-sitelinks)
  - [add sitelinks URLs](#add-sitelinks-urls)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Simplify entity
Applying all simplifiers at once: labels, descriptions, aliases, claims, sitelinks. See next sections for details.
```js
wdk.simplify.entity(entity)
```
You can also pass options as a second argument, that will then be passed the subfunctions: currently only [simplify claims](simplify_claims.md) and [simplify sitelinks](#simplify-sitelinks).
```js
const simplificationOptions = {
  // claims
  entityPrefix: 'wd',
  propertyPrefix: 'wdt',
  keepRichValues: true,
  keepQualifiers: true,
  keepReferences: true,
  keepIds: true,
  keepHashes: true,
  keepNonTruthy: true,
  // sitelinks
  addUrl: true
}
wdk.simplify.entity(entity, simplificationOptions)
```

## Simplify entities
Same as [`wdk.simplify.entity`](#simplify-entity), but accepts the all the entities sent by the Wikidata API at once:
```js
const url = wdk.getEntities(['Q1', 'Q2', 'Q3'])
fetch(url)
.then(res => {
  const { entities } = res.json()
  # simplificationOptions: see wdk.simplify.entity doc above
  const simplifiedEntities = wdk.simplify.entities(entities, simplificationOptions)
})
```

## Simplify claims
That's a huge chunk so it got it's own doc page: [simplify claims](simplify_claims.md)

## Simplify labels
```js
wdk.simplify.labels(entity.labels)
```
Before: `{ pl: { language: 'pl', value: 'książka' } }`<br>
After: `{ pl: 'książka' }`

## Simplify descriptions
```js
wdk.simplify.descriptions(entity.descriptions)
```
Before: `{ pl: { language: 'pl', value: 'dokument piśmienniczy [...]' } }`<br>
After: `{ pl: 'dokument piśmienniczy [...]' }`

## Simplify aliases
```js
wdk.simplify.aliases(entity.aliases)
```
Before: `{ pl: [ { language: 'pl', value: 'Tom' }, { language: 'pl', value: 'Tomik' } ] }`<br>
After: `{ pl: [ 'Tom', 'Tomik' ] }`

## Simplify sitelinks
```js
wdk.simplify.sitelinks(entity.sitelinks)
```
Before: `{ plwiki: { site: 'plwiki', title: 'Książka', badges: [] } }`<br>
After: `{ plwiki: 'Książka' }`

### add sitelinks URLs
```js
wdk.simplify.sitelinks(entity.sitelinks, { addUrl: true })
```
Before: `{ plwiki: { site: 'plwiki', title: 'Książka', badges: [] } }`<br>
After: `{ plwiki: { title: 'Książka', url: 'https://pl.wikipedia.org/wiki/Książka' }`
