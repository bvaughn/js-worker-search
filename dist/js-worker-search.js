module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = undefined;
	
	var _SearchApi = __webpack_require__(2);
	
	var _SearchApi2 = _interopRequireDefault(_SearchApi);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = _SearchApi2.default;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _util = __webpack_require__(3);
	
	var _util2 = _interopRequireDefault(_util);
	
	var _worker = __webpack_require__(6);
	
	var _worker2 = _interopRequireDefault(_worker);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * Search API that uses web workers when available.
	 * Indexing and searching is performed in the UI thread as a fallback when web workers aren't supported.
	 */
	
	var SearchApi = function () {
	  function SearchApi() {
	    _classCallCheck(this, SearchApi);
	
	    // Based on https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers
	    // But with added check for Node environment
	    if (typeof window !== 'undefined' && window.Worker) {
	      this._search = new _worker2.default();
	    } else {
	      this._search = new _util2.default();
	    }
	
	    // Prevent methods from losing context when passed around.
	    this.indexDocument = this.indexDocument.bind(this);
	
	    if (!(typeof this.indexDocument === 'function')) {
	      throw new TypeError('Value of "this.indexDocument" violates contract.\n\nExpected:\n(any, string) => SearchApi\n\nGot:\n' + _inspect(this.indexDocument));
	    }
	
	    this.search = this.search.bind(this);
	
	    if (!(typeof this.search === 'function')) {
	      throw new TypeError('Value of "this.search" violates contract.\n\nExpected:\n(string) => Promise\n\nGot:\n' + _inspect(this.search));
	    }
	  }
	
	  /**
	   * Adds or updates a uid in the search index and associates it with the specified text.
	   * Note that at this time uids can only be added or updated in the index, not removed.
	   *
	   * @param uid Uniquely identifies a searchable object
	   * @param text Text to associate with uid
	   */
	
	  _createClass(SearchApi, [{
	    key: 'indexDocument',
	    value: function indexDocument(uid, text) {
	      function _ref(_id) {
	        if (!(_id instanceof SearchApi)) {
	          throw new TypeError('Function return value violates contract.\n\nExpected:\nSearchApi\n\nGot:\n' + _inspect(_id));
	        }
	
	        return _id;
	      }
	
	      if (!(typeof text === 'string')) {
	        throw new TypeError('Value of argument "text" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(text));
	      }
	
	      this._search.indexDocument(uid, text);
	
	      return _ref(this);
	    }
	
	    /**
	     * Searches the current index for the specified query text.
	     * Only uids matching all of the words within the text will be accepted.
	     * If an empty query string is provided all indexed uids will be returned.
	     *
	     * Document searches are case-insensitive (e.g. "search" will match "Search").
	     * Document searches use substring matching (e.g. "na" and "me" will both match "name").
	     *
	     * @param query Searchable query text
	     * @return Promise to be resolved with an Array of matching uids
	     */
	
	  }, {
	    key: 'search',
	    value: function search(query) {
	      function _ref2(_id2) {
	        if (!(_id2 instanceof Promise)) {
	          throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise\n\nGot:\n' + _inspect(_id2));
	        }
	
	        return _id2;
	      }
	
	      if (!(typeof query === 'string')) {
	        throw new TypeError('Value of argument "query" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(query));
	      }
	
	      // Promise.resolve handles both synchronous and web-worker Search utilities
	      return _ref2(Promise.resolve(this._search.search(query)));
	    }
	  }]);
	
	  return SearchApi;
	}();
	
	exports.default = SearchApi;
	
	function _inspect(input) {
	  if (input === null) {
	    return 'null';
	  } else if (input === undefined) {
	    return 'void';
	  } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
	    return typeof input === 'undefined' ? 'undefined' : _typeof(input);
	  } else if (Array.isArray(input)) {
	    if (input.length > 0) {
	      var first = _inspect(input[0]);

	      if (input.every(function (item) {
	        return _inspect(item) === first;
	      })) {
	        return first.trim() + '[]';
	      } else {
	        return '[' + input.map(_inspect).join(', ') + ']';
	      }
	    } else {
	      return 'Array';
	    }
	  } else {
	    var keys = Object.keys(input);

	    if (!keys.length) {
	      if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
	        return input.constructor.name;
	      } else {
	        return 'Object';
	      }
	    }

	    var entries = keys.map(function (key) {
	      return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key]) + ';';
	    }).join('\n  ');

	    if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
	      return input.constructor.name + ' {\n  ' + entries + '\n}';
	    } else {
	      return '{ ' + entries + '\n}';
	    }
	  }
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = undefined;
	
	var _SearchUtility = __webpack_require__(4);
	
	var _SearchUtility2 = _interopRequireDefault(_SearchUtility);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = _SearchUtility2.default;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _SearchIndex = __webpack_require__(5);
	
	var _SearchIndex2 = _interopRequireDefault(_SearchIndex);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * Synchronous client-side full-text search utility.
	 * Forked from JS search (github.com/bvaughn/js-search).
	 */
	
	var SearchUtility = function () {
	
	  /**
	   * Constructor.
	   */
	
	  function SearchUtility() {
	    _classCallCheck(this, SearchUtility);
	
	    this.searchIndex = new _SearchIndex2.default();
	    this.uids = {};
	  }
	
	  /**
	   * Adds or updates a uid in the search index and associates it with the specified text.
	   * Note that at this time uids can only be added or updated in the index, not removed.
	   *
	   * @param uid Uniquely identifies a searchable object
	   * @param text Text to associate with uid
	   */
	
	  _createClass(SearchUtility, [{
	    key: 'indexDocument',
	    value: function indexDocument(uid, text) {
	      var _this = this;
	
	      function _ref(_id) {
	        if (!(_id instanceof SearchUtility)) {
	          throw new TypeError('Function return value violates contract.\n\nExpected:\nSearchUtility\n\nGot:\n' + _inspect(_id));
	        }
	
	        return _id;
	      }
	
	      if (!(typeof text === 'string')) {
	        throw new TypeError('Value of argument "text" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(text));
	      }
	
	      this.uids[uid] = true;
	
	      var fieldTokens = this._tokenize(this._sanitize(text));
	
	      if (!(Array.isArray(fieldTokens) && fieldTokens.every(function (item) {
	        return typeof item === 'string';
	      }))) {
	        throw new TypeError('Value of variable "fieldTokens" violates contract.\n\nExpected:\nArray<string>\n\nGot:\n' + _inspect(fieldTokens));
	      }
	
	      fieldTokens.forEach(function (fieldToken) {
	        var expandedTokens = _this._expandToken(fieldToken);
	
	        if (!(Array.isArray(expandedTokens) && expandedTokens.every(function (item) {
	          return typeof item === 'string';
	        }))) {
	          throw new TypeError('Value of variable "expandedTokens" violates contract.\n\nExpected:\nArray<string>\n\nGot:\n' + _inspect(expandedTokens));
	        }
	
	        expandedTokens.forEach(function (expandedToken) {
	          return _this.searchIndex.indexDocument(expandedToken, uid);
	        });
	      });
	
	      return _ref(this);
	    }
	
	    /**
	     * Searches the current index for the specified query text.
	     * Only uids matching all of the words within the text will be accepted.
	     * If an empty query string is provided all indexed uids will be returned.
	     *
	     * Document searches are case-insensitive (e.g. "search" will match "Search").
	     * Document searches use substring matching (e.g. "na" and "me" will both match "name").
	     *
	     * @param query Searchable query text
	     * @return Array of uids
	     */
	
	  }, {
	    key: 'search',
	    value: function search(query) {
	      function _ref2(_id2) {
	        if (!Array.isArray(_id2)) {
	          throw new TypeError('Function return value violates contract.\n\nExpected:\nArray<any>\n\nGot:\n' + _inspect(_id2));
	        }
	
	        return _id2;
	      }
	
	      if (!(typeof query === 'string')) {
	        throw new TypeError('Value of argument "query" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(query));
	      }
	
	      if (!query) {
	        return _ref2(Object.keys(this.uids));
	      } else {
	        var tokens = this._tokenize(this._sanitize(query));
	
	        if (!(Array.isArray(tokens) && tokens.every(function (item) {
	          return typeof item === 'string';
	        }))) {
	          throw new TypeError('Value of variable "tokens" violates contract.\n\nExpected:\nArray<string>\n\nGot:\n' + _inspect(tokens));
	        }
	
	        return _ref2(this.searchIndex.search(tokens));
	      }
	    }
	
	    /**
	     * Index strategy based on 'all-substrings-index-strategy.ts' in github.com/bvaughn/js-search/
	     *
	     * @private
	     */
	
	  }, {
	    key: '_expandToken',
	    value: function _expandToken(token) {
	      function _ref3(_id3) {
	        if (!(Array.isArray(_id3) && _id3.every(function (item) {
	          return typeof item === 'string';
	        }))) {
	          throw new TypeError('Function return value violates contract.\n\nExpected:\nArray<string>\n\nGot:\n' + _inspect(_id3));
	        }
	
	        return _id3;
	      }
	
	      if (!(typeof token === 'string')) {
	        throw new TypeError('Value of argument "token" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(token));
	      }
	
	      var expandedTokens = [];
	
	      // String.prototype.charAt() may return surrogate halves instead of whole characters.
	      // When this happens in the context of a web-worker it can cause Chrome to crash.
	      // Catching the error is a simple solution for now; in the future I may try to better support non-BMP characters.
	      // Resources:
	      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charAt
	      // https://mathiasbynens.be/notes/javascript-unicode
	      try {
	        for (var i = 0, length = token.length; i < length; ++i) {
	          var prefixString = '';
	
	          for (var j = i; j < length; ++j) {
	            prefixString += token.charAt(j);
	
	            if (!(typeof prefixString === 'string')) {
	              throw new TypeError('Value of variable "prefixString" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(prefixString));
	            }
	
	            expandedTokens.push(prefixString);
	          }
	        }
	      } catch (error) {
	        console.error('Unable to parse token "' + token + '" ' + error);
	      }
	
	      return _ref3(expandedTokens);
	    }
	
	    /**
	     * @private
	     */
	
	  }, {
	    key: '_sanitize',
	    value: function _sanitize(string) {
	      function _ref4(_id4) {
	        if (!(typeof _id4 === 'string')) {
	          throw new TypeError('Function return value violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(_id4));
	        }
	
	        return _id4;
	      }
	
	      if (!(typeof string === 'string')) {
	        throw new TypeError('Value of argument "string" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(string));
	      }
	
	      return _ref4(string.trim().toLocaleLowerCase());
	    }
	
	    /**
	     * @private
	     */
	
	  }, {
	    key: '_tokenize',
	    value: function _tokenize(text) {
	      function _ref5(_id5) {
	        if (!(Array.isArray(_id5) && _id5.every(function (item) {
	          return typeof item === 'string';
	        }))) {
	          throw new TypeError('Function return value violates contract.\n\nExpected:\nArray<string>\n\nGot:\n' + _inspect(_id5));
	        }
	
	        return _id5;
	      }
	
	      if (!(typeof text === 'string')) {
	        throw new TypeError('Value of argument "text" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(text));
	      }
	
	      return _ref5(text.split(/\s+/).filter(function (text) {
	        return text;
	      })); // Remove empty tokens
	    }
	  }]);
	
	  return SearchUtility;
	}();
	
	exports.default = SearchUtility;
	
	function _inspect(input) {
	  if (input === null) {
	    return 'null';
	  } else if (input === undefined) {
	    return 'void';
	  } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
	    return typeof input === 'undefined' ? 'undefined' : _typeof(input);
	  } else if (Array.isArray(input)) {
	    if (input.length > 0) {
	      var first = _inspect(input[0]);

	      if (input.every(function (item) {
	        return _inspect(item) === first;
	      })) {
	        return first.trim() + '[]';
	      } else {
	        return '[' + input.map(_inspect).join(', ') + ']';
	      }
	    } else {
	      return 'Array';
	    }
	  } else {
	    var keys = Object.keys(input);

	    if (!keys.length) {
	      if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
	        return input.constructor.name;
	      } else {
	        return 'Object';
	      }
	    }

	    var entries = keys.map(function (key) {
	      return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key]) + ';';
	    }).join('\n  ');

	    if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
	      return input.constructor.name + ' {\n  ' + entries + '\n}';
	    } else {
	      return '{ ' + entries + '\n}';
	    }
	  }
	}

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * Maps search tokens to uids.
	 * This structure is used by the Search class to optimize search operations.
	 * Forked from JS search (github.com/bvaughn/js-search).
	 */
	
	var SearchIndex = function () {
	  function SearchIndex() {
	    _classCallCheck(this, SearchIndex);
	
	    this.tokenToUidMap = {};
	  }
	
	  /**
	   * Maps the specified token to a uid.
	   *
	   * @param token Searchable token (e.g. "road")
	   * @param uid Identifies a document within the searchable corpus
	   */
	
	  _createClass(SearchIndex, [{
	    key: "indexDocument",
	    value: function indexDocument(token, uid) {
	      if (!(typeof token === 'string')) {
	        throw new TypeError("Value of argument \"token\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(token));
	      }
	
	      if (!this.tokenToUidMap[token]) {
	        this.tokenToUidMap[token] = {};
	      }
	
	      this.tokenToUidMap[token][uid] = uid;
	    }
	
	    /**
	     * Finds uids that have been mapped to the set of tokens specified.
	     * Only uids that have been mapped to all tokens will be returned.
	     *
	     * @param tokens Array of searchable tokens (e.g. ["long", "road"])
	     * @return Array of uids that have been associated with the set of search tokens
	     */
	
	  }, {
	    key: "search",
	    value: function search(tokens) {
	      var _this = this;
	
	      function _ref2(_id2) {
	        if (!Array.isArray(_id2)) {
	          throw new TypeError("Function return value violates contract.\n\nExpected:\nArray<any>\n\nGot:\n" + _inspect(_id2));
	        }
	
	        return _id2;
	      }
	
	      if (!(Array.isArray(tokens) && tokens.every(function (item) {
	        return typeof item === 'string';
	      }))) {
	        throw new TypeError("Value of argument \"tokens\" violates contract.\n\nExpected:\nArray<string>\n\nGot:\n" + _inspect(tokens));
	      }
	
	      var uidMap = {};
	
	      if (!(uidMap != null && (typeof uidMap === "undefined" ? "undefined" : _typeof(uidMap)) === 'object')) {
	        throw new TypeError("Value of variable \"uidMap\" violates contract.\n\nExpected:\n{ [uid: any]: any\n}\n\nGot:\n" + _inspect(uidMap));
	      }
	
	      var initialized = false;
	
	      tokens.forEach(function (token) {
	        var currentUidMap = _this.tokenToUidMap[token] || {};
	
	        if (!(currentUidMap != null && (typeof currentUidMap === "undefined" ? "undefined" : _typeof(currentUidMap)) === 'object')) {
	          throw new TypeError("Value of variable \"currentUidMap\" violates contract.\n\nExpected:\n{ [uid: any]: any\n}\n\nGot:\n" + _inspect(currentUidMap));
	        }
	
	        if (!initialized) {
	          initialized = true;
	
	          for (var _uid in currentUidMap) {
	            uidMap[_uid] = currentUidMap[_uid];
	          }
	        } else {
	          for (var _uid2 in uidMap) {
	            if (!currentUidMap[_uid2]) {
	              delete uidMap[_uid2];
	            }
	          }
	        }
	      });
	
	      var uids = [];
	
	      if (!Array.isArray(uids)) {
	        throw new TypeError("Value of variable \"uids\" violates contract.\n\nExpected:\nArray<any>\n\nGot:\n" + _inspect(uids));
	      }
	
	      for (var _uid3 in uidMap) {
	        uids.push(uidMap[_uid3]);
	      }
	
	      return _ref2(uids);
	    }
	  }]);
	
	  return SearchIndex;
	}();
	
	exports.default = SearchIndex;
	
	function _inspect(input) {
	  if (input === null) {
	    return 'null';
	  } else if (input === undefined) {
	    return 'void';
	  } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
	    return typeof input === "undefined" ? "undefined" : _typeof(input);
	  } else if (Array.isArray(input)) {
	    if (input.length > 0) {
	      var first = _inspect(input[0]);

	      if (input.every(function (item) {
	        return _inspect(item) === first;
	      })) {
	        return first.trim() + '[]';
	      } else {
	        return '[' + input.map(_inspect).join(', ') + ']';
	      }
	    } else {
	      return 'Array';
	    }
	  } else {
	    var keys = Object.keys(input);

	    if (!keys.length) {
	      if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
	        return input.constructor.name;
	      } else {
	        return 'Object';
	      }
	    }

	    var entries = keys.map(function (key) {
	      return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key]) + ';';
	    }).join('\n  ');

	    if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
	      return input.constructor.name + ' {\n  ' + entries + '\n}';
	    } else {
	      return '{ ' + entries + '\n}';
	    }
	  }
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = undefined;
	
	var _SearchWorkerLoader = __webpack_require__(7);
	
	var _SearchWorkerLoader2 = _interopRequireDefault(_SearchWorkerLoader);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = _SearchWorkerLoader2.default;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _uuid = __webpack_require__(8);
	
	var _uuid2 = _interopRequireDefault(_uuid);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * Client side, full text search utility.
	 * This interface exposes web worker search capabilities to the UI thread.
	 */
	
	var SearchWorkerLoader = function () {
	
	  /**
	   * Constructor.
	   */
	
	  function SearchWorkerLoader(WorkerClass) {
	    var _this = this;
	
	    _classCallCheck(this, SearchWorkerLoader);
	
	    // Defer worker import until construction to avoid testing error:
	    // Error: Cannot find module 'worker!./[workername]'
	    if (!WorkerClass) {
	      WorkerClass = __webpack_require__(10);
	    }
	
	    // Maintain context if references are passed around
	    this.indexDocument = this.indexDocument.bind(this);
	
	    if (!(typeof this.indexDocument === 'function')) {
	      throw new TypeError('Value of "this.indexDocument" violates contract.\n\nExpected:\n(any, string) => SearchWorkerLoader\n\nGot:\n' + _inspect(this.indexDocument));
	    }
	
	    this.search = this.search.bind(this);
	
	    if (!(typeof this.search === 'function')) {
	      throw new TypeError('Value of "this.search" violates contract.\n\nExpected:\n(string) => Promise\n\nGot:\n' + _inspect(this.search));
	    }
	
	    this.callbackQueue = [];
	    this.callbackIdMap = {};
	
	    this.worker = new WorkerClass();
	    this.worker.onerror = function (event) {
	      var _event$data = event.data;
	      var callbackId = _event$data.callbackId;
	      var error = _event$data.error;
	
	      _this._updateQueue({ callbackId: callbackId, error: error });
	    };
	    this.worker.onmessage = function (event) {
	      var _event$data2 = event.data;
	      var callbackId = _event$data2.callbackId;
	      var results = _event$data2.results;
	
	      _this._updateQueue({ callbackId: callbackId, results: results });
	    };
	  }
	
	  /**
	   * Adds or updates a uid in the search index and associates it with the specified text.
	   * Note that at this time uids can only be added or updated in the index, not removed.
	   *
	   * @param uid Uniquely identifies a searchable object
	   * @param text Text to associate with uid
	   */
	
	  _createClass(SearchWorkerLoader, [{
	    key: 'indexDocument',
	    value: function indexDocument(uid, text) {
	      function _ref(_id) {
	        if (!(_id instanceof SearchWorkerLoader)) {
	          throw new TypeError('Function return value violates contract.\n\nExpected:\nSearchWorkerLoader\n\nGot:\n' + _inspect(_id));
	        }
	
	        return _id;
	      }
	
	      if (!(typeof text === 'string')) {
	        throw new TypeError('Value of argument "text" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(text));
	      }
	
	      this.worker.postMessage({
	        method: 'indexDocument',
	        text: text,
	        uid: uid
	      });
	
	      return _ref(this);
	    }
	
	    /**
	     * Searches the current index for the specified query text.
	     * Only uids matching all of the words within the text will be accepted.
	     * If an empty query string is provided all indexed uids will be returned.
	     *
	     * Document searches are case-insensitive (e.g. "search" will match "Search").
	     * Document searches use substring matching (e.g. "na" and "me" will both match "name").
	     *
	     * @param query Searchable query text
	     * @return Promise to be resolved with an array of uids
	     */
	
	  }, {
	    key: 'search',
	    value: function search(query) {
	      var _this2 = this;
	
	      if (!(typeof query === 'string')) {
	        throw new TypeError('Value of argument "query" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(query));
	      }
	
	      return new Promise(function (resolve, reject) {
	        var callbackId = _uuid2.default.v4();
	        var data = { callbackId: callbackId, reject: reject, resolve: resolve };
	
	        _this2.worker.postMessage({
	          method: 'search',
	          query: query,
	          callbackId: callbackId
	        });
	
	        _this2.callbackQueue.push(data);
	        _this2.callbackIdMap[callbackId] = data;
	      });
	    }
	
	    /**
	     * Updates the queue and flushes any completed promises that are ready.
	     */
	
	  }, {
	    key: '_updateQueue',
	    value: function _updateQueue(_ref3) {
	      var callbackId = _ref3.callbackId;
	      var error = _ref3.error;
	      var results = _ref3.results;
	
	      var target = this.callbackIdMap[callbackId];
	      target.complete = true;
	      target.error = error;
	      target.results = results;
	
	      while (this.callbackQueue.length) {
	        var data = this.callbackQueue[0];
	
	        if (!data.complete) {
	          break;
	        }
	
	        this.callbackQueue.shift();
	
	        delete this.callbackIdMap[data.callbackId];
	
	        if (data.error) {
	          data.reject(data.error);
	        } else {
	          data.resolve(data.results);
	        }
	      }
	    }
	  }]);
	
	  return SearchWorkerLoader;
	}();
	
	exports.default = SearchWorkerLoader;
	
	function _inspect(input) {
	  if (input === null) {
	    return 'null';
	  } else if (input === undefined) {
	    return 'void';
	  } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
	    return typeof input === 'undefined' ? 'undefined' : _typeof(input);
	  } else if (Array.isArray(input)) {
	    if (input.length > 0) {
	      var first = _inspect(input[0]);

	      if (input.every(function (item) {
	        return _inspect(item) === first;
	      })) {
	        return first.trim() + '[]';
	      } else {
	        return '[' + input.map(_inspect).join(', ') + ']';
	      }
	    } else {
	      return 'Array';
	    }
	  } else {
	    var keys = Object.keys(input);

	    if (!keys.length) {
	      if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
	        return input.constructor.name;
	      } else {
	        return 'Object';
	      }
	    }

	    var entries = keys.map(function (key) {
	      return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key]) + ';';
	    }).join('\n  ');

	    if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
	      return input.constructor.name + ' {\n  ' + entries + '\n}';
	    } else {
	      return '{ ' + entries + '\n}';
	    }
	  }
	}

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	//     uuid.js
	//
	//     Copyright (c) 2010-2012 Robert Kieffer
	//     MIT License - http://opensource.org/licenses/mit-license.php
	
	// Unique ID creation requires a high quality random # generator.  We feature
	// detect to determine the best RNG source, normalizing to a function that
	// returns 128-bits of randomness, since that's what's usually required
	var _rng = __webpack_require__(9);
	
	// Maps for number <-> hex string conversion
	var _byteToHex = [];
	var _hexToByte = {};
	for (var i = 0; i < 256; i++) {
	  _byteToHex[i] = (i + 0x100).toString(16).substr(1);
	  _hexToByte[_byteToHex[i]] = i;
	}
	
	// **`parse()` - Parse a UUID into it's component bytes**
	function parse(s, buf, offset) {
	  var i = (buf && offset) || 0, ii = 0;
	
	  buf = buf || [];
	  s.toLowerCase().replace(/[0-9a-f]{2}/g, function(oct) {
	    if (ii < 16) { // Don't overflow!
	      buf[i + ii++] = _hexToByte[oct];
	    }
	  });
	
	  // Zero out remaining bytes if string was short
	  while (ii < 16) {
	    buf[i + ii++] = 0;
	  }
	
	  return buf;
	}
	
	// **`unparse()` - Convert UUID byte array (ala parse()) into a string**
	function unparse(buf, offset) {
	  var i = offset || 0, bth = _byteToHex;
	  return  bth[buf[i++]] + bth[buf[i++]] +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] +
	          bth[buf[i++]] + bth[buf[i++]] +
	          bth[buf[i++]] + bth[buf[i++]];
	}
	
	// **`v1()` - Generate time-based UUID**
	//
	// Inspired by https://github.com/LiosK/UUID.js
	// and http://docs.python.org/library/uuid.html
	
	// random #'s we need to init node and clockseq
	var _seedBytes = _rng();
	
	// Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
	var _nodeId = [
	  _seedBytes[0] | 0x01,
	  _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
	];
	
	// Per 4.2.2, randomize (14 bit) clockseq
	var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;
	
	// Previous uuid creation time
	var _lastMSecs = 0, _lastNSecs = 0;
	
	// See https://github.com/broofa/node-uuid for API details
	function v1(options, buf, offset) {
	  var i = buf && offset || 0;
	  var b = buf || [];
	
	  options = options || {};
	
	  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;
	
	  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
	  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
	  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
	  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
	  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();
	
	  // Per 4.2.1.2, use count of uuid's generated during the current clock
	  // cycle to simulate higher resolution clock
	  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;
	
	  // Time since last uuid creation (in msecs)
	  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;
	
	  // Per 4.2.1.2, Bump clockseq on clock regression
	  if (dt < 0 && options.clockseq === undefined) {
	    clockseq = clockseq + 1 & 0x3fff;
	  }
	
	  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
	  // time interval
	  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
	    nsecs = 0;
	  }
	
	  // Per 4.2.1.2 Throw error if too many uuids are requested
	  if (nsecs >= 10000) {
	    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
	  }
	
	  _lastMSecs = msecs;
	  _lastNSecs = nsecs;
	  _clockseq = clockseq;
	
	  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
	  msecs += 12219292800000;
	
	  // `time_low`
	  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
	  b[i++] = tl >>> 24 & 0xff;
	  b[i++] = tl >>> 16 & 0xff;
	  b[i++] = tl >>> 8 & 0xff;
	  b[i++] = tl & 0xff;
	
	  // `time_mid`
	  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
	  b[i++] = tmh >>> 8 & 0xff;
	  b[i++] = tmh & 0xff;
	
	  // `time_high_and_version`
	  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
	  b[i++] = tmh >>> 16 & 0xff;
	
	  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
	  b[i++] = clockseq >>> 8 | 0x80;
	
	  // `clock_seq_low`
	  b[i++] = clockseq & 0xff;
	
	  // `node`
	  var node = options.node || _nodeId;
	  for (var n = 0; n < 6; n++) {
	    b[i + n] = node[n];
	  }
	
	  return buf ? buf : unparse(b);
	}
	
	// **`v4()` - Generate random UUID**
	
	// See https://github.com/broofa/node-uuid for API details
	function v4(options, buf, offset) {
	  // Deprecated - 'format' argument, as supported in v1.2
	  var i = buf && offset || 0;
	
	  if (typeof(options) == 'string') {
	    buf = options == 'binary' ? new Array(16) : null;
	    options = null;
	  }
	  options = options || {};
	
	  var rnds = options.random || (options.rng || _rng)();
	
	  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
	  rnds[6] = (rnds[6] & 0x0f) | 0x40;
	  rnds[8] = (rnds[8] & 0x3f) | 0x80;
	
	  // Copy bytes to buffer, if provided
	  if (buf) {
	    for (var ii = 0; ii < 16; ii++) {
	      buf[i + ii] = rnds[ii];
	    }
	  }
	
	  return buf || unparse(rnds);
	}
	
	// Export public API
	var uuid = v4;
	uuid.v1 = v1;
	uuid.v4 = v4;
	uuid.parse = parse;
	uuid.unparse = unparse;
	
	module.exports = uuid;


