# Get entities reverse claims

In wikidata API answers, you can only access claims on the entity's page, not claims pointing to this entity (what would be in the "what links here" page).

Fortunatly, we can use [SPARQL queries](sparql_query.md) to get relations the other way around, answering the question "*what are the entities having this value for this property?*". This is `wdk.getReverseClaims``provides

For instance, let's say you want to find all the entities that have Leo Tolstoy ([Q7243](http://www.wikidata.org/entity/Q7243)) for author ([P50](http://www.wikidata.org/entity/P50))

```js
const url = wdk.getReverseClaims('P50', 'Q7243')

# And you can then query the obtained entities ids
request(url)
.then(body => {
  const entitiesIds = wdk.simplifySparqlResults(body)
  const url2 = wdk.getEntities(entitiesIds)
  request(url2) ....
})
```

It also work for string values: e.g. let's say you want to find which book as `978-0-465-06710-7` for ISBN-13 ([P212](http://www.wikidata.org/entity/P212)):

```js
const url = wdk.getReverseClaims('P212', '978-0-465-06710-7')
```

## Options
### limit

Default value: `1000`
```js
// Find only 10 works of Victor Hugo
const url = wdk.getReverseClaims('P50', 'Q535', { limit: 10 })
```

### caseInsensitive
Make the value case insensitive

> :warning: use only when needed as it makes the query less perfomante

```js
// Find entities that have a twitter username matching 'BouletCorp', without considering the case
const url = wdk.getReverseClaims('P2002', 'BouletCorp', { caseInsensitive: true })
```
