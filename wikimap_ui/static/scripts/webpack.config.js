var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: './main.js',
  output: {
    path: './dist',
    filename: 'app.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    })
  ],
  resolve: {
    root: [
      path.resolve('.')
    ]
  }
};
