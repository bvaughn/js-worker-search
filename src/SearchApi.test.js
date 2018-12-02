import SearchApi from "./";
import Immutable from "immutable";

const documentA = Immutable.fromJS({
  id: 1,
  name: "One",
  description: "The first document"
});
const documentB = Immutable.fromJS({
  id: 2,
  name: "Two",
  description: "The second document"
});
const documentC = Immutable.fromJS({
  id: 3,
  name: "Three",
  description: "The third document"
});

const documents = [documentA, documentB, documentC];

test("SearchApi should return documents ids for any searchable field matching an AND query", async done => {
  const searchApi = new SearchApi();
  documents.forEach(doc => {
    searchApi.indexDocument(doc.get("id"), doc.get("name"));
    searchApi.indexDocument(doc.get("id"), doc.get("description"));
  });
  const ids = await searchApi.search("ir");
  expect(ids.length).toBe(2);
  expect(ids).toEqual([1, 3]);
  done();
});

test("SearchApi should return documents ids for any searchable field matching an OR query", async done => {
  const searchApi = new SearchApi({
    matchAnyToken: true
  });
  documents.forEach(doc => {
    searchApi.indexDocument(doc.get("id"), doc.get("name"));
    searchApi.indexDocument(doc.get("id"), doc.get("description"));
  });
  const ids = await searchApi.search("first third");
  expect(ids.length).toBe(2);
  expect(ids).toEqual([1, 3]);
  done();
});
