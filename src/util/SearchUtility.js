import { INDEX_MODES } from "./constants";
import SearchIndex from "./SearchIndex";

/**
 * Synchronous client-side full-text search utility.
 * Forked from JS search (github.com/bvaughn/js-search).
 */
export default class SearchUtility {
  /**
   * Constructor.
   *
   * @param indexMode See #setIndexMode
   * @param tokenize A function that splits a string into an array of tokens to be searched
   * @param sanitize A function that transforms a string before it is searched
   */
  constructor(
    {
      indexMode = INDEX_MODES.ALL_SUBSTRINGS,
      tokenize = this._defaultTokenize,
      sanitize = this._defaultSanitize
    } = {}
  ) {
    this._indexMode = indexMode;
    this._tokenize = tokenize;
    this._sanitize = sanitize;

    this.searchIndex = new SearchIndex();
    this.uids = {};
  }

  /**
   * Returns a constant representing the current index mode.
   */
  getIndexMode(): string {
    return this._indexMode;
  }

  /**
   * Adds or updates a uid in the search index and associates it with the specified text.
   * Note that at this time uids can only be added or updated in the index, not removed.
   *
   * @param uid Uniquely identifies a searchable object
   * @param text Text to associate with uid
   */
  indexDocument(uid: any, text: string): SearchUtility {
    this.uids[uid] = true;

    var fieldTokens: Array<string> = this._tokenize(this._sanitize(text));

    fieldTokens.forEach(fieldToken => {
      var expandedTokens: Array<string> = this._expandToken(fieldToken);

      expandedTokens.forEach(expandedToken => {
        this.searchIndex.indexDocument(expandedToken, uid);
      });
    });

    return this;
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
  search(query: string): Array<any> {
    if (!query) {
      return Object.keys(this.uids);
    } else {
      var tokens: Array<string> = this._tokenize(this._sanitize(query));

      return this.searchIndex.search(tokens);
    }
  }

  /**
   * Sets a new index mode.
   * See util/constants/INDEX_MODES
   */
  setIndexMode(indexMode: string): void {
    if (Object.keys(this.uids).length > 0) {
      throw Error(
        "indexMode cannot be changed once documents have been indexed"
      );
    }

    this._indexMode = indexMode;
  }

  /**
   * Index strategy based on 'all-substrings-index-strategy.ts' in github.com/bvaughn/js-search/
   *
   * @private
   */
  _expandToken(token: string): Array<string> {
    switch (this._indexMode) {
      case INDEX_MODES.EXACT_WORDS:
        return [token];
      case INDEX_MODES.PREFIXES:
        return this._expandPrefixTokens(token);
      case INDEX_MODES.ALL_SUBSTRINGS:
      default:
        return this._expandAllSubstringTokens(token);
    }
  }

  _expandAllSubstringTokens(token: string): Array<string> {
    const expandedTokens = [];

    // String.prototype.charAt() may return surrogate halves instead of whole characters.
    // When this happens in the context of a web-worker it can cause Chrome to crash.
    // Catching the error is a simple solution for now; in the future I may try to better support non-BMP characters.
    // Resources:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charAt
    // https://mathiasbynens.be/notes/javascript-unicode
    try {
      for (let i = 0, length = token.length; i < length; ++i) {
        let substring: string = "";

        for (let j = i; j < length; ++j) {
          substring += token.charAt(j);
          expandedTokens.push(substring);
        }
      }
    } catch (error) {
      console.error(`Unable to parse token "${token}" ${error}`);
    }

    return expandedTokens;
  }

  _expandPrefixTokens(token: string): Array<string> {
    const expandedTokens = [];

    // String.prototype.charAt() may return surrogate halves instead of whole characters.
    // When this happens in the context of a web-worker it can cause Chrome to crash.
    // Catching the error is a simple solution for now; in the future I may try to better support non-BMP characters.
    // Resources:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charAt
    // https://mathiasbynens.be/notes/javascript-unicode
    try {
      for (let i = 0, length = token.length; i < length; ++i) {
        expandedTokens.push(token.substr(0, i + 1));
      }
    } catch (error) {
      console.error(`Unable to parse token "${token}" ${error}`);
    }

    return expandedTokens;
  }

  /**
   * @private
   */
  _defaultSanitize(string: string): string {
    return string.trim().toLocaleLowerCase();
  }

  /**
   * @private
   */
  _defaultTokenize(text: string): Array<string> {
    return text.split(/\s+/).filter(text => text); // Remove empty tokens
  }
}
