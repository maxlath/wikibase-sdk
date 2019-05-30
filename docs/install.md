# Installation

## Summary

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [via NPM](#via-npm)
  - [wikibase-sdk](#wikibase-sdk)
  - [wikidata-sdk](#wikidata-sdk)
- [Bundles](#bundles)
  - [wikibase-sdk](#wikibase-sdk-1)
  - [wikidata-sdk](#wikidata-sdk-1)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## via NPM
### wikibase-sdk
In a terminal at your project root:

```sh
npm install wikibase-sdk
```

then in your javascript project:
```js
const wbk = require('wikibase-sdk')({
  instance: 'https://my-wikibase-instan.se',
  sparqlEndpoint: 'https://query.my-wikibase-instan.se/sparql'
})
```

### wikidata-sdk
It's basically the same, you just don't have to pass the configuration object.

In a terminal at your project root:
```sh
npm install wikidata-sdk
```
then in your javascript project:
```js
const wbk = require('wikidata-sdk')
```

## Bundles
> *a.k.a the Old Way*

Just download the raw package from this repository:
```sh
cd /path/to/project
# wikibase-sdk
wget https://raw.githubusercontent.com/maxlath/wikibase-sdk/master/dist/wikibase-sdk.js
# wikidata-sdk
wget https://raw.githubusercontent.com/maxlath/wikibase-sdk/master/dist/wikidata-sdk.js
```
and then in your HTML:
### wikibase-sdk
```html
<!-- Initialize a global WBK function -->
<script src="/wikibase-sdk.min.js"></script>
<script>
  const wbk = WBK({
    instance: 'https://my-wikibase-instan.se',
    sparqlEndpoint: 'https://query.my-wikibase-instan.se/sparql'
  })
  wbk.getEntities('Q1')
</script>
```
### wikidata-sdk
```html
<!-- Initialize a global wdk object -->
<script src="/wikidata-sdk.min.js"></script>
<script>
  wdk.getEntities('Q1')
</script>
```

**Tip**: to work, this requires having a file server running at your project's root.
The simplest form of such a server can be:
```sh
cd /path/to/project
python -m SimpleHTTPServer
```
or, if you have NodeJS and NPM installed, you can use the awesome [live-server](https://github.com/tapio/live-server)
