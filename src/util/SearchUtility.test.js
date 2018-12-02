/** @flow */

import { fromJS } from "immutable";
import SearchUtility from "./SearchUtility";
import { INDEX_MODES } from "./constants";
import type { IndexMode } from "./constants";

const documentA = fromJS({
  id: 1,
  name: "One",
  description: "The first document"
});
const documentB = fromJS({
  id: 2,
  name: "Two",
  description: "The second document"
});
const documentC = fromJS({
  id: 3,
  name: "Three",
  description: "The third document"
});
const documentD = fromJS({
  id: 4,
  name: "楌ぴ",
  description: "堦ヴ礯 ラ蝥曣んを 檨儯饨䶧"
});
const documentE = fromJS({
  id: 5,
  name: "ㄨ穯ゆ姎囥",
  description: "楌ぴ 堦ヴ礯 ラ蝥曣んを 檨儯饨䶧䏤"
});
const documentF = fromJS({
  id: 6,
  name: "Six",
  description: "Este es el sexto/6o documento"
});
const documentG = fromJS({
  id: 7,
  name: "Seven",
  description: "ქართული ენა"
});

const documents = [
  documentA,
  documentB,
  documentC,
  documentD,
  documentE,
  documentF,
  documentG
];

function init(
  {
    indexMode,
    tokenizePattern,
    caseSensitive,
    matchAnyToken
  }: {
    indexMode?: IndexMode,
    tokenizePattern?: RegExp,
    caseSensitive?: boolean,
    matchAnyToken?: boolean
  } = {}
) {
  const searchUtility = new SearchUtility({
    indexMode,
    tokenizePattern,
    caseSensitive,
    matchAnyToken
  });

  documents.forEach(doc => {
    searchUtility.indexDocument(doc.get("id"), doc.get("name"));
    searchUtility.indexDocument(doc.get("id"), doc.get("description"));
  });

  return searchUtility;
}

test("SearchUtility should return documents ids for any searchable field matching a query", async done => {
  const searchUtility = init();
  let ids = await searchUtility.search("One");
  expect(ids.length).toBe(1);
  expect(ids).toEqual([1]);

  ids = await searchUtility.search("Third");
  expect(ids.length).toBe(1);
  expect(ids).toEqual([3]);

  ids = await searchUtility.search("the");
  expect(ids.length).toBe(3);
  expect(ids).toEqual([1, 2, 3]);

  ids = await searchUtility.search("楌"); // Tests matching of other script systems, eg Japanese
  expect(ids.length).toBe(2);
  expect(ids).toEqual([4, 5]);

  ids = await searchUtility.search("ენ"); // Tests matching of other script systems, eg Georgian
  expect(ids.length).toBe(1);
  expect(ids).toEqual([7]);

  done();
});

test("SearchUtility should return documents ids only if document matches all tokens in a query", async done => {
  const searchUtility = init();
  let ids = await searchUtility.search("the second");
  expect(ids.length).toBe(1);
  expect(ids[0]).toBe(2);

  ids = await searchUtility.search("three document"); // Spans multiple fields
  expect(ids.length).toBe(1);
  expect(ids[0]).toBe(3);
  done();
});

test("SearchUtility should return matching documents for any token, if specified", async done => {
  const searchUtility = init({ matchAnyToken: true });
  let ids = await searchUtility.search("first two second");
  expect(ids.length).toBe(2);
  expect(ids[0]).toBe(2); // The second document has most matches
  expect(ids[1]).toBe(1);
  done();
});

test("SearchUtility should return an empty array for query without matching documents", async done => {
  const searchUtility = init();
  const ids = await searchUtility.search("four");
  expect(ids.length).toBe(0);
  done();
});

test("SearchUtility should return all uids for an empty query", async done => {
  const searchUtility = init();
  const ids = await searchUtility.search("");
  expect(ids.length).toBe(documents.length);
  done();
});

test("SearchUtility should ignore case when searching", async done => {
  const searchUtility = init();
  const texts = ["one", "One", "ONE"];
  texts.forEach(async text => {
    const ids = await searchUtility.search(text);
    expect(ids.length).toBe(1);
    expect(ids[0]).toBe(1);
  });

  done();
});

