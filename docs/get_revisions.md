# Get revisions

Uses [MediaWiki Revision API](https://www.mediawiki.org/wiki/API:Revisions) to get entities revisions, generating URLs of the kind: https://www.wikidata.org/w/api.php?action=query&prop=revisions&titles=Q3548931&format=json&rvstart=1497020505&rvlimit=max

```js
// get one entity's revisions (up to 500)
wdk.getRevisions('Q3548931')
// get several entities' revisions (up to 500)
wdk.getRevisions(['Q3548931', 'Q3548932'])
// get the last 10 revisions
wdk.getRevisions('Q3548931', { limit: 10 })
// get revisions since a precise time
const startTime = // ISO time string OR epoch time in seconds OR milliseconds
wdk.getRevisions('Q3548931', { start: startTime })
// get revisions from a precise period
wdk.getRevisions('Q3548931', { start: startTime, end: endTime })
```
