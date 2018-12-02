Changelog
-----

#### 1.4.0
* Added support for optional OR searches (documents matching only some of the search tokens) ([@ dlebech](https://github.com/  dlebech) - [#19](https://github.com/bvaughn/js-worker-search/pull/19))

#### 1.3.0
* Added `terminate` method to enable library users to kill the web worker ([@LrsK](https://github.com/LrsK) - [#15](https://github.com/bvaughn/js-worker-search/pull/15))

#### 1.2.1
Worker `onerror` method properly handles undefined `event.data` for errors during eg `indexDocument`. (This avoids causing a secondary error, as reported in [bvaughn/redux-search/issues/69)](https://github.com/bvaughn/redux-search/issues/69).)

#### 1.2.0
Added support for custom tokenizer patterns and case-sensitive search.

```js
// Case-sensitive exact word search with custom tokenizer RegExp
// to include all non alphanumerics as delimeters
// ex: searching "Swift" will match "Thomas Swift" and "Thomas (Swift)" but not "the swift dog"
const searchApi = new SearchApi({
    indexMode: INDEX_MODES.EXACT_WORDS,
    tokenizePattern: /[^a-z0-9]+/,
    caseSensitive: true
})
```

#### 1.1.1
* 🐛 Replaced `for..of` with `forEach` in order to support IE 11. ([@jrubins](https://github.com/jrubins) - [#6](https://github.com/bvaughn/js-worker-search/pull/6))

#### 1.1.0
Added support for custom index strategies.
By default, a prefix matching strategy is still used but it can be overridden like so:

```js
import SearchApi, { INDEX_MODES } from 'js-worker-search'

// all-substrings match by default; same as current
// eg "c", "ca", "a", "at", "cat" match "cat"
const searchApi = new SearchApi()

// prefix matching (eg "c", "ca", "cat" match "cat")
const searchApi = new SearchApi({
  indexMode: INDEX_MODES.PREFIXES
})

// exact words matching (eg only "cat" matches "cat")
const searchApi = new SearchApi({
  indexMode: INDEX_MODES.EXACT_WORDS
})
```

#### 1.0.2
Wrapped `String.prototype.charAt` usage in a `try/catch` to avoid erroring when handling surrogate halves.
In the context of a web-worker, non-BMP characters seem to cause Chrome 49.0 to crash.

#### 1.0.1
Bound indexSearch and search methods to prevent them from losing context when passed around.

# 1.0.0
Initial release; forked from [redux-search](https://github.com/treasure-data/redux-search).
