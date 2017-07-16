/** @flow */

import test from "tape";
import { fromJS } from "immutable";
import SearchUtility from "./SearchUtility";
import { INDEX_MODES } from "./constants";
import type { IndexMode } from "./constants";

const documentA = fromJS({
  id: "1",
  name: "One",
  description: "The first document"
});
const documentB = fromJS({
  id: "2",
  name: "Two",
  description: "The second document"
});
const documentC = fromJS({
  id: "3",
  name: "Three",
  description: "The third document"
});
const documentD = fromJS({
  id: "4",
  name: "楌ぴ",
  description: "堦ヴ礯 ラ蝥曣んを 檨儯饨䶧"
});
const documentE = fromJS({
  id: "5",
  name: "ㄨ穯ゆ姎囥",
  description: "楌ぴ 堦ヴ礯 ラ蝥曣んを 檨儯饨䶧䏤"
});
const documentF = fromJS({
  id: 6,
  name: "Six",
  description: "Este es el sexto/6o documento"
});
const documents = [
  documentA,
  documentB,
  documentC,
  documentD,
  documentE,
  documentF
];

function init(
  {
    indexMode,
    tokenizePattern,
    caseSensitive
  }: {
    indexMode?: IndexMode,
    tokenizePattern?: RegExp,
    caseSensitive?: boolean
  } = {}
) {
  const searchUtility = new SearchUtility({
    indexMode,
    tokenizePattern,
    caseSensitive
  });

  documents.forEach(doc => {
    searchUtility.indexDocument(doc.get("id"), doc.get("name"));
    searchUtility.indexDocument(doc.get("id"), doc.get("description"));
  });

  return searchUtility;
}

test("SearchUtility should return documents ids for any searchable field matching a query", async t => {
  const searchUtility = init();
  let ids = await searchUtility.search("One");
  t.equal(ids.length, 1);
  t.deepLooseEqual(ids, ["1"]);

  ids = await searchUtility.search("Third");
  t.equal(ids.length, 1);
  t.deepLooseEqual(ids, ["3"]);

  ids = await searchUtility.search("the");
  t.equal(ids.length, 3);
  t.deepLooseEqual(ids, ["1", "2", "3"]);

  ids = await searchUtility.search("楌"); // Tests matching of other script systems
  t.equal(ids.length, 2);
  t.deepLooseEqual(ids, ["4", "5"]);
  t.end();
});

test("SearchUtility should return documents ids only if document matches all tokens in a query", async t => {
  const searchUtility = init();
  let ids = await searchUtility.search("the second");
  t.equal(ids.length, 1);
  t.equal(ids[0], "2");

  ids = await searchUtility.search("three document"); // Spans multiple fields
  t.equal(ids.length, 1);
  t.equal(ids[0], "3");
  t.end();
});

test("SearchUtility should return an empty array for query without matching documents", async t => {
  const searchUtility = init();
  const ids = await searchUtility.search("four");
  t.equal(ids.length, 0);
  t.end();
});

test("SearchUtility should return all uids for an empty query", async t => {
  const searchUtility = init();
  const ids = await searchUtility.search("");
  t.equal(ids.length, documents.length);
  t.end();
});

test("SearchUtility should ignore case when searching", async t => {
  const searchUtility = init();
  const texts = ["one", "One", "ONE"];
  texts.forEach(async text => {
    const ids = await searchUtility.search(text);
    t.equal(ids.length, 1);
    t.equal(ids[0], "1");
  });

  t.end();
});

test("SearchUtility should use substring matching", async t => {
  const searchUtility = init();
  let texts = ["sec", "second", "eco", "cond"];
  texts.forEach(async text => {
    let ids = await searchUtility.search(text);
    t.equal(ids.length, 1);
    t.equal(ids[0], "2");
  });

  texts = ["堦", "堦ヴ", "堦ヴ礯", "ヴ", "ヴ礯"];
  texts.forEach(async text => {
    let ids = await searchUtility.search(text);
    t.equal(ids.length, 2);
    t.deepLooseEqual(ids, ["4", "5"]);
  });

  t.end();
});