test("SearchUtility should use substring matching", async done => {
  const searchUtility = init();
  let texts = ["sec", "second", "eco", "cond"];
  texts.forEach(async text => {
    let ids = await searchUtility.search(text);
    expect(ids.length).toBe(1);
    expect(ids[0]).toBe(2);
  });

  texts = ["堦", "堦ヴ", "堦ヴ礯", "ヴ", "ヴ礯"];
  texts.forEach(async text => {
    let ids = await searchUtility.search(text);
    expect(ids.length).toBe(2);
    expect(ids).toEqual([4, 5]);
  });

  done();
});

test("SearchUtility should allow custom indexing via indexDocument", async done => {
  const searchUtility = init();
  const text = "xyz";
  let ids = await searchUtility.search(text);
  expect(ids.length).toBe(0);

  const id = documentA.get("id");
  searchUtility.indexDocument(id, text);

  ids = await searchUtility.search(text);
  expect(ids.length).toBe(1);
  expect(ids[0]).toBe(1);
  done();
});

test("SearchUtility should recognize an :indexMode constructor param", () => {
  const searchUtility = new SearchUtility({
    indexMode: INDEX_MODES.EXACT_WORDS
  });
  expect(searchUtility.getIndexMode()).toBe(INDEX_MODES.EXACT_WORDS);
});

test("SearchUtility should update its default :indexMode when :setIndexMode() is called", () => {
  const searchUtility = new SearchUtility();
  searchUtility.setIndexMode(INDEX_MODES.EXACT_WORDS);
  expect(searchUtility.getIndexMode()).toBe(INDEX_MODES.EXACT_WORDS);
});

test("SearchUtility should should error if :setIndexMode() is called after an index has been created", () => {
  let errored = false;
  const searchUtility = init();
  try {
    searchUtility.indexDocument("foo", "bar");
    searchUtility.setIndexMode(INDEX_MODES.EXACT_WORDS);
  } catch (error) {
    errored = true;
  }
  expect(errored).toBe(true);
});

test("SearchUtility should support PREFIXES :indexMode", async done => {
  const searchUtility = init({ indexMode: INDEX_MODES.PREFIXES });
  const match1 = ["fir", "first"];
  const match2 = ["sec", "second"];
  match1.forEach(async token => {
    const ids = await searchUtility.search(token);
    expect(ids).toEqual([1]);
  });
  match2.forEach(async token => {
    const ids = await searchUtility.search(token);
    expect(ids).toEqual([2]);
  });
  const noMatch = ["irst", "rst", "st", "irs", "ond", "econd", "eco"];
  noMatch.forEach(async token => {
    const ids = await searchUtility.search(token);
    expect(ids.length).toEqual(0);
  });
  done();
});

test("SearchUtility should support EXACT_WORDS :indexMode", async done => {
  const searchUtility = init({ indexMode: INDEX_MODES.EXACT_WORDS });
  expect(await searchUtility.search("first")).toEqual([1]);
  expect(await searchUtility.search("second")).toEqual([2]);
  const noMatch = ["irst", "rst", "st", "irs", "ond", "econd", "eco"];
  noMatch.forEach(async token => {
    const ids = await searchUtility.search(token);
    expect(ids.length).toBe(0);
  });
  done();
});

test("SearchUtility should update its default :tokenizePattern when :setTokenizePattern() is called", () => {
  const searchUtility = new SearchUtility();
  searchUtility.setTokenizePattern(/[^a-z0-9]/);
  expect(searchUtility.getTokenizePattern()).toEqual(/[^a-z0-9]/);
});

test("SearchUtility should update its default :caseSensitive bit when :setCaseSensitive() is called", () => {
  const searchUtility = new SearchUtility();
  expect(searchUtility.getCaseSensitive()).toBe(false);
  searchUtility.setCaseSensitive(true);
  expect(searchUtility.getCaseSensitive()).toBe(true);
});

test("SearchUtility should support custom tokenizer pattern", async done => {
  const searchUtility = init({
    indexMode: INDEX_MODES.EXACT_WORDS,
    tokenizePattern: /[^a-z0-9]+/
  });
  expect(await searchUtility.search("sexto")).toEqual([6]);
  expect(await searchUtility.search("6o")).toEqual([6]);
  done();
});

test("SearchUtility should support case sensitive search", async done => {
  const searchUtility = init({
    indexMode: INDEX_MODES.EXACT_WORDS,
    caseSensitive: true
  });
  expect((await searchUtility.search("First")).length).toBe(0);
  expect(await searchUtility.search("first")).toEqual([1]);
  done();
});
