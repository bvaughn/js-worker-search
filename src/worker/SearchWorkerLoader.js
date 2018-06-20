/** @flow */

import uuid from "uuid";

import type { IndexMode } from "../util";
import type { SearchApiIndex } from "../types";

type Results = Array<any>;
type RejectFn = (error: Error) => void;
type ResolveFn = (results: Results) => void;
export type CallbackData = {
  callbackId: string,
  complete: boolean,
  error: ?Error,
  reject: RejectFn,
  resolve: ResolveFn,
  results: ?Results
};
type CallbackIdMap = { [callbackId: string]: CallbackData };
type CallbackQueue = Array<CallbackData>;

type Worker = any; // TODO

/**
 * Client side, full text search utility.
 * This interface exposes web worker search capabilities to the UI thread.
 */
export default class SearchWorkerLoader implements SearchApiIndex {
  _callbackIdMap: CallbackIdMap;
  _callbackQueue: CallbackQueue;
  _worker: Worker;

  /**
   * Constructor.
   */
  constructor({
    indexMode,
    tokenizePattern,
    caseSensitive,
    WorkerClass
  }: {
    indexMode?: IndexMode,
    tokenizePattern?: RegExp,
    caseSensitive?: boolean,
    WorkerClass?: Class<Worker>
  } = {}) {
    // Defer worker import until construction to avoid testing error:
    // Error: Cannot find module 'worker!./[workername]'
    if (!WorkerClass) {
      // $FlowFixMe eslint-disable-next-line
      WorkerClass = require("worker?inline=true!./Worker");
    }

    this._callbackQueue = [];
    this._callbackIdMap = {};

    this._worker = new WorkerClass();
    this._worker.onerror = event => {
      if (event.data) {
        const { callbackId, error } = event.data;
        this._updateQueue({ callbackId, error });
      } else {
        console.error(event);
      }
    };
    this._worker.onmessage = event => {
      const { callbackId, results } = event.data;
      this._updateQueue({ callbackId, results });
    };

    // Override default :indexMode if a specific one has been requested
    if (indexMode) {
      this._worker.postMessage({
        method: "setIndexMode",
        indexMode
      });
    }

    // Override default :tokenizePattern if a specific one has been requested
    if (tokenizePattern) {
      this._worker.postMessage({
        method: "setTokenizePattern",
        tokenizePattern
      });
    }

    // Override default :caseSensitive bit if a specific one has been requested
    if (caseSensitive) {
      this._worker.postMessage({
        method: "setCaseSensitive",
        caseSensitive
      });
    }
  }

  /**
   * Adds or updates a uid in the search index and associates it with the specified text.
   * Note that at this time uids can only be added or updated in the index, not removed.
   *
   * @param uid Uniquely identifies a searchable object
   * @param text Text to associate with uid
   */
  indexDocument = (uid: any, text: string): SearchApiIndex => {
    this._worker.postMessage({
      method: "indexDocument",
      text,
      uid
    });

    return this;
  };

  /**
   * Searches the current index for the specified query text.
   * Only uids matching all of the words within the text will be accepted.
   * If an empty query string is provided all indexed uids will be returned.
   *
   * Document searches are case-insensitive (e.g. "search" will match "Search").
   * Document searches use substring matching (e.g. "na" and "me" will both match "name").
   *
   * @param query Searchable query text
   * @return Promise to be resolved with an array of uids
   */
  search = (query: string): Promise<Array<any>> => {
    return new Promise((resolve: ResolveFn, reject: RejectFn) => {
      const callbackId = uuid.v4();
      const data = {
        callbackId,
        complete: false,
        error: null,
        reject,
        resolve,
        results: null
      };

      this._worker.postMessage({
        method: "search",
        query,
        callbackId
      });

      this._callbackQueue.push(data);
      this._callbackIdMap[callbackId] = data;
    });
  };

  /**
   *  Stops and retires the worker. Used for cleanup.
   */
  terminate = () => {
    this._worker.terminate();
  };

  /**
   * Updates the queue and flushes any completed promises that are ready.
   */
  _updateQueue({
    callbackId,
    error,
    results
  }: {
    callbackId: string,
    error?: Error,
    results?: Results
  }) {
    const target = this._callbackIdMap[callbackId];
    target.complete = true;
    target.error = error;
    target.results = results;

    while (this._callbackQueue.length) {
      let data = this._callbackQueue[0];

      if (!data.complete) {
        break;
      }

      this._callbackQueue.shift();

      delete this._callbackIdMap[data.callbackId];

      if (data.error) {
        data.reject(data.error);
      } else {
        // This type will always be defined in this case;
        // This casting lets Flow know it's safe.
        data.resolve((data.results: any));
      }
    }
  }
}
