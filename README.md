# Wikibase SDK

A javascript tool-suite to query a [Wikibase](http://wikiba.se) instance and simplify its results.

This package was primarily developed as `wikidata-sdk` but has now being generalized to support any Wikibase instance: [wikidata.org](https://www.wikidata.org) among others.

This project received a [Wikimedia Project Grant](https://meta.wikimedia.org/wiki/Grants:Project/WikidataJS).

<div align="center">
  <a href="https://wikiba.se"><img height="150" src="https://raw.githubusercontent.com/maxlath/wikibase-sdk/master/assets/wikibase.png" alt="wikibase"></a>
  <!-- yeay hacky margin \o/ -->
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://wikidata.org"><img src="https://raw.githubusercontent.com/maxlath/wikibase-sdk/master/assets/wikidata.jpg" alt="wikidata"></a>
</div>

[![NPM](https://nodei.co/npm/wikibase-sdk.png?stars&downloads&downloadRank)](https://npmjs.com/package/wikibase-sdk/)
[![NPM](https://nodei.co/npm/wikidata-sdk.png?stars&downloads&downloadRank)](https://npmjs.com/package/wikidata-sdk/)

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node](https://img.shields.io/badge/node-%3E=%20v6.4.0-brightgreen.svg)](http://nodejs.org)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

## Summary

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Dependencies](#dependencies)
- [Install](#install)
- [Import](#import)
- [Features](#features)
  - [Wikibase API](#wikibase-api)
  - [Wikibase Query](#wikibase-query)
  - [General helpers](#general-helpers)
- [Contributing](#contributing)
- [Donate](#donate)
- [See Also](#see-also)
- [You may also like](#you-may-also-like)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Dependencies
This module uses [JavaScript ES6](https://en.wikipedia.org/wiki/ECMAScript#6th_Edition_-_ECMAScript_2015), which means NodeJS `>= v6.4.0` or not too outdated web browsers.

For older version, you can use ES5 [bundles](docs/install.md#bundles).

## Install
```sh
npm install wikibase-sdk
```

## Import
```js
const wbk = require('wikibase-sdk')({
  instance: 'https://my-wikibase-instan.se',
  sparqlEndpoint: 'https://query.my-wikibase-instan.se/sparql'
})
```
The `wdk` object of previous versions of this documentation - from the time this module was bound to wikidata.org only - thus corresponds to the following:
```js
const wdk = require('wikibase-sdk')({
  instance: 'https://www.wikidata.org',
  sparqlEndpoint: 'https://query.wikidata.org/sparql'
})
```
For convenience, and for the sake of retro-compatibility, that same `wdk` object can be obtain with:
```js
// After having run `npm install wikidata-sdk`
const wdk = require('wikidata-sdk')
```
and instance-independant helper functions are directly available from the module root:
```js
const { simplify, parse, isEntityId, isPropertyId, ... } = require('wikibase-sdk')
```

## Features
### Wikibase API
A set of functions to make **read** queries to a Wikibase instance API (see [Wikidata API documentation](https://www.wikidata.org/w/api.php)).
For **write** operations, see [wikibase-edit](http://github.com/maxlath/wikibase-edit).

* **[Search entities](docs/search_entities.md)**
* **[Get entities](docs/get_entities.md)**
  * [By ids](docs/get_entities.md#by-ids)
  * [By id and revision](docs/get_entities.md#by-id-and-revision)
  * [By Wikipedia titles](docs/get_entities.md#by-wikipedia-titles)
  * [By other Wikimedia projects titles](docs/get_entities.md#by-other-wikimedia-projects-titles)
* **[Simplify entities data](docs/simplify_entities_data.md)**
* **[Get revisions](docs/get_revisions.md)**

### Wikibase Query
There are additional functions for Wikibase instances that have a [SPARQL](https://en.wikipedia.org/wiki/SPARQL) Query Service (such as [Wikidata Query](http://query.wikidata.org/) for wikidata.org). SPARQL can be a weird thing at first, but the Wikidata team and community really puts lots of efforts to make things easy with a super rich [Wikidata Query Help](https://www.wikidata.org/wiki/Wikidata:SPARQL_query_service/Wikidata_Query_Help) page, [an awesome tool to test you queries and visualize the result](https://query.wikidata.org/), and [lots of examples](https://www.wikidata.org/wiki/Special:MyLanguage/Wikidata:SPARQL_query_service/queries/examples)!

* **[Get JSON from a SPARQL query](docs/sparql_query.md)**
* **[Simplify results](docs/simplify_sparql_results.md)**
* **Pre-baked queries**
  * [Get entities reverse claims](docs/get_entities_reverse_claims.md)

### General helpers
  * **[Work with ids](docs/general_helpers.md#work-with-ids)**
  * **[Sitelink helper](docs/general_helpers.md#sitelink-helpers)**
  * **[Wikibase Time converters](docs/general_helpers.md#wikibase-time-converters)**

## Contributing
**Context**

This library had for primary purpose to serve the needs of the [inventaire](https://github.com/inventaire/inventaire) project but extending its capabilities to other needs it totally possible: feel welcome to post your suggestions as issues or pull requests!

**Design constraints**

* `wikibase-sdk` should stay "small" and dependency-free, so that a web application can include it in its bundle without paying a too high cost for it. A consequence is that the lib generates URLs where other libs would integrate doing the request and parsing it's response. But that actually feels quite right to do this way: simply generating the URLs let's users free to handle requests as they like (with callbacks, promises, async/await, whatever!)
* Therefore, it should focus on providing basic, general helper functions most application working with a Wikibase instance would need.
* Write operations should go into [wikibase-edit](https://github.com/maxlath/wikibase-edit) as it involves working with Wikibase credentials/tokens.
* General command-line interface tools should go to [wikibase-cli](https://github.com/maxlath/wikibase-cli), very specific ones — [`wikidata-filter`, `import-wikidata-dump-to-couchdb`, and alikes](#see-also) — should get their own modules.

## Donate
We are developing and maintaining tools to work with Wikidata from NodeJS, the browser, or simply the command line, with quality and ease of use at heart. Any donation will be interpreted as a "please keep going, your work is very much needed and awesome. PS: love". [Donate](https://liberapay.com/WikidataJS)

## See Also
* [wikibase-edit](https://github.com/maxlath/wikibase-edit): Edit a Wikibase instance from NodeJS
* [wikibase-cli](https://github.com/maxlath/wikibase-cli): The command-line interface to Wikibase instances
* [wikidata-filter](https://github.com/maxlath/wikidata-filter): A command-line tool to filter a Wikidata dump by claim
* [wikidata-subset-search-engine](https://github.com/inventaire/wikidata-subset-search-engine): Tools to setup an ElasticSearch instance fed with subsets of Wikidata
* [wikidata-taxonomy](https://github.com/nichtich/wikidata-taxonomy): Command-line tool to extract taxonomies from Wikidata
* [import-wikidata-dump-to-couchdb](https://github.com/maxlath/import-wikidata-dump-to-couchdb): Import a subset or a full Wikidata dump into a CouchDB database
* [Other Wikidata external tools](https://www.wikidata.org/wiki/Wikidata:Tools/External_tools)

## You may also like

[![inventaire banner](https://inventaire.io/public/images/inventaire-brittanystevens-13947832357-CC-BY-lighter-blue-4-banner-500px.png)](https://inventaire.io)

Do you know [inventaire.io](https://inventaire.io/)? It's a web app to share books with your friends, built on top of Wikidata! And its [libre software](http://github.com/inventaire/inventaire) too.

## License
[MIT](LICENSE.md)
