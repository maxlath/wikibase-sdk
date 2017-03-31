# Wikidata SDK

A javascript tool-suite to query [Wikidata](http://wikidata.org/) and simplify its results.

[![wikidata](https://raw.githubusercontent.com/maxlath/wikidata-sdk/master/assets/wikidata.jpg)](https://wikidata.org)

[![NPM](https://nodei.co/npm/wikidata-sdk.png?stars&downloads&downloadRank)](https://npmjs.com/package/wikidata-sdk/) [![NPM](https://nodei.co/npm-dl/wikidata-sdk.png?months=6&height=3)](https://npmjs.com/package/wikidata-sdk/)

## Install
```sh
npm install wikidata-sdk --save
```
Or see [alternative installations](docs/install.md)

## Features
### Wikidata API
A set of tools to **read** Wikidata from the [Wikidata API](https://www.wikidata.org/w/api.php). For **write** operations, see [wikidata-edit](http://github.com/maxlath/wikidata-edit).

* **[Search entities](docs/search_entities.md)**
* **[Get entities](docs/get_entities.md)**
  * [By ids](docs/get_entities.md#by-ids)
  * [By Wikipedia titles](docs/get_entities.md#by-wikipedia-titles)
  * [By other Wikimedia projects titles](docs/get_entities.md#by-other-wikimedia-projects-titles)
* **[Simplify entities data](docs/simplify_entities_data.md)**
* **Advanced**
  * [Use a custom Wikibase instance](docs/use_a_custom_wikibase_instance.md)

### Wikidata Query
[Wikidata Query](http://query.wikidata.org/) allows to extract all sorts of data from Wikidata by walking the graph of entities using [SPARQL](https://en.wikipedia.org/wiki/SPARQL). SPARQL can be a weird thing at first, but the Wikidata team and community really puts lots of efforts to make things easy with a super rich [Wikidata Query Help](https://www.wikidata.org/wiki/Wikidata:SPARQL_query_service/Wikidata_Query_Help) page, [an awesome tool to test you queries and visualize the result](https://query.wikidata.org/), and [lots of examples](https://www.wikidata.org/wiki/Special:MyLanguage/Wikidata:SPARQL_query_service/queries/examples)!

* **[Get JSON from a SPARQL query](docs/sparql_query.md)**
* **[Simplify results](docs/simplify_sparql_results.md)**
* **Pre-baked queries**
  * [Get entities reverse claims](docs/get_entities_reverse_claims.md)

### General helpers
  * **[Work with ids](docs/general_helpers.md#work-with-ids)**
  * **[Wikidata Time converters](docs/general_helpers.md#wikidata-time-converters)**

## Contributing
**Context**

This library had for primary purpose to serve the needs of the [inventaire](https://github.com/inventaire/inventaire) project but extending its capabilities to other needs it totally possible: feel welcome to post your suggestions as issues or pull requests!

**Design constraints**

* `wikidata-sdk` should stay "small" and dependency-free, so that a web application can include it in its bundle without paying a too high cost for it. A consequence is that the lib generates URLs where other libs would integrate doing the request and parsing it's response. But that actually feels quite right to do this way: simply generating the URLs let's users free to handle requests as they like (with callbacks, promises, async/await, whatever!)
* Therefore, it should focus on providing basic, general helper functions most application working with Wikidata would need.
* Edition operations should go into [wikidata-edit](https://github.com/maxlath/wikidata-edit) as it involves working with Wikidata credentials/tokens.
* General command-line interface tools should go to [wikidata-cli](https://github.com/maxlath/wikidata-cli), very specific ones — [`wikidata-filter`, `import-wikidata-dump-to-couchdb`, and alikes](#see-also) — should get their own modules.

## Donate
We are developing and maintaining tools to work with Wikidata from NodeJS, the browser, or simply the command line, with quality and ease of use at heart. Any donation will be interpreted as a "please keep going, your work is very much needed and awesome. PS: love". [Donate](https://liberapay.com/WikidataJS)

## See Also
* [wikidata-edit](https://github.com/maxlath/wikidata-edit): Edit Wikidata from NodeJS
* [wikidata-cli](https://github.com/maxlath/wikidata-cli): The command-line interface to Wikidata
* [wikidata-filter](https://github.com/maxlath/wikidata-filter): A command-line tool to filter a Wikidata dump by claim
* [wikidata-subset-search-engine](https://github.com/inventaire/wikidata-subset-search-engine): Tools to setup an ElasticSearch instance fed with subsets of Wikidata
* [wikidata-taxonomy](https://github.com/nichtich/wikidata-taxonomy): Command-line tool to extract taxonomies from Wikidata
* [import-wikidata-dump-to-couchdb](https://github.com/maxlath/import-wikidata-dump-to-couchdb): Import a subset or a full Wikidata dump into a CouchDB database
* [Other Wikidata external tools](https://www.wikidata.org/wiki/Wikidata:Tools/External_tools):

## You may also like

[![inventaire banner](https://inventaire.io/public/images/inventaire-brittanystevens-13947832357-CC-BY-lighter-blue-4-banner-500px.png)](https://inventaire.io)

Do you know [inventaire.io](https://inventaire.io/)? It's a web app to share books with your friends, built on top of Wikidata! And its [libre software](http://github.com/inventaire/inventaire) too.

## License
[MIT](LICENSE.md)
