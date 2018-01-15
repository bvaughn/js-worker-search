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

const documents = [documentA, documentB];

test("SearchApi should return documents ids for any searchable field matching a query", async done => {
  const searchApi = new SearchApi();
  documents.forEach(doc => {
    searchApi.indexDocument(doc.get("id"), doc.get("name"));
    searchApi.indexDocument(doc.get("id"), doc.get("description"));
  });
  const ids = await searchApi.search("document");
  expect(ids.length).toBe(2);
  expect(ids).toEqual([1, 2]);
  done();
});
