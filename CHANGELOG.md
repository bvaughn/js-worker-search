Changelog
-----

#### 1.0.2
Wrapped `String.prototype.charAt` usage in a `try/catch` to avoid erroring when handling surrogate halves.
In the context of a web-worker, non-BMP characters seem to cause Chrome 49.0 to crash.

#### 1.0.1
Bound indexSearch and search methods to prevent them from losing context when passed around.

# 1.0.0
Initial release; forked from [redux-search](https://github.com/treasure-data/redux-search).
