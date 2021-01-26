/** @flow */

import SearchWorkerLoader from "./SearchWorkerLoader";
import { INDEX_MODES } from "../util";

import type { CallbackData } from "./SearchWorkerLoader";

function noop() {}

class StubWorker {
  onerror: ({ data: CallbackData }) => void;
  onmessage: ({ data: CallbackData }) => void;

  _indexedDocumentMap = {};
  _searchQueue = [];
  _setCaseSensitiveQueue = [];
  _setIndexModeQueue = [];
  _setMatchAnyTokenQueue = [];
  _setTokenizePatternQueue = [];

  postMessage(data) {
    const { method, ...props } = data;

    switch (method) {
      case "indexDocument":
        const { uid, text } = props;
        if (!this._indexedDocumentMap[uid]) {
          this._indexedDocumentMap[uid] = [];
        }
        this._indexedDocumentMap[uid].push(text);
        break;
      case "search":
        const { callbackId, query } = props;
        this._searchQueue.push({ callbackId, query });
        break;
      case "setCaseSensitive":
        const { caseSensitive } = props;
        this._setCaseSensitiveQueue.push({ caseSensitive });
        break;
      case "setIndexMode":
        const { indexMode } = props;
        this._setIndexModeQueue.push({ indexMode });
        break;
      case "setMatchAnyToken":
        const { matchAnyToken } = props;
        this._setMatchAnyTokenQueue.push({ matchAnyToken });
        break;
      case "setTokenizePattern":
        const { tokenizePattern } = props;
        this._setTokenizePatternQueue.push({ tokenizePattern });
        break;
      case "setMaxDepth":
        const { maxDepth } = props;
        this._setTokenizePatternQueue.push({ maxDepth });
        break;
    }
  }

  rejectSearch(index: number, error: Error) {
    const { callbackId } = this._searchQueue[index];
    this.onerror({
      data: {
        error,
        callbackId,
        complete: true,
        reject: noop,
        resolve: noop,
        results: null
      }
    });
  }

  resolveSearch(index: number, results: Array<string>) {
    const { callbackId } = this._searchQueue[index];
    this.onmessage({
      data: {
        callbackId,
        complete: true,
        error: null,
        reject: noop,
        resolve: noop,
        results
      }
    });
  }
}

test("SearchWorkerLoader indexDocument should index a document with the specified text(s)", () => {
  const search = new SearchWorkerLoader({ WorkerClass: StubWorker });
  search.indexDocument("a", "cat");
  search.indexDocument("a", "dog");
  search.indexDocument("b", "cat");

  expect(Object.keys(search._worker._indexedDocumentMap).length).toBe(2);
  expect(search._worker._indexedDocumentMap.a.length).toBe(2);
  expect(search._worker._indexedDocumentMap.a).toEqual(["cat", "dog"]);
  expect(search._worker._indexedDocumentMap.b.length).toBe(1);
  expect(search._worker._indexedDocumentMap.b).toEqual(["cat"]);
});

test("SearchWorkerLoader search should search for the specified text", () => {
  const search = new SearchWorkerLoader({ WorkerClass: StubWorker });
  search.search("cat");
  expect(search._worker._searchQueue.length).toEqual(1);
  expect(search._worker._searchQueue[0].query).toEqual("cat");
});

test("SearchWorkerLoader search should resolve the returned Promise on search completion", async done => {
  const search = new SearchWorkerLoader({ WorkerClass: StubWorker });
  const promise = search.search("cat");
  search._worker.resolveSearch(0, ["a", "b"]);

  const result = await promise;
  expect(result).toEqual(["a", "b"]);
  done();
});

test("SearchWorkerLoader search should resolve multiple concurrent searches", async done => {
  const search = new SearchWorkerLoader({ WorkerClass: StubWorker });
  const promises = Promise.all([search.search("cat"), search.search("dog")]);
  search._worker.resolveSearch(0, ["a"]);
  search._worker.resolveSearch(1, ["a", "b"]);
  await promises;
  done();
});

