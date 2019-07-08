const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: {
    "js-worker-search": "./src/index.js"
  },
  output: {
    path: "dist",
    filename: "[name].js",
    libraryTarget: "commonjs2",
    library: "redux-search"
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      exclude: /.*worker\.js$/,
      filename: "[name].js.map"
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: "babel",
        include: path.join(__dirname, "src")
      }
    ]
  }
};
