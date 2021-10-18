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
- [Simplify lemmas](#simplify-lemmas)
- [Simplify forms](#simplify-forms)
- [Simplify senses](#simplify-senses)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Simplify entity
Applying all simplifiers at once. See next sections for details.
```js
wbk.simplify.entity(entity)
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
  keepNonTruthy: true, // For each property, keep claims with preferred rank, or normal rank if no claims has the preferred rank
  keepNonDeprecated: true, // For each property, keep all claims with preferred or normal rank

  // sitelinks
  addUrl: true
}
wbk.simplify.entity(entity, simplificationOptions)
```

## Simplify entities
Same as [`wbk.simplify.entity`](#simplify-entity), but accepts all the entities sent by the Wikibase API at once:
```js
const url = wbk.getEntities([ 'Q1', 'P2', 'L3' ])
fetch(url)
.then(res => res.json())
.then(res => {
  const { entities } = res
  // simplificationOptions: see wbk.simplify.entity doc above
  const simplifiedEntities = wbk.simplify.entities(entities, simplificationOptions)
})
```

## Simplify claims
That's a huge chunk so it got it's own doc page: [simplify claims](simplify_claims.md)

## Simplify labels
```js
wbk.simplify.labels(entity.labels)
```
Before: `{ pl: { language: 'pl', value: 'książka' } }`<br>
After: `{ pl: 'książka' }`

## Simplify descriptions
```js
wbk.simplify.descriptions(entity.descriptions)
```
Before: `{ pl: { language: 'pl', value: 'dokument piśmienniczy [...]' } }`<br>
After: `{ pl: 'dokument piśmienniczy [...]' }`

## Simplify aliases
```js
wbk.simplify.aliases(entity.aliases)
```
Before: `{ pl: [ { language: 'pl', value: 'Tom' }, { language: 'pl', value: 'Tomik' } ] }`<br>
After: `{ pl: [ 'Tom', 'Tomik' ] }`

## Simplify sitelinks
```js
wbk.simplify.sitelinks(entity.sitelinks)
```
Before: `{ plwiki: { site: 'plwiki', title: 'Książka', badges: [] } }`<br>
After: `{ plwiki: 'Książka' }`

### add sitelinks URLs
```js
wbk.simplify.sitelinks(entity.sitelinks, { addUrl: true })
```
Before: `{ plwiki: { site: 'plwiki', title: 'Książka', badges: [] } }`<br>
After: `{ plwiki: { title: 'Książka', url: 'https://pl.wikipedia.org/wiki/Książka' }`

## Simplify lemmas
*Specific to lexemes*

```js
wbk.simplify.lemmas(entity.lemmas)
```
Before: `{ pl: { language: 'pl', value: 'książka' } }`<br>
After: `{ pl: 'książka' }`

## Simplify forms
*Specific to lexemes*

```js
// return an array of simplified forms, that is,
// the forms but with simplified representations and claims
wbk.simplify.forms(entity.forms)
```

## Simplify senses
*Specific to lexemes*

```js
// return an array of simplified senses, that is,
// the senses but with simplified glosses and claims
wbk.simplify.senses(entity.senses)
```
