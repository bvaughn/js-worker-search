/** @flow */

/**
 * Maps search tokens to uids using a trie structure.
 */
export interface SearchApiIndex {
  /**
   * Maps the specified token to a uid.
   *
   * @param token Searchable token (e.g. "road")
   * @param uid Identifies a document within the searchable corpus
   */
  indexDocument: (token: string, uid: any) => SearchApiIndex,

  /**
   * Finds uids that have been mapped to the set of tokens specified.
   * Only uids that have been mapped to all tokens will be returned.
   *
   * @param tokens Array of searchable tokens (e.g. ["long", "road"])
   * @return Array of uids that have been associated with the set of search tokens
   */
  search: (query: string) => Array<any> | Promise<Array<any>>
}
