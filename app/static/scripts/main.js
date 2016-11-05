var $ = require('jquery');
var Wikimap = require('./wikimap');

$(document).ready(function() {
  var wikimap = new Wikimap();
  wikimap.start();
});