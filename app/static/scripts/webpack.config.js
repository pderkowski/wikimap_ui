var webpack = require('webpack');

module.exports = {
  entry: './main.js',
  output: {
    path: './dist',
    filename: 'app.bundle.js'
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    })
  ]
};