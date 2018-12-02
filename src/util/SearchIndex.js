/** @flow */

/**
 * Maps search tokens to uids using a trie structure.
 */
export default class SearchIndex {
  tokenToUidMap: { [token: string]: any };

  constructor() {
    this.tokenToUidMap = {};
  }

  /**
   * Maps the specified token to a uid.
   *
   * @param token Searchable token (e.g. "road")
   * @param uid Identifies a document within the searchable corpus
   */
  indexDocument(token: string, uid: any): void {
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
   * @param matchAnyToken Whether to match any token. Default is false.
   * @return Array of uids that have been associated with the set of search tokens
   */
  search(tokens: Array<string>, matchAnyToken: boolean): Array<any> {
    let uidMap: { [uid: any]: any } = {};
    let uidMatches: { [uid: any]: number } = {};
    let initialized = false;

    tokens.forEach(token => {
      let currentUidMap: { [uid: any]: any } = this.tokenToUidMap[token] || {};

      if (!initialized) {
        initialized = true;

        for (let uid in currentUidMap) {
          uidMap[uid] = currentUidMap[uid];
          uidMatches[uid] = 1;
        }
      } else {
        // Delete existing matches if using and AND query (the default)
        // Otherwise add new results to the matches
        if (!matchAnyToken) {
          for (let uid in uidMap) {
            if (!currentUidMap[uid]) {
              delete uidMap[uid];
            }
          }
        } else {
          for (let uid in currentUidMap) {
            uidMap[uid] = currentUidMap[uid];
            uidMatches[uid] = (uidMatches[uid] || 0) + 1;
          }
        }
      }
    });

    let uids: Array<any> = [];
    for (let uid in uidMap) {
      uids.push(uidMap[uid]);
    }

    // Sort according to most matches, if match any token is set.
    if (matchAnyToken) {
      uids.sort((a, b) => {
        return uidMatches[b] - uidMatches[a];
      });
    }

    return uids;
  }
}
