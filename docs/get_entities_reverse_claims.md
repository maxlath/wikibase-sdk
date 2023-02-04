# Get entities reverse claims

In wikidata API answers, you can only access claims on the entity's page, not claims pointing to this entity (what would be in the "what links here" page).

Fortunatly, we can use [SPARQL queries](sparql_query.md) to get relations the other way around, answering the question "*what are the entities having this value for this property?*". This is what `wbk.getReverseClaims` provides.

For instance, let's say you want to find all the entities that have Leo Tolstoy ([Q7243](http://www.wikidata.org/entity/Q7243)) for author ([P50](http://www.wikidata.org/entity/P50))

```js
const url = wbk.getReverseClaims({
  properties: [ 'P50' ],
  values: [ 'Q7243' ]
})

const body = await fetch(url).then(res => res.text())
const entitiesIds = wbk.simplify.sparqlResults(body)
// And you can then query the obtained entities ids
const url2 = wbk.getEntities(entitiesIds)
fetch(url2) ....
```

It also work for string values: e.g. let's say you want to find which book as `978-0-465-06710-7` for ISBN-13 ([P212](http://www.wikidata.org/entity/P212)):

```js
const url = wbk.getReverseClaims({
  properties: [ 'P212' ],
  values: [ '978-0-465-06710-7' ]
})
```

You can also pass several possible properties, by passing properties as an array:
```js
const url = wbk.getReverseClaims({
  properties: [ 'P50', 'P110' ],
  values: [ 'Q281411' ]
})
```

or several values by passing values as an array.
```js
const url = wbk.getReverseClaims({
  properties: [ 'P212' ],
  values: [ '978-0-465-06710-7', '978-2-267-02700-6' ]
})
```

You can also generate URLs that try to query both several properties and values at once, but queries seem to fail :/

## limit

Default value: no limit
```js
// Find only 10 works of Victor Hugo
const url = wbk.getReverseClaims({
  properties: [ 'P50' ],
  values: [ 'Q535' ],
  limit: 10
})
```

## keepProperties
Default: `false`
If you want to get not only items but also properties, set `keepProperties` to true:
```js
const url = wbk.getReverseClaims({
  properties: [ 'P50' ],
  values: [ 'Q535' ],
  keepProperties: true
})
```

## caseInsensitive
Default: `false`
Make the value case insensitive

> :warning: use only when needed as it makes the query less perfomante

```js
// Find entities that have a twitter username matching 'BouletCorp', without considering the case
const url = wbk.getReverseClaims({
  properties: [ 'P2002' ],
  values: [ 'BouletCorp' ],
  caseInsensitive: true
})
```
