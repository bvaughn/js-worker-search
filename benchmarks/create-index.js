const Benchmark = require("benchmark");
const bb = require("beautify-benchmark");
const lunr = require("lunr");
const JsSearchLatest = require("js-worker-search").default;
const JsSearchLocal = require("../dist/js-worker-search").default;

const indexMode = "EXACT_WORDS";

let books;
function loadBooks() {
  const fs = require("fs");
  fs.readFile("books.json", "utf8", (err, data) => {
    books = JSON.parse(data).books;
    runTests();
  });
}

function buildIndex(SearchApi) {
  var search = new SearchApi({ indexMode });
  books.forEach(book => {
    const { author, isbn, title } = book;
    search.indexDocument(isbn, author);
    search.indexDocument(isbn, title);
  });
}

function runTests() {
  new Benchmark.Suite()
    .on("cycle", event => {
      console.log(String(event.target));
      bb.add(event.target);
    })
    .on("complete", () => {
      bb.log();
    })
    .add("lunr", () => {
      var lunrJsIndex = new lunr.Index();
      lunrJsIndex.field("title");
      lunrJsIndex.field("author");
      lunrJsIndex.ref("isbn");
      for (var i = 0, length = books.length; i < length; i++) {
        lunrJsIndex.add(books[i]);
      }
    })
    .add("js-worker-search:latest", () => {
      buildIndex(JsSearchLatest);
    })
    .add("js-worker-search:local", () => {
      buildIndex(JsSearchLocal);
    })
    .run({ async: true });
}

loadBooks();
