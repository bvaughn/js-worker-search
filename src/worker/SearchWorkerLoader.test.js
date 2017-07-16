/** @flow */

import test from "tape";
import SearchWorkerLoader from "./SearchWorkerLoader";
import { INDEX_MODES } from "../util";

import type { CallbackData } from "./SearchWorkerLoader";

function noop() {}

class StubWorker {
  onerror: ({ data: CallbackData }) => void;
  onmessage: ({ data: CallbackData }) => void;

  _indexedDocumentMap = {};
  _searchQueue = [];
  _setIndexModeQueue = [];

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
      case "setIndexMode":
        const { indexMode } = props;
        this._setIndexModeQueue.push({ indexMode });
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

test("SearchWorkerLoader indexDocument should index a document with the specified text(s)", t => {
  const search = new SearchWorkerLoader({ WorkerClass: StubWorker });
  search.indexDocument("a", "cat");
  search.indexDocument("a", "dog");
  search.indexDocument("b", "cat");

  t.equal(Object.keys(search._worker._indexedDocumentMap).length, 2);
  t.equal(search._worker._indexedDocumentMap.a.length, 2);
  t.deepLooseEqual(search._worker._indexedDocumentMap.a, ["cat", "dog"]);
  t.equal(search._worker._indexedDocumentMap.b.length, 1);
  t.deepLooseEqual(search._worker._indexedDocumentMap.b, ["cat"]);
  t.end();
});

test("SearchWorkerLoader search should search for the specified text", t => {
  const search = new SearchWorkerLoader({ WorkerClass: StubWorker });
  search.search("cat");
  t.equal(search._worker._searchQueue.length, 1);
  t.equal(search._worker._searchQueue[0].query, "cat");
  t.end();
});

test("SearchWorkerLoader search should resolve the returned Promise on search completion", async t => {
  const search = new SearchWorkerLoader({ WorkerClass: StubWorker });
  const promise = search.search("cat");
  search._worker.resolveSearch(0, ["a", "b"]);

  const result = await promise;
  t.deepLooseEqual(result, ["a", "b"]);
  t.end();
});

test("SearchWorkerLoader search should resolve multiple concurrent searches", async t => {
  const search = new SearchWorkerLoader({ WorkerClass: StubWorker });
  const promises = Promise.all([search.search("cat"), search.search("dog")]);
  search._worker.resolveSearch(0, ["a"]);
  search._worker.resolveSearch(1, ["a", "b"]);
  await promises;
  t.end();
});

test("SearchWorkerLoader search should resolve searches in the correct order", async t => {
  const search = new SearchWorkerLoader({ WorkerClass: StubWorker });
  const results = [];
  const promiseList = [
    search.search("cat"),
    search.search("dog"),
    search.search("rat")
  ].map(promise => promise.then(result => results.push(result)));

  search._worker.resolveSearch(1, ["1"]);
  search._worker.resolveSearch(0, ["0"]);
  search._worker.resolveSearch(2, ["2"]);

  await Promise.all(promiseList);
  const [r1, r2, r3] = results;
  t.deepLooseEqual(r1, ["0"]);
  t.deepLooseEqual(r2, ["1"]);
  t.deepLooseEqual(r3, ["2"]);
  t.end();
});

test("SearchWorkerLoader search should not reject all searches if one fails", async t => {
  const search = new SearchWorkerLoader({ WorkerClass: StubWorker });
  const errors = [];
  const results = [];
  const promises = [search.search("cat"), search.search("dog")].map(promise =>
    promise
      .then(result => results.push(result))
      .catch(error => errors.push(error))
  );

  search._worker.rejectSearch(1, new Error("1"));
  search._worker.resolveSearch(0, ["0"]);

  try {
    await Promise.all(promises);
  } catch (err) {}

  t.equal(results.length, 1);
  t.deepLooseEqual(results[0], ["0"]);
  t.equal(errors.length, 1);
  t.equal(errors[0].message, "1");
  t.end();
});

test("SearchWorkerLoader should pass the specified :indexMode to the WorkerClass", t => {
  const search = new SearchWorkerLoader({
    indexMode: INDEX_MODES.EXACT_WORDS,
    WorkerClass: StubWorker
  });
  t.equal(search._worker._setIndexModeQueue.length, 1);
  t.equal(
    search._worker._setIndexModeQueue[0].indexMode,
    INDEX_MODES.EXACT_WORDS
  );
  t.end();
});

test("SearchWorkerLoader should not override the default :indexMode in the WorkerClass if an override is not requested", t => {
  const search = new SearchWorkerLoader({ WorkerClass: StubWorker });
  t.equal(search._worker._setIndexModeQueue.length, 0);
  t.end();
});
