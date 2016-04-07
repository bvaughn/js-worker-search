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

	'use strict';
	
	var _util = __webpack_require__(1);
	
	var _util2 = _interopRequireDefault(_util);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Search entry point to web worker.
	 * Builds search index and performs searches on separate thread from the ui.
	 */
	
	var searchUtility = new _util2.default();
	
	self.addEventListener('message', function (event) {
	  var data = event.data;
	  var method = data.method;
	
	  switch (method) {
	    case 'indexDocument':
	      var uid = data.uid;
	      var text = data.text;
	
	      searchUtility.indexDocument(uid, text);
	      break;
	    case 'search':
	      var callbackId = data.callbackId;
	      var query = data.query;
	
	      var results = searchUtility.search(query);
	
	      self.postMessage({ callbackId: callbackId, results: results });
	      break;
	  }
	}, false);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = undefined;
	
	var _SearchUtility = __webpack_require__(2);
	
	var _SearchUtility2 = _interopRequireDefault(_SearchUtility);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = _SearchUtility2.default;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _SearchIndex = __webpack_require__(3);
	
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
/* 3 */
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

/***/ }
/******/ ]);
//# sourceMappingURL=0c0d513cb6382ae030e3.worker.js.map