/***/ },
/* 9 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {
	var rng;
	
	if (global.crypto && crypto.getRandomValues) {
	  // WHATWG crypto-based RNG - http://wiki.whatwg.org/wiki/Crypto
	  // Moderately fast, high quality
	  var _rnds8 = new Uint8Array(16);
	  rng = function whatwgRNG() {
	    crypto.getRandomValues(_rnds8);
	    return _rnds8;
	  };
	}
	
	if (!rng) {
	  // Math.random()-based (RNG)
	  //
	  // If all else fails, use Math.random().  It's fast, but is of unspecified
	  // quality.
	  var  _rnds = new Array(16);
	  rng = function() {
	    for (var i = 0, r; i < 16; i++) {
	      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
	      _rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
	    }
	
	    return _rnds;
	  };
	}
	
	module.exports = rng;
	
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function() {
		return __webpack_require__(11)("/******/ (function(modules) { // webpackBootstrap\n/******/ \t// The module cache\n/******/ \tvar installedModules = {};\n/******/\n/******/ \t// The require function\n/******/ \tfunction __webpack_require__(moduleId) {\n/******/\n/******/ \t\t// Check if module is in cache\n/******/ \t\tif(installedModules[moduleId])\n/******/ \t\t\treturn installedModules[moduleId].exports;\n/******/\n/******/ \t\t// Create a new module (and put it into the cache)\n/******/ \t\tvar module = installedModules[moduleId] = {\n/******/ \t\t\texports: {},\n/******/ \t\t\tid: moduleId,\n/******/ \t\t\tloaded: false\n/******/ \t\t};\n/******/\n/******/ \t\t// Execute the module function\n/******/ \t\tmodules[moduleId].call(module.exports, module, module.exports, __webpack_require__);\n/******/\n/******/ \t\t// Flag the module as loaded\n/******/ \t\tmodule.loaded = true;\n/******/\n/******/ \t\t// Return the exports of the module\n/******/ \t\treturn module.exports;\n/******/ \t}\n/******/\n/******/\n/******/ \t// expose the modules object (__webpack_modules__)\n/******/ \t__webpack_require__.m = modules;\n/******/\n/******/ \t// expose the module cache\n/******/ \t__webpack_require__.c = installedModules;\n/******/\n/******/ \t// __webpack_public_path__\n/******/ \t__webpack_require__.p = \"\";\n/******/\n/******/ \t// Load entry module and return exports\n/******/ \treturn __webpack_require__(0);\n/******/ })\n/************************************************************************/\n/******/ ([\n/* 0 */\n/***/ function(module, exports, __webpack_require__) {\n\n\t'use strict';\n\t\n\tvar _util = __webpack_require__(1);\n\t\n\tvar _util2 = _interopRequireDefault(_util);\n\t\n\tfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\t\n\t/**\n\t * Search entry point to web worker.\n\t * Builds search index and performs searches on separate thread from the ui.\n\t */\n\t\n\tvar searchUtility = new _util2.default();\n\t\n\tself.addEventListener('message', function (event) {\n\t  var data = event.data;\n\t  var method = data.method;\n\t\n\t  switch (method) {\n\t    case 'indexDocument':\n\t      var uid = data.uid;\n\t      var text = data.text;\n\t\n\t      searchUtility.indexDocument(uid, text);\n\t      break;\n\t    case 'search':\n\t      var callbackId = data.callbackId;\n\t      var query = data.query;\n\t\n\t      var results = searchUtility.search(query);\n\t\n\t      self.postMessage({ callbackId: callbackId, results: results });\n\t      break;\n\t  }\n\t}, false);\n\n/***/ },\n/* 1 */\n/***/ function(module, exports, __webpack_require__) {\n\n\t'use strict';\n\t\n\tObject.defineProperty(exports, \"__esModule\", {\n\t  value: true\n\t});\n\texports.default = undefined;\n\t\n\tvar _SearchUtility = __webpack_require__(2);\n\t\n\tvar _SearchUtility2 = _interopRequireDefault(_SearchUtility);\n\t\n\tfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\t\n\texports.default = _SearchUtility2.default;\n\n/***/ },\n/* 2 */\n/***/ function(module, exports, __webpack_require__) {\n\n\t'use strict';\n\t\n\tvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol ? \"symbol\" : typeof obj; };\n\t\n\tvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\t\n\tObject.defineProperty(exports, \"__esModule\", {\n\t  value: true\n\t});\n\t\n\tvar _SearchIndex = __webpack_require__(3);\n\t\n\tvar _SearchIndex2 = _interopRequireDefault(_SearchIndex);\n\t\n\tfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\t\n\tfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\t\n\t/**\n\t * Synchronous client-side full-text search utility.\n\t * Forked from JS search (github.com/bvaughn/js-search).\n\t */\n\t\n\tvar SearchUtility = function () {\n\t\n\t  /**\n\t   * Constructor.\n\t   */\n\t\n\t  function SearchUtility() {\n\t    _classCallCheck(this, SearchUtility);\n\t\n\t    this.searchIndex = new _SearchIndex2.default();\n\t    this.uids = {};\n\t  }\n\t\n\t  /**\n\t   * Adds or updates a uid in the search index and associates it with the specified text.\n\t   * Note that at this time uids can only be added or updated in the index, not removed.\n\t   *\n\t   * @param uid Uniquely identifies a searchable object\n\t   * @param text Text to associate with uid\n\t   */\n\t\n\t  _createClass(SearchUtility, [{\n\t    key: 'indexDocument',\n\t    value: function indexDocument(uid, text) {\n\t      var _this = this;\n\t\n\t      function _ref(_id) {\n\t        if (!(_id instanceof SearchUtility)) {\n\t          throw new TypeError('Function return value violates contract.\\n\\nExpected:\\nSearchUtility\\n\\nGot:\\n' + _inspect(_id));\n\t        }\n\t\n\t        return _id;\n\t      }\n\t\n\t      if (!(typeof text === 'string')) {\n\t        throw new TypeError('Value of argument \"text\" violates contract.\\n\\nExpected:\\nstring\\n\\nGot:\\n' + _inspect(text));\n\t      }\n\t\n\t      this.uids[uid] = true;\n\t\n\t      var fieldTokens = this._tokenize(this._sanitize(text));\n\t\n\t      if (!(Array.isArray(fieldTokens) && fieldTokens.every(function (item) {\n\t        return typeof item === 'string';\n\t      }))) {\n\t        throw new TypeError('Value of variable \"fieldTokens\" violates contract.\\n\\nExpected:\\nArray<string>\\n\\nGot:\\n' + _inspect(fieldTokens));\n\t      }\n\t\n\t      fieldTokens.forEach(function (fieldToken) {\n\t        var expandedTokens = _this._expandToken(fieldToken);\n\t\n\t        if (!(Array.isArray(expandedTokens) && expandedTokens.every(function (item) {\n\t          return typeof item === 'string';\n\t        }))) {\n\t          throw new TypeError('Value of variable \"expandedTokens\" violates contract.\\n\\nExpected:\\nArray<string>\\n\\nGot:\\n' + _inspect(expandedTokens));\n\t        }\n\t\n\t        expandedTokens.forEach(function (expandedToken) {\n\t          return _this.searchIndex.indexDocument(expandedToken, uid);\n\t        });\n\t      });\n\t\n\t      return _ref(this);\n\t    }\n\t\n\t    /**\n\t     * Searches the current index for the specified query text.\n\t     * Only uids matching all of the words within the text will be accepted.\n\t     * If an empty query string is provided all indexed uids will be returned.\n\t     *\n\t     * Document searches are case-insensitive (e.g. \"search\" will match \"Search\").\n\t     * Document searches use substring matching (e.g. \"na\" and \"me\" will both match \"name\").\n\t     *\n\t     * @param query Searchable query text\n\t     * @return Array of uids\n\t     */\n\t\n\t  }, {\n\t    key: 'search',\n\t    value: function search(query) {\n\t      function _ref2(_id2) {\n\t        if (!Array.isArray(_id2)) {\n\t          throw new TypeError('Function return value violates contract.\\n\\nExpected:\\nArray<any>\\n\\nGot:\\n' + _inspect(_id2));\n\t        }\n\t\n\t        return _id2;\n\t      }\n\t\n\t      if (!(typeof query === 'string')) {\n\t        throw new TypeError('Value of argument \"query\" violates contract.\\n\\nExpected:\\nstring\\n\\nGot:\\n' + _inspect(query));\n\t      }\n\t\n\t      if (!query) {\n\t        return _ref2(Object.keys(this.uids));\n\t      } else {\n\t        var tokens = this._tokenize(this._sanitize(query));\n\t\n\t        if (!(Array.isArray(tokens) && tokens.every(function (item) {\n\t          return typeof item === 'string';\n\t        }))) {\n\t          throw new TypeError('Value of variable \"tokens\" violates contract.\\n\\nExpected:\\nArray<string>\\n\\nGot:\\n' + _inspect(tokens));\n\t        }\n\t\n\t        return _ref2(this.searchIndex.search(tokens));\n\t      }\n\t    }\n\t\n\t    /**\n\t     * Index strategy based on 'all-substrings-index-strategy.ts' in github.com/bvaughn/js-search/\n\t     *\n\t     * @private\n\t     */\n\t\n\t  }, {\n\t    key: '_expandToken',\n\t    value: function _expandToken(token) {\n\t      function _ref3(_id3) {\n\t        if (!(Array.isArray(_id3) && _id3.every(function (item) {\n\t          return typeof item === 'string';\n\t        }))) {\n\t          throw new TypeError('Function return value violates contract.\\n\\nExpected:\\nArray<string>\\n\\nGot:\\n' + _inspect(_id3));\n\t        }\n\t\n\t        return _id3;\n\t      }\n\t\n\t      if (!(typeof token === 'string')) {\n\t        throw new TypeError('Value of argument \"token\" violates contract.\\n\\nExpected:\\nstring\\n\\nGot:\\n' + _inspect(token));\n\t      }\n\t\n\t      var expandedTokens = [];\n\t\n\t      // String.prototype.charAt() may return surrogate halves instead of whole characters.\n\t      // When this happens in the context of a web-worker it can cause Chrome to crash.\n\t      // Catching the error is a simple solution for now; in the future I may try to better support non-BMP characters.\n\t      // Resources:\n\t      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charAt\n\t      // https://mathiasbynens.be/notes/javascript-unicode\n\t      try {\n\t        for (var i = 0, length = token.length; i < length; ++i) {\n\t          var prefixString = '';\n\t\n\t          for (var j = i; j < length; ++j) {\n\t            prefixString += token.charAt(j);\n\t\n\t            if (!(typeof prefixString === 'string')) {\n\t              throw new TypeError('Value of variable \"prefixString\" violates contract.\\n\\nExpected:\\nstring\\n\\nGot:\\n' + _inspect(prefixString));\n\t            }\n\t\n\t            expandedTokens.push(prefixString);\n\t          }\n\t        }\n\t      } catch (error) {\n\t        console.error('Unable to parse token \"' + token + '\" ' + error);\n\t      }\n\t\n\t      return _ref3(expandedTokens);\n\t    }\n\t\n\t    /**\n\t     * @private\n\t     */\n\t\n\t  }, {\n\t    key: '_sanitize',\n\t    value: function _sanitize(string) {\n\t      function _ref4(_id4) {\n\t        if (!(typeof _id4 === 'string')) {\n\t          throw new TypeError('Function return value violates contract.\\n\\nExpected:\\nstring\\n\\nGot:\\n' + _inspect(_id4));\n\t        }\n\t\n\t        return _id4;\n\t      }\n\t\n\t      if (!(typeof string === 'string')) {\n\t        throw new TypeError('Value of argument \"string\" violates contract.\\n\\nExpected:\\nstring\\n\\nGot:\\n' + _inspect(string));\n\t      }\n\t\n\t      return _ref4(string.trim().toLocaleLowerCase());\n\t    }\n\t\n\t    /**\n\t     * @private\n\t     */\n\t\n\t  }, {\n\t    key: '_tokenize',\n\t    value: function _tokenize(text) {\n\t      function _ref5(_id5) {\n\t        if (!(Array.isArray(_id5) && _id5.every(function (item) {\n\t          return typeof item === 'string';\n\t        }))) {\n\t          throw new TypeError('Function return value violates contract.\\n\\nExpected:\\nArray<string>\\n\\nGot:\\n' + _inspect(_id5));\n\t        }\n\t\n\t        return _id5;\n\t      }\n\t\n\t      if (!(typeof text === 'string')) {\n\t        throw new TypeError('Value of argument \"text\" violates contract.\\n\\nExpected:\\nstring\\n\\nGot:\\n' + _inspect(text));\n\t      }\n\t\n\t      return _ref5(text.split(/\\s+/).filter(function (text) {\n\t        return text;\n\t      })); // Remove empty tokens\n\t    }\n\t  }]);\n\t\n\t  return SearchUtility;\n\t}();\n\t\n\texports.default = SearchUtility;\n\t\n\tfunction _inspect(input) {\n\t  if (input === null) {\n\t    return 'null';\n\t  } else if (input === undefined) {\n\t    return 'void';\n\t  } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {\n\t    return typeof input === 'undefined' ? 'undefined' : _typeof(input);\n\t  } else if (Array.isArray(input)) {\n\t    if (input.length > 0) {\n\t      var first = _inspect(input[0]);\n\n\t      if (input.every(function (item) {\n\t        return _inspect(item) === first;\n\t      })) {\n\t        return first.trim() + '[]';\n\t      } else {\n\t        return '[' + input.map(_inspect).join(', ') + ']';\n\t      }\n\t    } else {\n\t      return 'Array';\n\t    }\n\t  } else {\n\t    var keys = Object.keys(input);\n\n\t    if (!keys.length) {\n\t      if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {\n\t        return input.constructor.name;\n\t      } else {\n\t        return 'Object';\n\t      }\n\t    }\n\n\t    var entries = keys.map(function (key) {\n\t      return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key]) + ';';\n\t    }).join('\\n  ');\n\n\t    if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {\n\t      return input.constructor.name + ' {\\n  ' + entries + '\\n}';\n\t    } else {\n\t      return '{ ' + entries + '\\n}';\n\t    }\n\t  }\n\t}\n\n/***/ },\n/* 3 */\n/***/ function(module, exports) {\n\n\t\"use strict\";\n\t\n\tvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol ? \"symbol\" : typeof obj; };\n\t\n\tvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\t\n\tObject.defineProperty(exports, \"__esModule\", {\n\t  value: true\n\t});\n\t\n\tfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\t\n\t/**\n\t * Maps search tokens to uids.\n\t * This structure is used by the Search class to optimize search operations.\n\t * Forked from JS search (github.com/bvaughn/js-search).\n\t */\n\t\n\tvar SearchIndex = function () {\n\t  function SearchIndex() {\n\t    _classCallCheck(this, SearchIndex);\n\t\n\t    this.tokenToUidMap = {};\n\t  }\n\t\n\t  /**\n\t   * Maps the specified token to a uid.\n\t   *\n\t   * @param token Searchable token (e.g. \"road\")\n\t   * @param uid Identifies a document within the searchable corpus\n\t   */\n\t\n\t  _createClass(SearchIndex, [{\n\t    key: \"indexDocument\",\n\t    value: function indexDocument(token, uid) {\n\t      if (!(typeof token === 'string')) {\n\t        throw new TypeError(\"Value of argument \\\"token\\\" violates contract.\\n\\nExpected:\\nstring\\n\\nGot:\\n\" + _inspect(token));\n\t      }\n\t\n\t      if (!this.tokenToUidMap[token]) {\n\t        this.tokenToUidMap[token] = {};\n\t      }\n\t\n\t      this.tokenToUidMap[token][uid] = uid;\n\t    }\n\t\n\t    /**\n\t     * Finds uids that have been mapped to the set of tokens specified.\n\t     * Only uids that have been mapped to all tokens will be returned.\n\t     *\n\t     * @param tokens Array of searchable tokens (e.g. [\"long\", \"road\"])\n\t     * @return Array of uids that have been associated with the set of search tokens\n\t     */\n\t\n\t  }, {\n\t    key: \"search\",\n\t    value: function search(tokens) {\n\t      var _this = this;\n\t\n\t      function _ref2(_id2) {\n\t        if (!Array.isArray(_id2)) {\n\t          throw new TypeError(\"Function return value violates contract.\\n\\nExpected:\\nArray<any>\\n\\nGot:\\n\" + _inspect(_id2));\n\t        }\n\t\n\t        return _id2;\n\t      }\n\t\n\t      if (!(Array.isArray(tokens) && tokens.every(function (item) {\n\t        return typeof item === 'string';\n\t      }))) {\n\t        throw new TypeError(\"Value of argument \\\"tokens\\\" violates contract.\\n\\nExpected:\\nArray<string>\\n\\nGot:\\n\" + _inspect(tokens));\n\t      }\n\t\n\t      var uidMap = {};\n\t\n\t      if (!(uidMap != null && (typeof uidMap === \"undefined\" ? \"undefined\" : _typeof(uidMap)) === 'object')) {\n\t        throw new TypeError(\"Value of variable \\\"uidMap\\\" violates contract.\\n\\nExpected:\\n{ [uid: any]: any\\n}\\n\\nGot:\\n\" + _inspect(uidMap));\n\t      }\n\t\n\t      var initialized = false;\n\t\n\t      tokens.forEach(function (token) {\n\t        var currentUidMap = _this.tokenToUidMap[token] || {};\n\t\n\t        if (!(currentUidMap != null && (typeof currentUidMap === \"undefined\" ? \"undefined\" : _typeof(currentUidMap)) === 'object')) {\n\t          throw new TypeError(\"Value of variable \\\"currentUidMap\\\" violates contract.\\n\\nExpected:\\n{ [uid: any]: any\\n}\\n\\nGot:\\n\" + _inspect(currentUidMap));\n\t        }\n\t\n\t        if (!initialized) {\n\t          initialized = true;\n\t\n\t          for (var _uid in currentUidMap) {\n\t            uidMap[_uid] = currentUidMap[_uid];\n\t          }\n\t        } else {\n\t          for (var _uid2 in uidMap) {\n\t            if (!currentUidMap[_uid2]) {\n\t              delete uidMap[_uid2];\n\t            }\n\t          }\n\t        }\n\t      });\n\t\n\t      var uids = [];\n\t\n\t      if (!Array.isArray(uids)) {\n\t        throw new TypeError(\"Value of variable \\\"uids\\\" violates contract.\\n\\nExpected:\\nArray<any>\\n\\nGot:\\n\" + _inspect(uids));\n\t      }\n\t\n\t      for (var _uid3 in uidMap) {\n\t        uids.push(uidMap[_uid3]);\n\t      }\n\t\n\t      return _ref2(uids);\n\t    }\n\t  }]);\n\t\n\t  return SearchIndex;\n\t}();\n\t\n\texports.default = SearchIndex;\n\t\n\tfunction _inspect(input) {\n\t  if (input === null) {\n\t    return 'null';\n\t  } else if (input === undefined) {\n\t    return 'void';\n\t  } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {\n\t    return typeof input === \"undefined\" ? \"undefined\" : _typeof(input);\n\t  } else if (Array.isArray(input)) {\n\t    if (input.length > 0) {\n\t      var first = _inspect(input[0]);\n\n\t      if (input.every(function (item) {\n\t        return _inspect(item) === first;\n\t      })) {\n\t        return first.trim() + '[]';\n\t      } else {\n\t        return '[' + input.map(_inspect).join(', ') + ']';\n\t      }\n\t    } else {\n\t      return 'Array';\n\t    }\n\t  } else {\n\t    var keys = Object.keys(input);\n\n\t    if (!keys.length) {\n\t      if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {\n\t        return input.constructor.name;\n\t      } else {\n\t        return 'Object';\n\t      }\n\t    }\n\n\t    var entries = keys.map(function (key) {\n\t      return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key]) + ';';\n\t    }).join('\\n  ');\n\n\t    if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {\n\t      return input.constructor.name + ' {\\n  ' + entries + '\\n}';\n\t    } else {\n\t      return '{ ' + entries + '\\n}';\n\t    }\n\t  }\n\t}\n\n/***/ }\n/******/ ]);\n//# sourceMappingURL=0c0d513cb6382ae030e3.worker.js.map", __webpack_require__.p + "0c0d513cb6382ae030e3.worker.js");
	};

/***/ },
/* 11 */
/***/ function(module, exports) {

	// http://stackoverflow.com/questions/10343913/how-to-create-a-web-worker-from-a-string
	
	var URL = window.URL || window.webkitURL;
	module.exports = function(content, url) {
		try {
			try {
				var blob;
				try { // BlobBuilder = Deprecated, but widely implemented
					var BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
					blob = new BlobBuilder();
					blob.append(content);
					blob = blob.getBlob();
				} catch(e) { // The proposed API
					blob = new Blob([content]);
				}
				return new Worker(URL.createObjectURL(blob));
			} catch(e) {
				return new Worker('data:application/javascript,' + encodeURIComponent(content));
			}
		} catch(e) {
			return new Worker(url);
		}
	}

/***/ }
/******/ ]);
//# sourceMappingURL=js-worker-search.js.map