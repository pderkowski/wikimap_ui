var $ = require('jquery');
var Wikimap = require('./wikimap');
var search = require('./search');

$(document).ready(function() {
  var wikimap = new Wikimap();
  wikimap.start()
    .then(search(wikimap));
});