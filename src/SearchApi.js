/** @flow */

import { SearchUtility } from "./util";
import SearchWorkerLoader from "./worker";

import type { IndexMode } from "./util";

/**
 * Search API that uses web workers when available.
 * Indexing and searching is performed in the UI thread as a fallback when web workers aren't supported.
 */
export default class SearchApi {
  _search: any; // TODO

  constructor({ indexMode }: { indexMode: IndexMode } = {}) {
    // Based on https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers
    // But with added check for Node environment
    if (typeof window !== "undefined" && window.Worker) {
      this._search = new SearchWorkerLoader({ indexMode });
    } else {
      this._search = new SearchUtility({ indexMode });
    }
  }

  /**
   * Adds or updates a uid in the search index and associates it with the specified text.
   * Note that at this time uids can only be added or updated in the index, not removed.
   *
   * @param uid Uniquely identifies a searchable object
   * @param text Text to associate with uid
   */
  indexDocument = (uid: any, text: string): SearchApi => {
    this._search.indexDocument(uid, text);

    return this;
  };

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
  search = (query: string): Promise<Array<any>> => {
    // Promise.resolve handles both synchronous and web-worker Search utilities
    return this._search.search(query);
  };
}