test("SearchUtility should allow custom indexing via indexDocument", async t => {
  const searchUtility = init();
  const text = "xyz";
  let ids = await searchUtility.search(text);
  t.equal(ids.length, 0);

  const id = documentA.get("id");
  searchUtility.indexDocument(id, text);

  ids = await searchUtility.search(text);
  t.equal(ids.length, 1);
  t.equal(ids[0], "1");
  t.end();
});

test("SearchUtility should recognize an :indexMode constructor param", t => {
  const searchUtility = new SearchUtility({
    indexMode: INDEX_MODES.EXACT_WORDS
  });
  t.equal(searchUtility.getIndexMode(), INDEX_MODES.EXACT_WORDS);
  t.end();
});

test("SearchUtility should update its default :indexMode when :setIndexMode() is called", t => {
  const searchUtility = new SearchUtility();
  searchUtility.setIndexMode(INDEX_MODES.EXACT_WORDS);
  t.equal(searchUtility.getIndexMode(), INDEX_MODES.EXACT_WORDS);
  t.end();
});

test("SearchUtility should should error if :setIndexMode() is called after an index has been created", t => {
  let errored = false;
  const searchUtility = init();
  try {
    searchUtility.indexDocument("foo", "bar");
    searchUtility.setIndexMode(INDEX_MODES.EXACT_WORDS);
  } catch (error) {
    errored = true;
  }
  t.equal(errored, true);
  t.end();
});

test("SearchUtility should support PREFIXES :indexMode", async t => {
  const searchUtility = init({ indexMode: INDEX_MODES.PREFIXES });
  const match1 = ["fir", "first"];
  const match2 = ["sec", "second"];
  match1.forEach(async token => {
    const ids = await searchUtility.search(token);
    t.deepLooseEqual(ids, [1]);
  });
  match2.forEach(async token => {
    const ids = await searchUtility.search(token);
    t.deepLooseEqual(ids, [2]);
  });
  const noMatch = ["irst", "rst", "st", "irs", "ond", "econd", "eco"];
  noMatch.forEach(async token => {
    const ids = await searchUtility.search(token);
    t.deepLooseEqual(ids.length, 0);
  });
  t.end();
});

test("SearchUtility should support EXACT_WORDS :indexMode", async t => {
  const searchUtility = init({ indexMode: INDEX_MODES.EXACT_WORDS });
  t.deepLooseEqual(await searchUtility.search("first"), [1]);
  t.deepLooseEqual(await searchUtility.search("second"), [2]);
  const noMatch = ["irst", "rst", "st", "irs", "ond", "econd", "eco"];
  noMatch.forEach(async token => {
    const ids = await searchUtility.search(token);
    console.log('"' + token + '" => ids:', ids);
    t.equal(ids.length, 0);
  });
  t.end();
});

test("SearchUtility should update its default :tokenizePattern when :setTokenizePattern() is called", t => {
  const searchUtility = new SearchUtility();
  searchUtility.setTokenizePattern(/[^a-z0-9]/);
  t.deepLooseEqual(searchUtility.getTokenizePattern(), /[^a-z0-9]/);
  t.end();
});

test("SearchUtility should update its default :caseSensitive bit when :setCaseSensitive() is called", t => {
  const searchUtility = new SearchUtility();
  t.equal(searchUtility.getCaseSensitive(), false);
  searchUtility.setCaseSensitive(true);
  t.equal(searchUtility.getCaseSensitive(), true);
  t.end();
});

test("SearchUtility should support custom tokenizer pattern", async t => {
  const searchUtility = init({
    indexMode: INDEX_MODES.EXACT_WORDS,
    tokenizePattern: /[^a-z0-9]+/
  });
  t.deepLooseEqual(await searchUtility.search("sexto"), [6]);
  t.deepLooseEqual(await searchUtility.search("6o"), [6]);
  t.end();
});

test("SearchUtility should support case sensitive search", async t => {
  const searchUtility = init({
    indexMode: INDEX_MODES.EXACT_WORDS,
    caseSensitive: true
  });
  t.equal((await searchUtility.search("First")).length, 0);
  t.deepLooseEqual(await searchUtility.search("first"), [1]);
  t.end();
});
