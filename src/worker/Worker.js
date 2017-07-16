/** @flow */

import { SearchUtility } from "../util";

/**
 * Search entry point to web worker.
 * Builds search index and performs searches on separate thread from the ui.
 */

const searchUtility = new SearchUtility();

self.addEventListener(
  "message",
  event => {
    const { data } = event;
    const { method } = data;

    switch (method) {
      case "indexDocument":
        const { uid, text } = data;

        searchUtility.indexDocument(uid, text);
        break;
      case "search":
        const { callbackId, query } = data;

        const results = searchUtility.search(query);

        self.postMessage({ callbackId, results });
        break;
      case "setIndexMode":
        const { indexMode } = data;

        searchUtility.setIndexMode(indexMode);
        break;
    }
  },
  false
);
