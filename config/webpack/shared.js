// Note: You must restart bin/webpack-watcher for changes to take effect

var path = require('path')
var glob = require('glob')
var extname = require('path-complete-extname')
var webpack = require('webpack')

module.exports = {
  entry: glob.sync(path.join('..', 'app', 'javascript', 'packs', '*.js*')).reduce(
    function(map, entry) {
      var basename = path.basename(entry, extname(entry))
      map[basename] = entry
      return map
    }, {
      vendor: ['jquery', 'react', 'react-dom', 'react-router'],
    }
  ),

  output: { filename: '[name].js', path: path.resolve('..', 'public', 'packs') },

  module: {
    rules: [
      { test: /\.coffee(.erb)?$/, loader: "coffee-loader" },
      {
        test: /\.jsx?(.erb)?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            'react',
            [ 'latest', { 'es2015': { 'modules': false } } ]
          ]
        }
      },
      {
        test: /\.erb$/,
        enforce: 'pre',
        loader: 'rails-erb-loader',
        options: {
          runner: '../bin/rails runner'
        }
      },
    ]
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin("vendor")
  ],

  resolve: {
    extensions: [ '.js', '.coffee' ],
    modules: [
      path.resolve('../app/javascript'),
      path.resolve('../node_modules'),
      path.resolve('../vendor/node_modules')
    ]
  },

  resolveLoader: {
    modules: [
      path.resolve('../node_modules'),
      path.resolve('../vendor/node_modules'),
    ]
  }
}
