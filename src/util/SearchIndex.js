/** @flow */

type Node = {
  [charCode: any]: Node,
  "0": Array<any>
};

/**
 * Maps search tokens to uids using a trie structure.
 */
export default class SearchIndex {
  _root: Node;

  constructor() {
    this._root = {
      "0": []
    };
  }

  /**
   * Maps the specified token to a uid.
   *
   * @param token Searchable token (e.g. "road")
   * @param uid Identifies a document within the searchable corpus
   */
  indexDocument(token: string, uid: any): void {
    let node = this._root;

    for (let i = 0; i < token.length; i++) {
      // Index 0 is where we store lookup to words matching this node.
      // So char codes are offset by 1 to avoid conflicting.
      let char = token.charCodeAt(i) + 1;

      let child = node[char];
      if (typeof child === "object") {
        child["0"].push(uid);
      } else {
        child = {
          "0": [uid]
        };

        node[char] = child;
      }

      node = child;
    }
  }

  /**
   * Finds uids that have been mapped to the set of tokens specified.
   * Only uids that have been mapped to all tokens will be returned.
   *
   * @param tokens Array of searchable tokens (e.g. ["long", "road"])
   * @return Array of uids that have been associated with the set of search tokens
   */
  search(tokens: Array<string>): Array<any> {
    let uidMap: { [uid: any]: any } = {};
    let initialized = false;

    tokens.forEach(token => {
      let currentUids = this._find(token);
      let currentUidMap = currentUids.reduce((map, uid) => {
        map[uid] = uid;
        return map;
      }, {});

      if (!initialized) {
        initialized = true;
        uidMap = currentUidMap;
      } else {
        for (let uid in uidMap) {
          if (!currentUidMap[uid]) {
            delete uidMap[uid];
          }
        }
      }
    });

    let uids: Array<any> = [];
    for (let uid in uidMap) {
      uids.push(uid);
    }

    return uids;
  }

  _find(token: string): Array<any> {
    var node = this._root;
    for (var j = 0; j < token.length; j++) {
      var char = token.charCodeAt(j) + 1;
      node = node[char];
      if (!node) {
        return [];
      }
    }
    return node["0"];
  }
}
