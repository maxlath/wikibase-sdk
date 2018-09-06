# Get entities reverse claims

In wikidata API answers, you can only access claims on the entity's page, not claims pointing to this entity (what would be in the "what links here" page).

Fortunatly, we can use [SPARQL queries](sparql_query.md) to get relations the other way around, answering the question "*what are the entities having this value for this property?*". This is what `wdk.getReverseClaims` provides.

For instance, let's say you want to find all the entities that have Leo Tolstoy ([Q7243](http://www.wikidata.org/entity/Q7243)) for author ([P50](http://www.wikidata.org/entity/P50))

```js
const url = wdk.getReverseClaims('P50', 'Q7243')

// And you can then query the obtained entities ids
request(url)
.then(body => {
  const entitiesIds = wdk.simplify.sparqlResults(body)
  const url2 = wdk.getEntities(entitiesIds)
  request(url2) ....
})
```

It also work for string values: e.g. let's say you want to find which book as `978-0-465-06710-7` for ISBN-13 ([P212](http://www.wikidata.org/entity/P212)):

```js
const url = wdk.getReverseClaims('P212', '978-0-465-06710-7')
```

You can also pass several possible properties, by passing properties as an array:
```js
const url = wdk.getReverseClaims([ 'P50', 'P110' ], 'Q281411')
```

or several values by passing values as an array.
```js
const url = wdk.getReverseClaims('P212', [ '978-0-465-06710-7', '978-2-267-02700-6' ])
```

You can also generate URLs that try to query both several properties and values at once, but queries seem to fail :/

## Options
### limit

Default value: no limit
```js
// Find only 10 works of Victor Hugo
const url = wdk.getReverseClaims('P50', 'Q535', { limit: 10 })
```

### keepProperties
Default: `false`
If you want to get not only items but also properties, set `keepProperties` to true:
```js
const url = wdk.getReverseClaims('P50', 'Q535', { keepProperties: true })
```

### caseInsensitive
Default: `false`
Make the value case insensitive

> :warning: use only when needed as it makes the query less perfomante

```js
// Find entities that have a twitter username matching 'BouletCorp', without considering the case
const url = wdk.getReverseClaims('P2002', 'BouletCorp', { caseInsensitive: true })
```
