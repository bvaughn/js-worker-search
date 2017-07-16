/** @flow */

export const INDEX_MODES = {
  // Indexes for all substring searches (e.g. the term "cat" is indexed as "c", "ca", "cat", "a", "at", and "t").
  // Based on 'all-substrings-index-strategy' from js-search;
  // github.com/bvaughn/js-search/blob/master/source/index-strategy/all-substrings-index-strategy.ts
  ALL_SUBSTRINGS: "ALL_SUBSTRINGS",

  // Indexes for exact word matches only.
  // Based on 'exact-word-index-strategy' from js-search;
  // github.com/bvaughn/js-search/blob/master/source/index-strategy/exact-word-index-strategy.ts
  EXACT_WORDS: "EXACT_WORDS",

  // Indexes for prefix searches (e.g. the term "cat" is indexed as "c", "ca", and "cat" allowing prefix search lookups).
  // Based on 'prefix-index-strategy' from js-search;
  // github.com/bvaughn/js-search/blob/master/source/index-strategy/prefix-index-strategy.ts
  PREFIXES: "PREFIXES"
};

export type IndexMode = $Keys<typeof INDEX_MODES>;
