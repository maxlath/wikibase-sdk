# Simplify entities data

## Summary

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Simplify entity](#simplify-entity)
- [Simplify claims](#simplify-claims)
- [Simplify labels](#simplify-labels)
- [Simplify descriptions](#simplify-descriptions)
- [Simplify aliases](#simplify-aliases)
- [Simplify sitelinks](#simplify-sitelinks)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Simplify entity
Applying all simplifiers at once: labels, descriptions, aliases, claims, sitelinks. See next sections for details.
```js
wdk.simplify.entity(entity)
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
