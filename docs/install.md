# Installation

## Summary

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [via NPM](#via-npm)
- [via Bower](#via-bower)
- [The Old Way](#the-old-way)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## via NPM
in a terminal at your project root:

```sh
npm install wikidata-sdk --save
```

then in your javascript project:
```js
const wdk = require('wikidata-sdk')
```

## via Bower
in a terminal at your project root:
```sh
bower install wikidata-sdk --save
```

then, in your project, include either
```
/bower_components/wikidata-sdk/dist/wikidata-sdk.js
```
or use the minified version
```
/bower_components/wikidata-sdk/dist/wikidata-sdk.min.js
```

this will create a global object named `wdk` (in a browser, accessible at `window.wdk`)

## The Old Way

Just download the raw package from this repository:
```sh
cd /path/to/project
wget https://raw.githubusercontent.com/maxlath/wikidata-sdk/master/dist/wikidata-sdk.js
```
and then in your HTML:
```html
<script src="/wikidata-sdk.min.js"></script>
```
This will create a global object named `wdk`.

**Tip**: to work, this requires having a file server running at your project's root.
The simplest form of such a server can be:
```sh
cd /path/to/project
python -m SimpleHTTPServer
```
or, if you have NodeJS and NPM installed, you can use the awesome [live-server](https://github.com/tapio/live-server)