test("SearchWorkerLoader search should resolve searches in the correct order", async done => {
  const search = new SearchWorkerLoader({ WorkerClass: StubWorker });
  const results = [];
  const promiseList = [
    Promise.resolve(search.search("cat")),
    Promise.resolve(search.search("dog")),
    Promise.resolve(search.search("rat"))
  ].map(promise => promise.then(result => results.push(result)));

  search._worker.resolveSearch(1, ["1"]);
  search._worker.resolveSearch(0, ["0"]);
  search._worker.resolveSearch(2, ["2"]);

  await Promise.all(promiseList);
  const [r1, r2, r3] = results;
  expect(r1).toEqual(["0"]);
  expect(r2).toEqual(["1"]);
  expect(r3).toEqual(["2"]);
  done();
});

test("SearchWorkerLoader search should not reject all searches if one fails", async done => {
  const search = new SearchWorkerLoader({ WorkerClass: StubWorker });
  const errors = [];
  const results = [];
  const promises = [
    Promise.resolve(search.search("cat")),
    Promise.resolve(search.search("dog"))
  ].map(promise =>
    promise
      .then(result => results.push(result))
      .catch(error => errors.push(error))
  );

  search._worker.rejectSearch(1, new Error("1"));
  search._worker.resolveSearch(0, ["0"]);

  try {
    await Promise.all(promises);
  } catch (err) {}

  expect(results.length).toBe(1);
  expect(results[0]).toEqual(["0"]);
  expect(errors.length).toBe(1);
  expect(errors[0].message).toBe("1");
  done();
});

test("SearchWorkerLoader should pass the specified :indexMode to the WorkerClass", () => {
  const search = new SearchWorkerLoader({
    indexMode: INDEX_MODES.EXACT_WORDS,
    WorkerClass: StubWorker
  });
  expect(search._worker._setIndexModeQueue.length).toBe(1);
  expect(search._worker._setIndexModeQueue[0].indexMode).toBe(
    INDEX_MODES.EXACT_WORDS
  );
});

test("SearchWorkerLoader should not override the default :indexMode in the WorkerClass if an override is not requested", () => {
  const search = new SearchWorkerLoader({ WorkerClass: StubWorker });
  expect(search._worker._setIndexModeQueue.length).toBe(0);
});

test("SearchWorkerLoader should pass the specified :tokenizePattern to the WorkerClass", () => {
  const search = new SearchWorkerLoader({
    tokenizePattern: /[^a-z0-9]+/,
    WorkerClass: StubWorker
  });
  expect(search._worker._setTokenizePatternQueue.length).toBe(1);
  expect(search._worker._setTokenizePatternQueue[0].tokenizePattern).toEqual(
    /[^a-z0-9]+/
  );
});

test("SearchWorkerLoader should pass the specified :caseSensitive bit to the WorkerClass", () => {
  const search = new SearchWorkerLoader({
    caseSensitive: true,
    WorkerClass: StubWorker
  });
  expect(search._worker._setCaseSensitiveQueue.length).toBe(1);
  expect(search._worker._setCaseSensitiveQueue[0].caseSensitive).toBe(true);
});

test("SearchWorkerLoader should pass the specified :matchAnyToken bit to the WorkerClass", () => {
  const search = new SearchWorkerLoader({
    matchAnyToken: true,
    WorkerClass: StubWorker
  });
  expect(search._worker._setMatchAnyTokenQueue.length).toBe(1);
  expect(search._worker._setMatchAnyTokenQueue[0].matchAnyToken).toBe(true);
});

test("SearchWorkerLoader should pass the specified :maxDpetgh to the WorkerClass", () => {
  const search = new SearchWorkerLoader({
    maxDepth: 100,
    WorkerClass: StubWorker
  });
  expect(search._worker._setTokenizePatternQueue.length).toBe(1);
  expect(search._worker._setTokenizePatternQueue[0].maxDepth).toBe(100);
});
