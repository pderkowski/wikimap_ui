var Website = require('./website/website');
var Wikimap = require('./wikimap/wikimap');

$(document).ready(function() {
  var website = Website();
  var wikimap = new Wikimap();
  wikimap.start();
});