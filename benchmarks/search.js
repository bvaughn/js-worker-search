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
    setupTest();
  });
}

var lunrJsIndex;
var searchLatest;
var searchLocal;
var searchTerms = ["letter", "world", "wife", "love", "foobar"];
var searchTermsLength = searchTerms.length;

function setupTest() {
  lunrJsIndex = new lunr.Index();
  lunrJsIndex.field("title");
  lunrJsIndex.field("author");
  lunrJsIndex.ref("isbn");
  for (var i = 0, length = books.length; i < length; i++) {
    lunrJsIndex.add(books[i]);
  }

  searchLatest = buildIndex(JsSearchLatest);
  searchLocal = buildIndex(JsSearchLocal);

  runTests();
}

function buildIndex(SearchApi) {
  var search = new SearchApi({ indexMode });
  books.forEach(book => {
    const { author, isbn, title } = book;
    search.indexDocument(isbn, author);
    search.indexDocument(isbn, title);
  });

  return search;
}

function doSearch(search) {
  for (var i = 0, length = searchTermsLength; i < length; i++) {
    search.search(searchTerms[i]);
  }
}

function runTests() {
  console.log("Testing search speeds ...");

  new Benchmark.Suite()
    .on("cycle", event => {
      bb.add(event.target);
    })
    .on("complete", () => {
      bb.log();
    })
    .add("lunr", () => {
      doSearch(lunrJsIndex);
    })
    .add("js-search:latest", () => {
      doSearch(searchLatest);
    })
    .add("js-search:local", () => {
      doSearch(searchLocal);
    })
    .run({ async: true });
}

loadBooks();
