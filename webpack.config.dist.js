const path = require('path')

module.exports = {
  devtool: 'source-map',
  entry: [
    './src/index.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'js-worker-search.js',
    libraryTarget: 'commonjs2',
    library: 'redux-search'
  },
  plugins: [
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        include: path.join(__dirname, 'src')
      }
    ]
  }
}
