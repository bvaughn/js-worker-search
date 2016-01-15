js-worker-search
-----

![NPM version](https://img.shields.io/npm/v/js-worker-search.svg)
![NPM license](https://img.shields.io/npm/l/js-worker-search.svg)
![NPM total downloads](https://img.shields.io/npm/dt/js-worker-search.svg)
![NPM monthly downloads](https://img.shields.io/npm/dm/js-worker-search.svg)

Full text client-side search based on [js-search](https://github.com/bvaughn/js-search) but with added web-worker support for better performance.

Check out the [redux-search](http://treasure-data.github.io/redux-search/) for an example integration.

Or install it yourself with NPM:

```
npm install --save js-worker-search
```

SearchApi Documentation
------

Forked from [JS search](github.com/bvaughn/js-search), this utility builds a search index and runs actual searches. It auto-detects the capabilities of the current environment (browser or Node) and uses a web-worker based implementation when possible. When no web-worker support is available searching is done on the main (UI) thread.

SearchApi defines the following public methods:

##### `indexDocument (uid, text)`
Adds or updates a uid in the search index and associates it with the specified text. Note that at this time uids can only be added or updated in the index, not removed.

Parameters:
* **uid**: Uniquely identifies a searchable object
* **text**: Searchable text to associate with the uid

##### `search(query)`
Searches the current index for the specified query text. Only uids matching all of the words within the text will be accepted. If an empty query string is provided all indexed uids will be returned.

Document searches are case-insensitive (e.g. "search" will match "Search"). Document searches use substring matching (e.g. "na" and "me" will both match "name").

Parameters:
* **query**: Searchable query text

This method will return an array of uids.

Example Usage
------

Use the API like so:

```javascript
import SearchApi from 'js-worker-search'

const searchApi = new SearchApi()

// Index as many objects as you want.
// Objects are identified by an id (the first parameter).
// Each Object can be indexed multiple times (once per string of related text).
searchApi.indexDocument('foo', 'Text describing an Object identified as "foo"')
searchApi.indexDocument('bar', 'Text describing an Object identified as "bar"')

// Search for matching documents using the `search` method.
// In this case the promise will be resolved with the Array ['foo', 'bar'].
// This is because the word "describing" appears in both indices.
const promise = searchApi.search('describing')
```

Changelog
---------

Changes are tracked in the [changelog](CHANGELOG.md).

License
---------

js-worker-search is available under the MIT License.
