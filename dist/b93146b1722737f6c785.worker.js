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
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _SearchIndex = __webpack_require__(3);
	
	var _SearchIndex2 = _interopRequireDefault(_SearchIndex);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * Synchronous client-side full-text search utility.
	 * Forked from JS search (github.com/bvaughn/js-search).
	 */
	
	var SearchUtility = (function () {
	
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
	          throw new TypeError('Function return value violates contract, expected SearchUtility got ' + (_id === null ? 'null' : (typeof _id === 'undefined' ? 'undefined' : _typeof(_id)) === 'object' && _id.constructor ? _id.constructor.name || '[Unknown Object]' : typeof _id === 'undefined' ? 'undefined' : _typeof(_id)));
	        }
	
	        return _id;
	      }
	
	      if (!(typeof text === 'string')) {
	        throw new TypeError('Value of argument "text" violates contract, expected string got ' + (text === null ? 'null' : (typeof text === 'undefined' ? 'undefined' : _typeof(text)) === 'object' && text.constructor ? text.constructor.name || '[Unknown Object]' : typeof text === 'undefined' ? 'undefined' : _typeof(text)));
	      }
	
	      this.uids[uid] = true;
	
	      var fieldTokens = this._tokenize(this._sanitize(text));
	
	      if (!(Array.isArray(fieldTokens) && fieldTokens.every(function (item) {
	        return typeof item === 'string';
	      }))) {
	        throw new TypeError('Value of variable "fieldTokens" violates contract, expected Array<string> got ' + (fieldTokens === null ? 'null' : (typeof fieldTokens === 'undefined' ? 'undefined' : _typeof(fieldTokens)) === 'object' && fieldTokens.constructor ? fieldTokens.constructor.name || '[Unknown Object]' : typeof fieldTokens === 'undefined' ? 'undefined' : _typeof(fieldTokens)));
	      }
	
	      fieldTokens.forEach(function (fieldToken) {
	        var expandedTokens = _this._expandToken(fieldToken);
	
	        if (!(Array.isArray(expandedTokens) && expandedTokens.every(function (item) {
	          return typeof item === 'string';
	        }))) {
	          throw new TypeError('Value of variable "expandedTokens" violates contract, expected Array<string> got ' + (expandedTokens === null ? 'null' : (typeof expandedTokens === 'undefined' ? 'undefined' : _typeof(expandedTokens)) === 'object' && expandedTokens.constructor ? expandedTokens.constructor.name || '[Unknown Object]' : typeof expandedTokens === 'undefined' ? 'undefined' : _typeof(expandedTokens)));
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
	          throw new TypeError('Function return value violates contract, expected Array<any> got ' + (_id2 === null ? 'null' : (typeof _id2 === 'undefined' ? 'undefined' : _typeof(_id2)) === 'object' && _id2.constructor ? _id2.constructor.name || '[Unknown Object]' : typeof _id2 === 'undefined' ? 'undefined' : _typeof(_id2)));
	        }
	
	        return _id2;
	      }
	
	      if (!(typeof query === 'string')) {
	        throw new TypeError('Value of argument "query" violates contract, expected string got ' + (query === null ? 'null' : (typeof query === 'undefined' ? 'undefined' : _typeof(query)) === 'object' && query.constructor ? query.constructor.name || '[Unknown Object]' : typeof query === 'undefined' ? 'undefined' : _typeof(query)));
	      }
	
	      if (!query) {
	        return _ref2(Object.keys(this.uids));
	      } else {
	        var tokens = this._tokenize(this._sanitize(query));
	
	        if (!(Array.isArray(tokens) && tokens.every(function (item) {
	          return typeof item === 'string';
	        }))) {
	          throw new TypeError('Value of variable "tokens" violates contract, expected Array<string> got ' + (tokens === null ? 'null' : (typeof tokens === 'undefined' ? 'undefined' : _typeof(tokens)) === 'object' && tokens.constructor ? tokens.constructor.name || '[Unknown Object]' : typeof tokens === 'undefined' ? 'undefined' : _typeof(tokens)));
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
	          throw new TypeError('Function return value violates contract, expected Array<string> got ' + (_id3 === null ? 'null' : (typeof _id3 === 'undefined' ? 'undefined' : _typeof(_id3)) === 'object' && _id3.constructor ? _id3.constructor.name || '[Unknown Object]' : typeof _id3 === 'undefined' ? 'undefined' : _typeof(_id3)));
	        }
	
	        return _id3;
	      }
	
	      if (!(typeof token === 'string')) {
	        throw new TypeError('Value of argument "token" violates contract, expected string got ' + (token === null ? 'null' : (typeof token === 'undefined' ? 'undefined' : _typeof(token)) === 'object' && token.constructor ? token.constructor.name || '[Unknown Object]' : typeof token === 'undefined' ? 'undefined' : _typeof(token)));
	      }
	
	      var expandedTokens = [];
	
	      for (var i = 0, length = token.length; i < length; ++i) {
	        var prefixString = '';
	
	        for (var j = i; j < length; ++j) {
	          prefixString += token.charAt(j);
	
	          if (!(typeof prefixString === 'string')) {
	            throw new TypeError('Value of variable "prefixString" violates contract, expected string got ' + (prefixString === null ? 'null' : (typeof prefixString === 'undefined' ? 'undefined' : _typeof(prefixString)) === 'object' && prefixString.constructor ? prefixString.constructor.name || '[Unknown Object]' : typeof prefixString === 'undefined' ? 'undefined' : _typeof(prefixString)));
	          }
	
	          expandedTokens.push(prefixString);
	        }
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
	          throw new TypeError('Function return value violates contract, expected string got ' + (_id4 === null ? 'null' : (typeof _id4 === 'undefined' ? 'undefined' : _typeof(_id4)) === 'object' && _id4.constructor ? _id4.constructor.name || '[Unknown Object]' : typeof _id4 === 'undefined' ? 'undefined' : _typeof(_id4)));
	        }
	
	        return _id4;
	      }
	
	      if (!(typeof string === 'string')) {
	        throw new TypeError('Value of argument "string" violates contract, expected string got ' + (string === null ? 'null' : (typeof string === 'undefined' ? 'undefined' : _typeof(string)) === 'object' && string.constructor ? string.constructor.name || '[Unknown Object]' : typeof string === 'undefined' ? 'undefined' : _typeof(string)));
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
	          throw new TypeError('Function return value violates contract, expected Array<string> got ' + (_id5 === null ? 'null' : (typeof _id5 === 'undefined' ? 'undefined' : _typeof(_id5)) === 'object' && _id5.constructor ? _id5.constructor.name || '[Unknown Object]' : typeof _id5 === 'undefined' ? 'undefined' : _typeof(_id5)));
	        }
	
	        return _id5;
	      }
	
	      if (!(typeof text === 'string')) {
	        throw new TypeError('Value of argument "text" violates contract, expected string got ' + (text === null ? 'null' : (typeof text === 'undefined' ? 'undefined' : _typeof(text)) === 'object' && text.constructor ? text.constructor.name || '[Unknown Object]' : typeof text === 'undefined' ? 'undefined' : _typeof(text)));
	      }
	
	      return _ref5(text.split(/\s+/).filter(function (text) {
	        return text;
	      })); // Remove empty tokens
	    }
	  }]);
	
	  return SearchUtility;
	})();
	
	exports.default = SearchUtility;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * Maps search tokens to uids.
	 * This structure is used by the Search class to optimize search operations.
	 * Forked from JS search (github.com/bvaughn/js-search).
	 */
	
	var SearchIndex = (function () {
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
	        throw new TypeError("Value of argument \"token\" violates contract, expected string got " + (token === null ? 'null' : (typeof token === "undefined" ? "undefined" : _typeof(token)) === 'object' && token.constructor ? token.constructor.name || '[Unknown Object]' : typeof token === "undefined" ? "undefined" : _typeof(token)));
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
	          throw new TypeError("Function return value violates contract, expected Array<any> got " + (_id2 === null ? 'null' : (typeof _id2 === "undefined" ? "undefined" : _typeof(_id2)) === 'object' && _id2.constructor ? _id2.constructor.name || '[Unknown Object]' : typeof _id2 === "undefined" ? "undefined" : _typeof(_id2)));
	        }
	
	        return _id2;
	      }
	
	      if (!(Array.isArray(tokens) && tokens.every(function (item) {
	        return typeof item === 'string';
	      }))) {
	        throw new TypeError("Value of argument \"tokens\" violates contract, expected Array<string> got " + (tokens === null ? 'null' : (typeof tokens === "undefined" ? "undefined" : _typeof(tokens)) === 'object' && tokens.constructor ? tokens.constructor.name || '[Unknown Object]' : typeof tokens === "undefined" ? "undefined" : _typeof(tokens)));
	      }
	
	      var uidMap = {};
	
	      if (!(uidMap != null && (typeof uidMap === "undefined" ? "undefined" : _typeof(uidMap)) === 'object')) {
	        throw new TypeError("Value of variable \"uidMap\" violates contract, expected { [uid: any]: any\n} got " + (uidMap === null ? 'null' : (typeof uidMap === "undefined" ? "undefined" : _typeof(uidMap)) === 'object' && uidMap.constructor ? uidMap.constructor.name || '[Unknown Object]' : typeof uidMap === "undefined" ? "undefined" : _typeof(uidMap)));
	      }
	
	      var initialized = false;
	
	      tokens.forEach(function (token) {
	        var currentUidMap = _this.tokenToUidMap[token] || {};
	
	        if (!(currentUidMap != null && (typeof currentUidMap === "undefined" ? "undefined" : _typeof(currentUidMap)) === 'object')) {
	          throw new TypeError("Value of variable \"currentUidMap\" violates contract, expected { [uid: any]: any\n} got " + (currentUidMap === null ? 'null' : (typeof currentUidMap === "undefined" ? "undefined" : _typeof(currentUidMap)) === 'object' && currentUidMap.constructor ? currentUidMap.constructor.name || '[Unknown Object]' : typeof currentUidMap === "undefined" ? "undefined" : _typeof(currentUidMap)));
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
	        throw new TypeError("Value of variable \"uids\" violates contract, expected Array<any> got " + (uids === null ? 'null' : (typeof uids === "undefined" ? "undefined" : _typeof(uids)) === 'object' && uids.constructor ? uids.constructor.name || '[Unknown Object]' : typeof uids === "undefined" ? "undefined" : _typeof(uids)));
	      }
	
	      for (var _uid3 in uidMap) {
	        uids.push(uidMap[_uid3]);
	      }
	
	      return _ref2(uids);
	    }
	  }]);
	
	  return SearchIndex;
	})();
	
	exports.default = SearchIndex;

/***/ }
/******/ ]);
//# sourceMappingURL=b93146b1722737f6c785.worker.js.map